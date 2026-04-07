---
phase: quick
plan: 260407-mgl
type: execute
wave: 1
depends_on: []
files_modified:
  - .planning/ROADMAP.md
  - .planning/REQUIREMENTS.md
  - .planning/STATE.md
  - CLAUDE.md
  - packages/sim-core/src/stintModel/types.ts
  - packages/sim-core/src/stintModel/environmentModel.ts
  - packages/sim-core/src/stintModel/stintRunner.ts
  - packages/sim-core/src/__tests__/environmentModel.test.ts
  - packages/sim-core/src/__tests__/tireModel.test.ts
autonomous: true
requirements: []
must_haves:
  truths:
    - "Phase 4 in ROADMAP.md covers only strategy + race simulation + explanation surfaces, not observers"
    - "A new Phase 4.1 exists in ROADMAP.md for observer layer, synthetic sensor model, and observer-aware views"
    - "ambientTemperatureC from weather presets affects tire cooling rate in the environment/tire model"
    - "CLAUDE.md documents the Future Awareness convention for phase CONTEXT.md files"
    - "ROADMAP.md Phase 4 section notes viz deliberation as prerequisite"
    - "STATE.md reflects post-audit position"
  artifacts:
    - path: ".planning/ROADMAP.md"
      provides: "Split Phase 4 / new Phase 4.1, viz deliberation note, updated execution order"
    - path: ".planning/REQUIREMENTS.md"
      provides: "Updated traceability: ESTM-* and VISU-05 partially moved to Phase 4.1"
    - path: "CLAUDE.md"
      provides: "Future Awareness convention in Key Conventions section"
    - path: ".planning/STATE.md"
      provides: "Current position after audit integration"
    - path: "packages/sim-core/src/stintModel/types.ts"
      provides: "ambientTemperatureC added to StintConfig"
    - path: "packages/sim-core/src/stintModel/environmentModel.ts"
      provides: "ambientTemperatureC tracked in environment state and initialization"
    - path: "packages/sim-core/src/stintModel/stintRunner.ts"
      provides: "ambientTemperatureC threaded through stint runner"
  key_links:
    - from: "packages/sim-core/src/stintModel/environmentModel.ts"
      to: "packages/sim-core/src/stintModel/tireModel.ts"
      via: "ambientTemperatureC affects tire equilibrium temperature"
      pattern: "ambientTemperatureC"
---

<objective>
Integrate the remaining 5 audit findings that were not addressed in the initial audit response session: (1) split Phase 4 to create Phase 4.1 for observer work, (2) wire ambientTemperatureC into the tire thermal model, (3) add Future Awareness convention to CLAUDE.md, (4) note viz deliberation prerequisite for Phase 4, and (5) update STATE.md.

Purpose: Close out all audit findings so the project is clean for Phase 3.1 planning.
Output: Updated roadmap, requirements traceability, production code with ambient temp wiring, CLAUDE.md convention, and current STATE.md.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md
@.planning/STATE.md
@.planning/audits/audit-response-2026-04-07.md
@CLAUDE.md
@packages/sim-core/src/stintModel/types.ts
@packages/sim-core/src/stintModel/environmentModel.ts
@packages/sim-core/src/stintModel/tireModel.ts
@packages/sim-core/src/stintModel/stintRunner.ts
@apps/local-api/src/services/runService.ts

<interfaces>
<!-- Key types and contracts the executor needs. -->

From packages/sim-core/src/stintModel/types.ts:
```typescript
export interface EnvironmentState {
  trackTemperatureC: number;
  surfaceWetness: number;
  rubberEvolution: number;
  gripModifier: number;
}

export interface WeatherTimelineEntry {
  lap: number;
  trackTemperatureC: number;
  surfaceWetness: number;
  rainfall: string;
}

export interface StintConfig {
  circuit: CircuitDocument;
  baseVehicle: VehicleParams;
  tireCompound: TireCompoundParams;
  electricalPolicy: ElectricalPolicy;
  weatherTimeline: WeatherTimeline;
  aeroConfig: AeroModeConfig | null;
  loadTransferParams: LoadTransferParams;
  totalLaps: number;
}
```

From packages/sim-core/src/stintModel/tireModel.ts:
```typescript
export function updateTireState(
  prev: TireState,
  _lapResult: LapModelOutput,
  compound: TireCompoundParams,
  envState: EnvironmentState,
): TireState
// Equilibrium temp: Math.max(envState.trackTemperatureC, compound.optimalTempLow + 5)
// Surface temp convergence: warmupRate * (equilibriumTemp - prev.surfaceTemperature)
```

