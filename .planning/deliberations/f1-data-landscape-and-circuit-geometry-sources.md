# Deliberation: F1 Data Landscape and Circuit Geometry Sources

**Date:** 2026-03-27
**Status:** Concluded
**Trigger:** Phase 2 track map visualization produced incorrect circuit outlines from hand-authored coordinates

## Context

During Phase 2 verification, the track map visualization for Monza showed a completely incorrect shape. Investigation revealed the circuit x/y coordinates were fabricated by the agent through naive curvature integration with no closure constraint — the track had a 1,964m x-gap and 257m y-gap (didn't close at all). The curvature data driving the lap model physics is adequate (lap times within 6-10% of reality), but the spatial coordinates for visualization are unusable.

This triggered a broader investigation into what F1 data is actually available, whether an F1TV subscription is needed, and how to source circuit geometry properly.

## Key Finding: F1TV Subscription Is Not Needed for Data

The live timing API at `livetiming.formula1.com` is completely unauthenticated. FastF1 accesses it directly — no subscription of any kind is required. The FastF1 maintainer has confirmed: "The server doesn't ask for authentication, so it's not even possible for FastF1 to authenticate users."

An F1TV subscription gates the official app's visualization features and video streaming. It adds zero data channels beyond what FastF1 provides freely.

## Circuit Geometry Sources

Three viable free sources exist:

### 1. TUMFTM Racetrack Database
- **URL:** https://github.com/TUMFTM/racetrack-database
- **License:** LGPL-3.0
- **Format:** CSV with columns `[x_m, y_m, w_tr_right_m, w_tr_left_m]`
- **Resolution:** ~1000 points per circuit, ~3m spacing (high resolution)
- **Coverage:** 19 F1 circuits including Monza, Monaco, Silverstone
- **Source:** GPS centerlines from OpenStreetMap, smoothed algorithmically; track widths from satellite imagery
- **Quality:** Variable by location. Last updated ~2020. Missing newer circuits (Miami, Las Vegas, Jeddah, Losail).
- **Extras:** Pre-computed racing lines, track width data useful for lateral dynamics

### 2. bacinger/f1-circuits
- **URL:** https://github.com/bacinger/f1-circuits
- **License:** MIT
- **Format:** GeoJSON (WGS84 lat/lon)
- **Resolution:** ~177 points per circuit (~33m spacing)
- **Coverage:** 37+ circuits including recent additions through 2026
- **Actively maintained**
- **Lower resolution** but widest coverage

### 3. FastF1 Telemetry Extraction
- **Method:** Extract x/y from fastest lap position data via `lap.get_pos_data()`
- **Resolution:** ~300-450 raw points per lap at ~3.7-5 Hz
- **Accuracy:** ±10m jitter between laps; coordinate units are 1/10 meter
- **Coverage:** All circuits from 2018+
- **Requires:** Python script as a build-time preprocessing step, not runtime dependency
- **Note:** Position data comes from car sensors, not surveyed geometry

### Recommendation

Layered approach:
1. **TUMFTM** as primary source for the 19 circuits it covers (highest resolution, includes track width)
2. **bacinger/f1-circuits** as fallback for circuits TUMFTM doesn't cover (37+ circuits, actively maintained)
3. **FastF1 telemetry extraction** as Phase 6 enhancement when building the data import pipeline

## F1 Data Available Without Subscription

### Via FastF1 (free, 2018+)
- Car telemetry: speed, RPM, gear, throttle, brake (on/off), DRS at ~3.7 Hz
- Position: X, Y, Z coordinates
- Lap timing: sector times, speed traps at 4 points
- Tire: compound, age, fresh/used, stint number
- Weather: air temp, track temp, humidity, pressure, rainfall, wind
- Race operations: pit times, safety car, race control messages
- Circuit info: corner positions, marshal sectors (from MultiViewer API)

### Via OpenF1 API (free, 2023+)
- Similar to FastF1 but REST-native (no Python required)
- Unique: overtake detection, mini-sector segments
- Historical only; real-time requires paid subscription

### Via Jolpica-F1 (free, 1950+)
- Ergast replacement: race results, qualifying, lap times, pit stops, standings
- No telemetry — results and timing data only

### What's NOT Publicly Available (team-internal only)
- Tire temperatures (surface, carcass, bulk)
- Battery state of charge, MGU-K/MGU-H power output
- Fuel load, fuel flow rate
- Brake pressure (only on/off is public)
- Suspension travel, ride height, aero balance
- Steering angle, differential settings
- Teams have ~1000-2000 sensor channels at up to 1000 Hz; public data has ~10 channels at ~3.7 Hz

## Calibration Value for the Simulator

| Modeling Need | Data Source | Confidence |
|--------------|-------------|------------|
| Lap time profiles | FastF1 speed traces + sector times | High |
| Tire degradation | FastF1 stint timing with fuel correction (~0.03s/lap/kg) | Medium |
| Speed/aero calibration | FastF1 speed traps (4 per lap) | High |
| ERS/energy deployment | Inferred from braking/acceleration profiles | Low-Medium |
| Strategy optimization | FastF1 + Jolpica pit/stint data | High |
| Weather impact | FastF1/OpenF1 weather + timing | Medium |
| Circuit geometry | TUMFTM racetrack database | High |

## Legal Considerations

- FastF1 (MIT, 3000+ GitHub stars) has operated since ~2020 without legal action
- Personal, local-first, non-commercial educational use is lowest risk
- Do not redistribute raw F1 data publicly
- The unauthenticated API appears to be a deliberate choice by F1/FOM to enable the fan analytics ecosystem

## Decision

1. **Phase 2.1:** Use TUMFTM racetrack database and/or constrained optimization to fix circuit geometry with proper closure constraints and real coordinate data
2. **Phase 6:** Build FastF1 adapter pipeline for telemetry import, circuit extraction, and calibration data
3. **F1TV:** Not required for data access. Purchase only if video streaming is desired.
4. **Update PROJECT.md:** Record that F1TV subscription is not needed for data; FastF1/OpenF1 provide everything without authentication

---
*Deliberation concluded: 2026-03-27*
