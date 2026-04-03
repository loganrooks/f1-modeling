#!/usr/bin/env python3
"""
Circuit geometry pipeline.

Replaces hand-authored x/y coordinates in circuit preset JSON files with
real GPS-derived geometry from external data sources:

  - Monza, Silverstone: TUMFTM racetrack-database (LGPL-3.0), CSV centerlines
  - Monaco: bacinger/f1-circuits (MIT), GeoJSON centerline

Preserves existing hand-authored curvature arrays (GPS noise produces
implausible corner radii). Re-indexes curvature and sector/corner annotations
to the new distance array proportionally.

Usage:
    python3 scripts/build-circuit-geometry.py --circuit monza
    python3 scripts/build-circuit-geometry.py --circuit monaco
    python3 scripts/build-circuit-geometry.py --all

Requires: numpy, scipy (available in base Python environment).
"""

import argparse
import csv
import json
import math
import os
import sys

import numpy as np
from scipy.interpolate import splprep, splev


# ---- Paths ----

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(SCRIPT_DIR)
SOURCES_DIR = os.path.join(REPO_ROOT, "presets", "circuits", "sources")
PRESETS_DIR = os.path.join(REPO_ROOT, "presets", "circuits")


# ---- Circuit definitions ----

CIRCUITS = {
    "monza": {
        "source_type": "tumftm",
        "source_file": "Monza.csv",
        "provenance": {
            "sourceType": "documented-fact",
            "source": "TUMFTM racetrack-database (LGPL-3.0), GPS centerlines from OpenStreetMap",
            "notes": "x/y from TUMFTM ~5m spacing, curvature hand-authored from published corner radii, distances re-indexed proportionally",
        },
        "assumption_notes": [
            {
                "note": "Curvature values derived from published corner radii with smooth transitions. Actual track geometry includes banking, camber, and elevation changes not captured here.",
                "provenance": {
                    "sourceType": "engineering-inference",
                    "source": "Public track guides and corner radii databases",
                },
            },
            {
                "note": "Spatial coordinates (x/y) derived from GPS centerline data (TUMFTM racetrack-database, ~5m spacing). Curvature is NOT derived from GPS data due to noise; hand-authored values are retained.",
                "provenance": {
                    "sourceType": "documented-fact",
                    "source": "TUMFTM racetrack-database (LGPL-3.0)",
                },
            },
        ],
    },
    "silverstone": {
        "source_type": "tumftm",
        "source_file": "Silverstone.csv",
        "provenance": {
            "sourceType": "documented-fact",
            "source": "TUMFTM racetrack-database (LGPL-3.0), GPS centerlines from OpenStreetMap",
            "notes": "x/y from TUMFTM ~5m spacing, curvature hand-authored from published corner radii, distances re-indexed proportionally",
        },
        "assumption_notes": [
            {
                "note": "Curvature values derived from published corner radii with smooth transitions. Actual track geometry includes banking, camber, and elevation changes not captured here.",
                "provenance": {
                    "sourceType": "engineering-inference",
                    "source": "Public track guides and corner radii databases",
                },
            },
            {
                "note": "Spatial coordinates (x/y) derived from GPS centerline data (TUMFTM racetrack-database, ~5m spacing). Curvature is NOT derived from GPS data due to noise; hand-authored values are retained.",
                "provenance": {
                    "sourceType": "documented-fact",
                    "source": "TUMFTM racetrack-database (LGPL-3.0)",
                },
            },
        ],
    },
    "monaco": {
        "source_type": "bacinger",
        "source_file": "mc-1929.geojson",
        "provenance": {
            "sourceType": "documented-fact",
            "source": "bacinger/f1-circuits (MIT), GeoJSON centerline with equirectangular projection",
            "notes": "x/y from bacinger ~21m spacing resampled to 5m via periodic spline, curvature hand-authored from published corner radii, distances re-indexed proportionally. Lower resolution than TUMFTM; tight corners appear rounder than reality.",
        },
        "assumption_notes": [
            {
                "note": "Curvature values derived from published corner radii with smooth transitions. Actual track geometry includes banking, camber, and elevation changes not captured here.",
                "provenance": {
                    "sourceType": "engineering-inference",
                    "source": "Public track guides and corner radii databases",
                },
            },
            {
                "note": "Spatial coordinates (x/y) derived from GeoJSON centerline data (bacinger/f1-circuits, ~21m spacing resampled to 5m via periodic cubic spline). Equirectangular projection from WGS84. Curvature is NOT derived from GPS data due to noise; hand-authored values are retained. Lower resolution source means tight corners appear rounder than reality.",
                "provenance": {
                    "sourceType": "documented-fact",
                    "source": "bacinger/f1-circuits (MIT)",
                },
            },
        ],
    },
}


