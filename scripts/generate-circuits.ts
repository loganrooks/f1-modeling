/**
 * Circuit preset generator.
 *
 * Generates Monza, Monaco, and Silverstone circuit JSON files with
 * curvature arrays at 5m spacing and x/y spatial coordinates derived
 * from integrating the heading angle from curvature data.
 *
 * The circuits are built from segment descriptions (straights and corners)
 * using publicly known corner radii and track geometry. The x/y coordinates
 * are internally consistent but approximate -- not surveyed data.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const DS = 5; // meters per point

interface Segment {
  type: "straight" | "corner";
  length: number; // meters
  radius?: number; // meters (for corners; positive = left, negative = right)
  transitionIn?: number; // meters of entry transition
  transitionOut?: number; // meters of exit transition
}

interface CornerDef {
  cornerIndex: number;
  cornerName: string;
  apexSegmentIndex: number; // which segment in the array is this corner
}

interface SectorDef {
  sectorIndex: number;
  sectorName: string;
  startSegmentIndex: number;
  endSegmentIndex: number; // exclusive
}

interface CircuitDef {
  circuitId: string;
  name: string;
  configuration: string;
  segments: Segment[];
  corners: CornerDef[];
  sectors: SectorDef[];
}

function generateCircuit(def: CircuitDef) {
  // Build distance/curvature array from segments
  const rawPoints: { distance: number; curvature: number }[] = [];
  let dist = 0;
  // Track which segment each distance belongs to
  const segmentBoundaries: { start: number; end: number }[] = [];

  for (const seg of def.segments) {
    const segStart = dist;

    if (seg.type === "straight") {
      const numPoints = Math.round(seg.length / DS);
      for (let i = 0; i < numPoints; i++) {
        rawPoints.push({ distance: dist, curvature: 0 });
        dist += DS;
      }
    } else if (seg.type === "corner" && seg.radius !== undefined) {
      const totalLen = seg.length;
      const transIn = seg.transitionIn ?? 15;
      const transOut = seg.transitionOut ?? 15;
      const steadyLen = Math.max(totalLen - transIn - transOut, 0);
      const peakCurvature = 1 / seg.radius; // signed

      // Entry transition
      const transInPts = Math.max(Math.round(transIn / DS), 1);
      for (let i = 0; i < transInPts; i++) {
        const frac = (i + 1) / transInPts;
        // Smooth ramp using sine
        const curvature = peakCurvature * Math.sin((frac * Math.PI) / 2);
        rawPoints.push({ distance: dist, curvature });
        dist += DS;
      }

      // Steady-state corner
      const steadyPts = Math.round(steadyLen / DS);
      for (let i = 0; i < steadyPts; i++) {
        rawPoints.push({ distance: dist, curvature: peakCurvature });
        dist += DS;
      }

      // Exit transition
      const transOutPts = Math.max(Math.round(transOut / DS), 1);
      for (let i = 0; i < transOutPts; i++) {
        const frac = (transOutPts - i) / transOutPts;
        const curvature = peakCurvature * Math.sin((frac * Math.PI) / 2);
        rawPoints.push({ distance: dist, curvature });
        dist += DS;
      }
    }

    segmentBoundaries.push({ start: segStart, end: dist });
  }

  const totalLength = dist;

  // Generate x/y by integrating heading from curvature
  let heading = 0; // radians
  let x = 0;
  let y = 0;

  const points = rawPoints.map((p, i) => {
    const result = {
      distance: Math.round(p.distance * 100) / 100,
      curvature: Math.round(p.curvature * 1e6) / 1e6,
      x: Math.round(x * 100) / 100,
      y: Math.round(y * 100) / 100,
    };

    // Advance position
    if (i < rawPoints.length - 1) {
      heading += p.curvature * DS;
      x += DS * Math.cos(heading);
      y += DS * Math.sin(heading);
    }

    return result;
  });

  // Build sectors
  const sectors = def.sectors.map((s) => {
    const startBound = segmentBoundaries[s.startSegmentIndex];
    const endBound = segmentBoundaries[s.endSegmentIndex - 1];
    return {
      sectorIndex: s.sectorIndex,
      sectorName: s.sectorName,
      startDistance: startBound?.start ?? 0,
      endDistance: endBound?.end ?? totalLength,
    };
  });

  // Ensure last sector ends at totalLength
  const lastSector = sectors[sectors.length - 1];
  if (lastSector) {
    lastSector.endDistance = totalLength;
  }

  // Build corners
  const corners = def.corners.map((c) => {
    const bound = segmentBoundaries[c.apexSegmentIndex];
    if (!bound) return null;
    const apexDistance = (bound.start + bound.end) / 2;
    return {
      cornerIndex: c.cornerIndex,
      cornerName: c.cornerName,
      apexDistance: Math.round(apexDistance),
      entryDistance: Math.round(bound.start),
      exitDistance: Math.round(bound.end),
    };
  }).filter((c): c is NonNullable<typeof c> => c !== null);

  return {
    schemaVersion: "circuit-document/v1",
    circuitId: def.circuitId,
    name: def.name,
    configuration: def.configuration,
    totalLength: Math.round(totalLength),
    points,
    sectors,
    corners,
    provenance: {
      sourceType: "engineering-inference" as const,
      source: "Hand-authored from public track layout data and published corner radii",
      notes:
        "Approximate geometry for sensitivity analysis. Not surveyed data.",
    },
    assumptionNotes: [
      {
        note: "Curvature values derived from published corner radii with smooth transitions. Actual track geometry includes banking, camber, and elevation changes not captured here.",
        provenance: {
          sourceType: "engineering-inference" as const,
          source: "Public track guides and corner radii databases",
        },
      },
      {
        note: "Spatial coordinates (x/y) are integrated from curvature and may not close perfectly. They represent approximate track shape for visualization, not GPS-accurate positions.",
        provenance: {
          sourceType: "engineering-inference" as const,
          source: "Heading integration from curvature array",
        },
      },
    ],
  };
}

// ============ MONZA ============
// ~5793m, low downforce, long straights, two chicanes, Lesmos, Ascari, Parabolica
const monzaDef: CircuitDef = {
  circuitId: "monza",
  name: "Autodromo Nazionale Monza",
  configuration: "grand-prix",
  segments: [
    // S/F straight (Rettifilo) to Variante del Rettifilo (~1180m)
    { type: "straight", length: 1180 },
    // T1: Variante del Rettifilo - right
    { type: "corner", length: 80, radius: -45, transitionIn: 15, transitionOut: 15 },
    // T2: Variante del Rettifilo - left
    { type: "corner", length: 70, radius: 35, transitionIn: 15, transitionOut: 15 },
    // Short straight to Curva Grande
    { type: "straight", length: 320 },
    // T3: Curva Grande (long sweeping right)
    { type: "corner", length: 280, radius: -180, transitionIn: 30, transitionOut: 30 },
    // Straight to Variante della Roggia
    { type: "straight", length: 420 },
    // T4: Variante della Roggia - left
    { type: "corner", length: 75, radius: 40, transitionIn: 15, transitionOut: 15 },
    // T5: Variante della Roggia - right
    { type: "corner", length: 70, radius: -35, transitionIn: 15, transitionOut: 15 },
    // Short link to Lesmo
    { type: "straight", length: 170 },
    // T6: Lesmo 1 (left)
    { type: "corner", length: 130, radius: 65, transitionIn: 20, transitionOut: 20 },
    // Short straight
    { type: "straight", length: 120 },
    // T7: Lesmo 2 (left)
    { type: "corner", length: 120, radius: 55, transitionIn: 20, transitionOut: 20 },
    // Straight under bridge
    { type: "straight", length: 380 },
    // T8-T9-T10: Ascari chicane (right-left-right)
    { type: "corner", length: 70, radius: -60, transitionIn: 15, transitionOut: 12 },
    { type: "corner", length: 60, radius: 55, transitionIn: 12, transitionOut: 12 },
    { type: "corner", length: 70, radius: -65, transitionIn: 12, transitionOut: 15 },
    // Back straight (~1145m)
    { type: "straight", length: 1145 },
    // T11: Curva Parabolica (Alboreto) - right
    { type: "corner", length: 380, radius: -100, transitionIn: 35, transitionOut: 35 },
    // Pit straight back to S/F (~650m)
    { type: "straight", length: 650 },
  ],
  corners: [
    { cornerIndex: 0, cornerName: "Variante del Rettifilo R", apexSegmentIndex: 1 },
    { cornerIndex: 1, cornerName: "Variante del Rettifilo L", apexSegmentIndex: 2 },
    { cornerIndex: 2, cornerName: "Curva Grande", apexSegmentIndex: 4 },
    { cornerIndex: 3, cornerName: "Variante della Roggia L", apexSegmentIndex: 6 },
    { cornerIndex: 4, cornerName: "Variante della Roggia R", apexSegmentIndex: 7 },
    { cornerIndex: 5, cornerName: "Lesmo 1", apexSegmentIndex: 9 },
    { cornerIndex: 6, cornerName: "Lesmo 2", apexSegmentIndex: 11 },
    { cornerIndex: 7, cornerName: "Ascari 1", apexSegmentIndex: 13 },
    { cornerIndex: 8, cornerName: "Ascari 2", apexSegmentIndex: 14 },
    { cornerIndex: 9, cornerName: "Ascari 3", apexSegmentIndex: 15 },
    { cornerIndex: 10, cornerName: "Curva Parabolica", apexSegmentIndex: 17 },
  ],
  sectors: [
    { sectorIndex: 0, sectorName: "Sector 1", startSegmentIndex: 0, endSegmentIndex: 6 },
    { sectorIndex: 1, sectorName: "Sector 2", startSegmentIndex: 6, endSegmentIndex: 13 },
    { sectorIndex: 2, sectorName: "Sector 3", startSegmentIndex: 13, endSegmentIndex: 19 },
  ],
};

// ============ MONACO ============
// ~3337m, highest downforce, very tight corners
const monacoDef: CircuitDef = {
  circuitId: "monaco",
  name: "Circuit de Monaco",
  configuration: "grand-prix",
  segments: [
    // S/F to Sainte Devote (~430m)
    { type: "straight", length: 430 },
    // T1: Sainte Devote (right)
    { type: "corner", length: 70, radius: -30, transitionIn: 12, transitionOut: 12 },
    // Beau Rivage hill climb (slight left curve, ~400m)
    { type: "corner", length: 400, radius: 500, transitionIn: 20, transitionOut: 20 },
    // T3: Massenet (left)
    { type: "corner", length: 85, radius: 50, transitionIn: 15, transitionOut: 15 },
    // Short link
    { type: "straight", length: 50 },
    // T4: Casino Square (right)
    { type: "corner", length: 75, radius: -40, transitionIn: 15, transitionOut: 15 },
    // Downhill to Mirabeau (~150m)
    { type: "straight", length: 150 },
    // T5: Mirabeau Haute (right)
    { type: "corner", length: 60, radius: -30, transitionIn: 12, transitionOut: 12 },
    // Short link to hairpin
    { type: "straight", length: 50 },
    // T6: Grand Hotel Hairpin (Loews) - left, very tight
    { type: "corner", length: 60, radius: 10, transitionIn: 10, transitionOut: 10 },
    // T7: Mirabeau Bas (right)
    { type: "corner", length: 50, radius: -25, transitionIn: 10, transitionOut: 10 },
    // Portier
    { type: "corner", length: 55, radius: -35, transitionIn: 12, transitionOut: 12 },
    // Tunnel straight (~520m)
    { type: "straight", length: 520 },
    // T10: Nouvelle Chicane (left-right)
    { type: "corner", length: 55, radius: 25, transitionIn: 10, transitionOut: 10 },
    { type: "corner", length: 50, radius: -25, transitionIn: 10, transitionOut: 10 },
    // Short straight
    { type: "straight", length: 85 },
    // T12: Tabac (left)
    { type: "corner", length: 80, radius: 45, transitionIn: 15, transitionOut: 15 },
    // Short link
    { type: "straight", length: 60 },
    // T13-T14: Swimming Pool chicane
    { type: "corner", length: 55, radius: -30, transitionIn: 10, transitionOut: 10 },
    { type: "corner", length: 55, radius: 30, transitionIn: 10, transitionOut: 10 },
    // Short straight
    { type: "straight", length: 110 },
    // T15: Rascasse (right, very tight)
    { type: "corner", length: 60, radius: -15, transitionIn: 10, transitionOut: 10 },
    // Short link
    { type: "straight", length: 90 },
    // T16: Anthony Noghes (right)
    { type: "corner", length: 60, radius: -25, transitionIn: 12, transitionOut: 12 },
    // Pit straight back to S/F (~510m)
    { type: "straight", length: 510 },
  ],
  corners: [
    { cornerIndex: 0, cornerName: "Sainte Devote", apexSegmentIndex: 1 },
    { cornerIndex: 1, cornerName: "Beau Rivage", apexSegmentIndex: 2 },
    { cornerIndex: 2, cornerName: "Massenet", apexSegmentIndex: 3 },
    { cornerIndex: 3, cornerName: "Casino Square", apexSegmentIndex: 5 },
    { cornerIndex: 4, cornerName: "Mirabeau Haute", apexSegmentIndex: 7 },
    { cornerIndex: 5, cornerName: "Grand Hotel Hairpin", apexSegmentIndex: 9 },
    { cornerIndex: 6, cornerName: "Mirabeau Bas", apexSegmentIndex: 10 },
    { cornerIndex: 7, cornerName: "Portier", apexSegmentIndex: 11 },
    { cornerIndex: 8, cornerName: "Nouvelle Chicane L", apexSegmentIndex: 13 },
    { cornerIndex: 9, cornerName: "Nouvelle Chicane R", apexSegmentIndex: 14 },
    { cornerIndex: 10, cornerName: "Tabac", apexSegmentIndex: 16 },
    { cornerIndex: 11, cornerName: "Swimming Pool 1", apexSegmentIndex: 18 },
    { cornerIndex: 12, cornerName: "Swimming Pool 2", apexSegmentIndex: 19 },
    { cornerIndex: 13, cornerName: "Rascasse", apexSegmentIndex: 21 },
    { cornerIndex: 14, cornerName: "Anthony Noghes", apexSegmentIndex: 23 },
  ],
  sectors: [
    { sectorIndex: 0, sectorName: "Sector 1", startSegmentIndex: 0, endSegmentIndex: 9 },
    { sectorIndex: 1, sectorName: "Sector 2", startSegmentIndex: 9, endSegmentIndex: 17 },
    { sectorIndex: 2, sectorName: "Sector 3", startSegmentIndex: 17, endSegmentIndex: 25 },
  ],
};

// ============ SILVERSTONE ============
// ~5891m, high-speed corners, mix of character
const silverstoneDef: CircuitDef = {
  circuitId: "silverstone",
  name: "Silverstone Circuit",
  configuration: "grand-prix",
  segments: [
    // Hamilton Straight to Copse (~800m)
    { type: "straight", length: 800 },
    // T1: Copse (right, fast)
    { type: "corner", length: 140, radius: -120, transitionIn: 20, transitionOut: 20 },
    // Short straight to Maggotts (~200m)
    { type: "straight", length: 200 },
    // T2-T3: Maggotts-Becketts complex (left-right-left-right)
    { type: "corner", length: 90, radius: 80, transitionIn: 15, transitionOut: 10 },
    { type: "corner", length: 80, radius: -70, transitionIn: 10, transitionOut: 10 },
    { type: "corner", length: 90, radius: 75, transitionIn: 10, transitionOut: 15 },
    { type: "corner", length: 75, radius: -80, transitionIn: 10, transitionOut: 15 },
    // Chapel (exit of Becketts complex)
    { type: "corner", length: 70, radius: 95, transitionIn: 15, transitionOut: 15 },
    // Hangar Straight (~960m)
    { type: "straight", length: 960 },
    // T6: Stowe (right)
    { type: "corner", length: 110, radius: -80, transitionIn: 20, transitionOut: 20 },
    // Short link
    { type: "straight", length: 85 },
    // T7: Vale (left)
    { type: "corner", length: 90, radius: 50, transitionIn: 15, transitionOut: 15 },
    // T8: Club (right)
    { type: "corner", length: 110, radius: -60, transitionIn: 15, transitionOut: 15 },
    // Short straight
    { type: "straight", length: 160 },
    // T9-T10: Abbey chicane
    { type: "corner", length: 80, radius: -55, transitionIn: 15, transitionOut: 10 },
    { type: "corner", length: 75, radius: 60, transitionIn: 10, transitionOut: 15 },
    // Farm Straight (~310m)
    { type: "straight", length: 310 },
    // T11: Village (right)
    { type: "corner", length: 90, radius: -35, transitionIn: 15, transitionOut: 15 },
    // Short link
    { type: "straight", length: 85 },
    // T12: The Loop (left, slow)
    { type: "corner", length: 145, radius: 30, transitionIn: 15, transitionOut: 15 },
    // T13: Aintree (right)
    { type: "corner", length: 65, radius: -50, transitionIn: 12, transitionOut: 12 },
    // Wellington Straight (~710m)
    { type: "straight", length: 710 },
    // T14: Brooklands (right)
    { type: "corner", length: 100, radius: -30, transitionIn: 15, transitionOut: 15 },
    // Short link
    { type: "straight", length: 70 },
    // T15: Luffield (left)
    { type: "corner", length: 135, radius: 40, transitionIn: 15, transitionOut: 15 },
    // T16: Woodcote (right)
    { type: "corner", length: 110, radius: -90, transitionIn: 20, transitionOut: 20 },
    // National Pit Straight (~740m)
    { type: "straight", length: 740 },
    // T17: Copse approach (slight right to complete loop)
    { type: "corner", length: 70, radius: -200, transitionIn: 15, transitionOut: 15 },
  ],
  corners: [
    { cornerIndex: 0, cornerName: "Copse", apexSegmentIndex: 1 },
    { cornerIndex: 1, cornerName: "Maggotts", apexSegmentIndex: 3 },
    { cornerIndex: 2, cornerName: "Becketts", apexSegmentIndex: 4 },
    { cornerIndex: 3, cornerName: "Becketts Exit", apexSegmentIndex: 5 },
    { cornerIndex: 4, cornerName: "Chapel Entry", apexSegmentIndex: 6 },
    { cornerIndex: 5, cornerName: "Chapel", apexSegmentIndex: 7 },
    { cornerIndex: 6, cornerName: "Stowe", apexSegmentIndex: 9 },
    { cornerIndex: 7, cornerName: "Vale", apexSegmentIndex: 11 },
    { cornerIndex: 8, cornerName: "Club", apexSegmentIndex: 12 },
    { cornerIndex: 9, cornerName: "Abbey 1", apexSegmentIndex: 14 },
    { cornerIndex: 10, cornerName: "Abbey 2", apexSegmentIndex: 15 },
    { cornerIndex: 11, cornerName: "Village", apexSegmentIndex: 17 },
    { cornerIndex: 12, cornerName: "The Loop", apexSegmentIndex: 19 },
    { cornerIndex: 13, cornerName: "Aintree", apexSegmentIndex: 20 },
    { cornerIndex: 14, cornerName: "Brooklands", apexSegmentIndex: 22 },
    { cornerIndex: 15, cornerName: "Luffield", apexSegmentIndex: 24 },
    { cornerIndex: 16, cornerName: "Woodcote", apexSegmentIndex: 25 },
  ],
  sectors: [
    { sectorIndex: 0, sectorName: "Sector 1", startSegmentIndex: 0, endSegmentIndex: 9 },
    { sectorIndex: 1, sectorName: "Sector 2", startSegmentIndex: 9, endSegmentIndex: 17 },
    { sectorIndex: 2, sectorName: "Sector 3", startSegmentIndex: 17, endSegmentIndex: 27 },
  ],
};

// Generate all three
const outputDir = join(process.cwd(), "presets", "circuits");
mkdirSync(outputDir, { recursive: true });

for (const def of [monzaDef, monacoDef, silverstoneDef]) {
  const circuit = generateCircuit(def);
  const filePath = join(outputDir, `${def.circuitId}.json`);
  writeFileSync(filePath, JSON.stringify(circuit, null, 2) + "\n", "utf8");
  console.log(`Generated ${def.circuitId}: ${circuit.points.length} points, ${circuit.totalLength}m`);
}