From packages/sim-core/src/stintModel/environmentModel.ts:
```typescript
export function initializeEnvironmentState(timeline: WeatherTimeline): EnvironmentState
export function updateEnvironmentState(prev: EnvironmentState, lapNumber: number, timeline: WeatherTimeline): EnvironmentState
```

From apps/local-api/src/services/runService.ts:
```typescript
function extractWeatherTimeline(weatherPreset: WeatherPresetDocument): WeatherTimeline
// Weather preset values include ambientTemperatureC (e.g., 24 in dry-baseline, 18 in light-rain)
// Currently only weatherTimeline array is extracted; ambientTemperatureC is ignored at runtime
```

From presets/weather/dry-baseline.json (representative):
```json
{
  "values": {
    "ambientTemperatureC": 24,
    "trackTemperatureC": 33,
    "weatherTimeline": [...]
  }
}
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Split Phase 4, add Phase 4.1, update docs and STATE.md</name>
  <files>
    .planning/ROADMAP.md
    .planning/REQUIREMENTS.md
    .planning/STATE.md
    CLAUDE.md
  </files>
  <action>
**ROADMAP.md changes:**

1. **Split Phase 4** into two phases:
   - **Phase 4** (renamed): "Strategy, Race Simulation, and Explanation Surfaces"
     - Goal: Turn the simulation into a race-strategy analysis tool that explains outcomes across session formats, teaches subsystem interactions through engineer-role views, and supports interactive temporal exploration.
     - Remove ESTM-01, ESTM-02, ESTM-03, ESTM-04 from Phase 4 requirements.
     - Remove VISU-05 from Phase 4 requirements (timeline scrubbing requires observer-ready state).
     - Keep: STRA-01, STRA-02, STRA-03, STRA-04, STRA-05, PLAT-04, EDU-01, EDU-03, VISU-03.
     - Update success criteria: remove items 7-8 (synthetic sensor, observer layer). Keep items 1-6, 9-11.
     - Update plans: Remove 04-04 (synthetic sensor/observer) and 04-05 (observer-aware views, timeline scrubbing). Renumber remaining plans so it is 4 plans total:
       - 04-01: Race-distance, pit-strategy, race-interruption simulation
       - 04-02: Qualifying and sprint session modes
       - 04-03: Explanation views, engineer-role learning paths, stint-delta analysis
       - 04-04: In-race intervention simulation and strategy-response workflows
     - Add a note: "**Prerequisite:** Visualization architecture deliberation must be completed before Phase 4 planning begins. See audit-response-2026-04-07.md finding #9."

   - **Phase 4.1** (new, inserted): "Observer Layer and Synthetic Sensing"
     - Goal: Introduce the observer layer with a synthetic sensor model, enabling comparison of true, measured, and estimated state, with observer-aware learning views and temporal exploration.
     - Depends on: Phase 4
     - Requirements: [ESTM-01, ESTM-02, ESTM-03, ESTM-04, VISU-05]
     - Success criteria:
       1. The simulator generates noisy measurement channels that mimic realistic sensor outputs, enabling observer comparison.
       2. User can enable an observer layer and inspect true, measured, and estimated state.
       3. User can scrub through simulation time, inspect state at any point, and branch simulations from intermediate states.
       4. Observer-aware learning views connect estimation concepts to engineering disciplines.
     - Plans: 3 plans
       - 04.1-01: Synthetic sensor model and noisy measurement channels
       - 04.1-02: Observer layer (EKF baseline) with true/measured/estimated comparison
       - 04.1-03: Observer-aware learning views, timeline scrubbing, and sensitivity workflows

2. **Update execution order** in the Progress section: 1 -> 2 -> 2.1 -> 3 -> 3.1 -> 4 -> 4.1 -> 5 -> 6 -> 7 -> 8

3. **Update Progress table**: Add Phase 4.1 row (0/3, Not started). Update Phase 4 to show 0/4 (was 0/6).

**REQUIREMENTS.md changes:**

4. **Update traceability table**: Change ESTM-01, ESTM-02, ESTM-03, ESTM-04 from "Phase 4" to "Phase 4.1". Change VISU-05 from "Phase 4" to "Phase 4.1". Update coverage count if needed (total should remain 48).

**CLAUDE.md changes:**

5. **Add Future Awareness convention** to the "Key Conventions" section, after the "Strict TypeScript" bullet:
   ```
   - **Future Awareness:** Each phase CONTEXT.md must include a "Future Awareness" section documenting architectural constraints imposed by future phases and v2 ambitions. This is not a deferred-features list -- it captures constraints that shape current implementation choices (e.g., "Phase 5 needs a time-step plant interface, so avoid baking lap-level discretization into public APIs").
   ```

6. **Update Current Status** in CLAUDE.md: Change "Phase 2 next: Reduced-Order Lap Model" to "Phases 1-3 complete. Phase 3.1 next: Race State, Typed Artifacts, and Branchable Runs."

**STATE.md changes:**

7. **Update current position**:
   - current_phase: 03 (complete), next is 03.1
   - status: "Phase 3 complete, audit integrated. Phase 3.1 next."
   - last_activity: 2026-04-07
   - Update Current Position narrative to reflect Phase 3 completion and audit integration

8. **Add audit decisions** to Accumulated Context > Decisions:
   - "Audit (2026-04-07): Phase 4 split -- strategy/race sim stays in Phase 4; observer layer moves to Phase 4.1"
   - "Audit (2026-04-07): Visualization library adoption deliberation is prerequisite before Phase 4 planning"
   - "Audit (2026-04-07): Future Awareness convention added to CLAUDE.md for phase CONTEXT.md files"
   - "Audit (2026-04-07): ambientTemperatureC wired into tire cooling rate via environment model"

9. **Update Roadmap Evolution** to note Phase 4.1 insertion.
  </action>
  <verify>
    <automated>cd /home/rookslog/workspace/projects/f1-modeling && grep -q "Phase 4.1" .planning/ROADMAP.md && grep -q "Phase 4.1" .planning/REQUIREMENTS.md && grep -q "Future Awareness" CLAUDE.md && grep -q "audit integrated" .planning/STATE.md && echo "PASS"</automated>
  </verify>
  <done>
    - ROADMAP.md has Phase 4 (strategy-only, 4 plans) and Phase 4.1 (observer, 3 plans)
    - ROADMAP.md Phase 4 section includes viz deliberation prerequisite note
    - Execution order includes 4.1 between 4 and 5
    - REQUIREMENTS.md traceability shows ESTM-* and VISU-05 under Phase 4.1
    - CLAUDE.md has Future Awareness convention and updated current status
    - STATE.md reflects post-audit state
  </done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: Wire ambientTemperatureC into tire cooling model</name>
  <files>
    packages/sim-core/src/stintModel/types.ts
    packages/sim-core/src/stintModel/environmentModel.ts
    packages/sim-core/src/stintModel/stintRunner.ts
    packages/sim-core/src/__tests__/environmentModel.test.ts
    packages/sim-core/src/__tests__/tireModel.test.ts
    apps/local-api/src/services/runService.ts
  </files>
  <behavior>
    - Test 1: initializeEnvironmentState with a timeline that has entries returns an EnvironmentState with ambientTemperatureC derived from the preset value (not the track temp)
    - Test 2: Tire equilibrium temperature is lower when ambientTemperatureC is 10C vs 30C (ambient temp affects cooling rate)
    - Test 3: Existing environment model tests continue to pass (backward compatibility via sensible defaults)
    - Test 4: Stint with cold ambient (10C) produces slower warm-up than stint with hot ambient (30C) over same laps
  </behavior>
  <action>
**The physics:** Ambient air temperature affects how quickly tires cool. The current tire thermal model computes an equilibrium temperature as `Math.max(trackTemperatureC, optimalTempLow + 5)`. This ignores ambient air temperature entirely. In reality, ambient temperature creates a cooling baseline -- cooler air pulls heat from the tire surface faster, lowering the equilibrium temperature the tire converges toward. The effect is: lower ambient temp = lower equilibrium temp = harder to get tires into the optimal window = slower warm-up and potentially more thermal grip penalty.

**Implementation approach:**

1. **types.ts** -- Add `ambientTemperatureC` to `EnvironmentState`:
   ```typescript
   export interface EnvironmentState {
     trackTemperatureC: number;
     ambientTemperatureC: number;  // NEW
     surfaceWetness: number;
     rubberEvolution: number;
     gripModifier: number;
   }
   ```
   Also add `ambientTemperatureC` to `StintConfig`:
   ```typescript
   export interface StintConfig {
     // ... existing fields ...
     ambientTemperatureC: number;  // NEW -- from weather preset
   }
   ```

2. **environmentModel.ts** -- Update `initializeEnvironmentState` to accept ambientTemperatureC:
   - Change signature to `initializeEnvironmentState(timeline: WeatherTimeline, ambientTemperatureC: number = 24)` (default 24C preserves backward compat for tests).
   - Store ambientTemperatureC in the returned EnvironmentState.
   - Update `updateEnvironmentState` to propagate ambientTemperatureC from previous state (it doesn't change during a stint -- ambient is session-level).

3. **tireModel.ts** -- Modify `updateTireState` equilibrium temperature calculation:
   - Current: `equilibriumTemp = Math.max(trackTemperatureC, optimalTempLow + 5)`
   - New: Add ambient temp influence on the cooling side. The equilibrium should be pulled down by cold ambient air:
     ```typescript
     // Ambient affects the heat rejection rate. Cooler ambient = lower equilibrium.
     // Blend: equilibrium is weighted average of track-driven heat input and ambient cooling.
     // trackTemp drives heating from below, ambient drives cooling from above.
     const heatInput = Math.max(envState.trackTemperatureC, compound.optimalTempLow + 5);
     const ambientCooling = envState.ambientTemperatureC;
     // Weighted: 80% driven by track/compound physics, 20% by ambient cooling
     const equilibriumTemp = 0.8 * heatInput + 0.2 * ambientCooling;
     ```
   - This means at ambient 24C (dry baseline): equilibrium shifts down slightly from pure track-driven value. At ambient 10C (cold rain): equilibrium drops significantly, making warm-up slower and thermal penalty larger.

4. **stintRunner.ts** -- Thread ambientTemperatureC:
   - In `initializeStintState`: pass `config.ambientTemperatureC` to `initializeEnvironmentState(config.weatherTimeline, config.ambientTemperatureC)`.

5. **runService.ts** -- Extract ambientTemperatureC from weather preset:
   - In the stint config builder (around line 468), extract `ambientTemperatureC` from the weather preset values (it's already there in the JSON at `values.ambientTemperatureC`). Default to 24 if not present.
   - Add to stintRunConfig: `ambientTemperatureC`.

6. **Tests:**
   - In environmentModel.test.ts: Add a test for `initializeEnvironmentState` verifying ambientTemperatureC is stored. Existing tests that call `initializeEnvironmentState(timeline)` should still work via the default parameter.
   - In tireModel.test.ts: Add a test comparing equilibrium convergence with cold vs hot ambient. The `DEFAULT_ENV` fixture needs `ambientTemperatureC: 24` added. The `simulateLaps` helper uses DEFAULT_ENV which will need the new field.
  </action>
  <verify>
    <automated>cd /home/rookslog/workspace/projects/f1-modeling && npm test 2>&1 | tail -20</automated>
  </verify>
  <done>
    - EnvironmentState and StintConfig types include ambientTemperatureC
    - Tire equilibrium temperature calculation uses ambient temp (80/20 blend)
    - Weather preset ambientTemperatureC flows through runService -> StintConfig -> environment state -> tire model
    - All existing tests pass (backward compat via defaults)
    - New tests verify ambient temp effect on tire warm-up
    - `npm run typecheck` passes
    - `npm test` passes at root
  </done>
</task>

</tasks>

<verification>
1. `npm run typecheck` -- all workspaces pass
2. `npm test` -- all tests pass at project root (regression check)
3. `npm run build` -- builds successfully
4. `grep -c "Phase 4.1" .planning/ROADMAP.md` returns > 0
5. `grep "ESTM-01" .planning/REQUIREMENTS.md` shows "Phase 4.1"
6. `grep "Future Awareness" CLAUDE.md` returns match
7. `grep "ambientTemperatureC" packages/sim-core/src/stintModel/types.ts` shows field in EnvironmentState and StintConfig
</verification>

<success_criteria>
- Phase 4 in roadmap covers only strategy/race simulation (4 plans, no ESTM-* requirements)
- Phase 4.1 exists with observer/estimation scope (3 plans, ESTM-* + VISU-05)
- ambientTemperatureC flows from weather preset through environment model into tire thermal equilibrium
- Cold ambient produces measurably slower tire warm-up than hot ambient in tests
- Future Awareness convention documented in CLAUDE.md
- Viz deliberation prerequisite noted in Phase 4 section
- STATE.md current and accurate
- All quality gates pass (typecheck, test, build)
</success_criteria>

<output>
After completion, create `.planning/quick/260407-mgl-integrate-remaining-audit-findings/260407-mgl-SUMMARY.md`
</output>