# ---- Parsers ----


def parse_tumftm_csv(filepath):
    """Parse TUMFTM CSV with header `# x_m,y_m,w_tr_right_m,w_tr_left_m`."""
    x_vals = []
    y_vals = []
    with open(filepath, "r") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            if line.startswith("#"):
                # Header line: `# x_m,y_m,w_tr_right_m,w_tr_left_m`
                continue
            parts = line.split(",")
            x_vals.append(float(parts[0]))
            y_vals.append(float(parts[1]))
    return np.array(x_vals), np.array(y_vals)


def parse_bacinger_geojson(filepath):
    """Parse bacinger GeoJSON and project to local meters."""
    with open(filepath, "r") as f:
        data = json.load(f)

    coords = data["features"][0]["geometry"]["coordinates"]

    # Drop duplicate closing point (coords[0] == coords[-1])
    if len(coords) > 1:
        first = coords[0]
        last = coords[-1]
        if abs(first[0] - last[0]) < 1e-9 and abs(first[1] - last[1]) < 1e-9:
            coords = coords[:-1]

    # Equirectangular projection to local meters
    R = 6_371_000  # Earth radius in meters
    lons = [c[0] for c in coords]
    lats = [c[1] for c in coords]
    lon_ref = sum(lons) / len(lons)
    lat_ref = sum(lats) / len(lats)

    x_vals = []
    y_vals = []
    for lon, lat in zip(lons, lats):
        x = R * math.radians(lon - lon_ref) * math.cos(math.radians(lat_ref))
        y = R * math.radians(lat - lat_ref)
        x_vals.append(x)
        y_vals.append(y)

    return np.array(x_vals), np.array(y_vals)


# ---- Spline fitting and resampling ----


def compute_arc_length(x, y):
    """Compute cumulative arc length of a polyline."""
    dx = np.diff(x)
    dy = np.diff(y)
    ds = np.sqrt(dx**2 + dy**2)
    return np.sum(ds)


def fit_and_resample(x, y, target_spacing=5.0):
    """
    Fit a periodic cubic B-spline through the points and resample
    at uniform arc-length spacing.

    Returns (x_new, y_new, distances, total_arc_length).
    """
    # Close the loop by appending the first point as the (N+1)th point
    x_closed = np.append(x, x[0])
    y_closed = np.append(y, y[0])

    # Compute total arc length of the closed polyline
    total_arc = compute_arc_length(x_closed, y_closed)

    # Fit periodic cubic B-spline (s=0: interpolating, per=True: periodic)
    tck, u = splprep([x_closed, y_closed], s=0, per=True, k=3)

    # Determine output point count
    n_out = round(total_arc / target_spacing)

    # Evaluate at uniform parameter values (endpoint=False for open-array convention)
    t_uniform = np.linspace(0, 1, n_out, endpoint=False)
    x_new, y_new = splev(t_uniform, tck)

    # Build distance array
    distances = np.linspace(0, total_arc, n_out, endpoint=False)

    return x_new, y_new, distances, total_arc


# ---- Curvature re-indexing ----


def reindex_curvature(existing_points, old_total_length, new_distances, new_total_length):
    """
    Re-index existing curvature array to new distance array using
    linear interpolation with periodic wrapping.

    Normalizes both distance arrays to [0, 1] to handle different total lengths.
    """
    old_distances = np.array([p["distance"] for p in existing_points])
    old_curvatures = np.array([p["curvature"] for p in existing_points])

    # Normalize to [0, 1]
    old_norm = old_distances / old_total_length
    new_norm = new_distances / new_total_length

    # Interpolate with periodic wrapping
    new_curvatures = np.interp(new_norm, old_norm, old_curvatures, period=1.0)

    return new_curvatures


# ---- Sector and corner re-mapping ----


def remap_sectors(sectors, old_total, new_total):
    """Scale sector distances proportionally to new total length."""
    scale = new_total / old_total
    remapped = []
    for sector in sectors:
        s = dict(sector)
        s["startDistance"] = round(s["startDistance"] * scale)
        s["endDistance"] = round(s["endDistance"] * scale)
        remapped.append(s)

    # Ensure last sector ends at new total length
    if remapped:
        remapped[-1]["endDistance"] = round(new_total)

    return remapped


def remap_corners(corners, old_total, new_total):
    """Scale corner distances proportionally to new total length."""
    scale = new_total / old_total
    remapped = []
    for corner in corners:
        c = dict(corner)
        c["apexDistance"] = round(c["apexDistance"] * scale)
        c["entryDistance"] = round(c["entryDistance"] * scale)
        c["exitDistance"] = round(c["exitDistance"] * scale)
        remapped.append(c)
    return remapped


# ---- Main pipeline ----


def build_circuit(circuit_name):
    """Build updated circuit preset from external geometry data."""
    config = CIRCUITS[circuit_name]

    # 1. Load source geometry
    source_path = os.path.join(SOURCES_DIR, config["source_file"])
    if not os.path.exists(source_path):
        print(f"ERROR: Source file not found: {source_path}")
        print(f"  Download it first or run with cached sources in {SOURCES_DIR}")
        sys.exit(1)

    if config["source_type"] == "tumftm":
        x_raw, y_raw = parse_tumftm_csv(source_path)
    elif config["source_type"] == "bacinger":
        x_raw, y_raw = parse_bacinger_geojson(source_path)
    else:
        print(f"ERROR: Unknown source type: {config['source_type']}")
        sys.exit(1)

    # 2. Load existing preset
    preset_path = os.path.join(PRESETS_DIR, f"{circuit_name}.json")
    if not os.path.exists(preset_path):
        print(f"ERROR: Existing preset not found: {preset_path}")
        sys.exit(1)

    with open(preset_path, "r") as f:
        doc = json.load(f)

    old_total = doc["totalLength"]
    existing_points = doc["points"]

    # 3. Fit periodic spline and resample at 5m spacing
    x_new, y_new, distances, total_arc = fit_and_resample(x_raw, y_raw)

    # 4. Re-index existing curvature to new distance array
    new_curvatures = reindex_curvature(existing_points, old_total, distances, total_arc)

    # 5. Build new points array
    new_total = round(total_arc)
    n_out = len(distances)
    new_points = []
    for i in range(n_out):
        new_points.append({
            "distance": round(distances[i]),
            "curvature": round(float(new_curvatures[i]), 6),
            "x": round(float(x_new[i]), 2),
            "y": round(float(y_new[i]), 2),
        })

    # 6. Re-map sector and corner annotations
    new_sectors = remap_sectors(doc["sectors"], old_total, total_arc)
    new_corners = remap_corners(doc["corners"], old_total, total_arc)

    # 7. Build updated document
    doc["totalLength"] = new_total
    doc["points"] = new_points
    doc["sectors"] = new_sectors
    doc["corners"] = new_corners
    doc["provenance"] = config["provenance"]
    doc["assumptionNotes"] = config["assumption_notes"]

    # 8. Write output
    with open(preset_path, "w") as f:
        json.dump(doc, f, indent=2)
        f.write("\n")

    # 9. Sanity print
    closure_gap = math.sqrt(
        (x_new[-1] - x_new[0]) ** 2 + (y_new[-1] - y_new[0]) ** 2
    )
    x_min, x_max = float(np.min(x_new)), float(np.max(x_new))
    y_min, y_max = float(np.min(y_new)), float(np.max(y_new))

    print(f"\n  {circuit_name.upper()}")
    print(f"  Points:      {n_out}")
    print(f"  Arc length:  {total_arc:.1f} m")
    print(f"  Total length:{new_total} m (rounded)")
    print(f"  Closure gap: {closure_gap:.2f} m")
    print(f"  Bounding box: x=[{x_min:.0f}, {x_max:.0f}] y=[{y_min:.0f}, {y_max:.0f}]")
    print(f"  Extent:      {x_max - x_min:.0f} x {y_max - y_min:.0f} m")
    print(f"  Written to:  {preset_path}")

    return {
        "name": circuit_name,
        "points": n_out,
        "arc_length": total_arc,
        "total_length": new_total,
        "closure_gap": closure_gap,
    }


# ---- CLI ----


def main():
    parser = argparse.ArgumentParser(
        description="Build circuit geometry from external data sources."
    )
    parser.add_argument(
        "--circuit",
        choices=list(CIRCUITS.keys()),
        help="Circuit to build (monza, monaco, silverstone)",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Build all circuits",
    )
    args = parser.parse_args()

    if not args.circuit and not args.all:
        parser.print_help()
        sys.exit(1)

    circuits_to_build = list(CIRCUITS.keys()) if args.all else [args.circuit]

    print("Circuit Geometry Pipeline")
    print("=" * 40)

    results = []
    for name in circuits_to_build:
        result = build_circuit(name)
        results.append(result)

    print("\n" + "=" * 40)
    print("Summary")
    print(f"{'Circuit':<12} {'Points':>7} {'Arc (m)':>10} {'Gap (m)':>8}")
    print("-" * 40)
    for r in results:
        print(f"{r['name']:<12} {r['points']:>7} {r['arc_length']:>10.1f} {r['closure_gap']:>8.2f}")


if __name__ == "__main__":
    main()
