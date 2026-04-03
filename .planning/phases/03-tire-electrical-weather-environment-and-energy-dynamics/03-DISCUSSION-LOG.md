# Phase 3: Tire, Electrical, Weather, Environment, and Energy Dynamics - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-04-02
**Phase:** 03-tire-electrical-weather-environment-and-energy-dynamics
**Mode:** Auto (exploratory, --auto)
**Areas synthesized:** simulation time axis, tire model depth, electrical system architecture, environment coupling mechanism, aero-mode switching, lateral force balance scope, multi-lap simulation architecture, cross-subsystem interaction

---

## Simulation Time Axis

| Option | Description | Selected |
|--------|-------------|----------|
| Lap-by-lap discrete | Wrap existing solver in a loop, update state between laps | Working assumption |
| Per-sector state updates | Finer-grained evolution within each lap | Deferred to research |
| Continuous time integration | Replace solver with continuous-time model | Not considered (breaks Phase 2 architecture) |

**Auto synthesis:** Derived constraint from Phase 2 architecture -- single-lap solver is the inner loop. Lap-by-lap discrete simulation is the natural extension. Research must validate whether per-lap coupling is sufficient.

---

## Tire Model Depth

| Option | Description | Selected |
|--------|-------------|----------|
| Phenomenological (grip curves) | Grip as function of compound, wear, temperature with cliff thresholds | Working assumption |
| Pacejka-lite | Simplified magic formula parameters | Deferred (v2 fidelity) |
| Brush model | First-principles rubber-road interaction | Deferred (v2 fidelity) |
| Thermomechanical | Full thermal and mechanical coupling | Deferred (v2 fidelity) |

**Auto synthesis:** Derived constraint from success criteria (3 dry + 1 wet, degradation + thermal + cliff). Phenomenological model matches educational transparency requirement. Exact mathematical form is an open question for research.

---

## Electrical System Architecture

| Option | Description | Selected |
|--------|-------------|----------|
| Single energy pool (SoC only) | Battery state-of-charge with deploy/harvest rates | Working assumption |
| Split source (MGU-K + MGU-H + battery) | Separate kinetic and heat recovery tracking | Open question for research |
| Full powertrain model | Detailed component-level simulation | Out of scope (v2) |

**Auto synthesis:** Derived constraint from ELEC-01 (inspectable outputs) and ELEC-02 (linked to strategy). Lap-level energy balance preserves transparency. Research must determine whether MGU-K/H distinction matters for 2026-era educational value.

---

## Environment Coupling Mechanism

| Option | Description | Selected |
|--------|-------------|----------|
| Multiplicative grip modifier | effective_grip = base x temp_factor x surface_factor x rubber_factor | Working assumption |
| Integrated thermodynamic coupling | Tire and track temperature co-evolve through heat equation | Deferred to research evaluation |
| Discrete weather categories | Dry/damp/wet as categorical states affecting grip lookup | Insufficient for MODL-04 (dynamic evolution required) |

**Auto synthesis:** Derived constraint from ENVR-02 (coupling, not static metadata) and MODL-04 (dynamic evolution). Multiplicative approach is transparent and extensible. Research must evaluate whether it captures meaningful dynamics.

---

## Aero-Mode Switching

| Option | Description | Selected |
|--------|-------------|----------|
| Per-segment discrete state | DRS/active-aero as state flips at defined circuit zones | Working assumption |
| Continuous aero variation | Drag/downforce vary smoothly with speed or zone | Not appropriate (regulations define discrete modes) |
| Regulation-only (no circuit zones) | Aero modes defined in regulation preset, not location-specific | Insufficient (DRS requires zone definition) |

**Auto synthesis:** Derived constraint from success criterion 6 (discrete aero-state effect from regulation presets). DRS is inherently zone-based. Research must determine zone data format and 2026 active-aero specifics.

---

## Lateral Force Balance Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Simple weight transfer (2-axle) | Longitudinal + lateral load shift using CG height and track width | Working assumption |
| 4-wheel load transfer | Full corner-by-corner load distribution | Deferred to research evaluation |
| Tire load sensitivity only | Friction coefficient varies with normal load, no explicit weight transfer | Possible alternative |

**Auto synthesis:** Derived constraint from success criterion 7 (beyond single grip scalar). Existing friction ellipse provides baseline. Simple weight transfer adds CG height and track width to VehicleParams. Research must evaluate appropriate depth.

---

## Multi-Lap Architecture

| Option | Description | Selected |
|--------|-------------|----------|
| StintRunner wrapping lapSolver | Loop over existing solver, update state per-lap | Working assumption |
| Integrated multi-lap solver | Single solver computing full stint in one pass | Not appropriate (loses per-lap transparency) |
| State machine driven | Subsystem state machines evolve independently | More complex than needed |

**Auto synthesis:** Derived from Phase 2 architecture preservation. StintRunner with per-lap state updates is the simplest approach that produces meaningful stint behavior. Output includes per-lap breakdown.

---

## Cross-Subsystem Interaction

| Option | Description | Selected |
|--------|-------------|----------|
| Loose coupling at lap boundary | Each subsystem updates independently between laps | Working assumption |
| Tight intra-lap coupling | Subsystems interact within each lap solve | Deferred (v2 fidelity for most interactions) |
| Explicit coupling graph | Formal dependency DAG between subsystems | Over-engineered for Phase 3 |

**Auto synthesis:** Derived from plan 03-04 requirement (validate cross-subsystem interactions). Loose coupling is testable and transparent. Research must validate whether it produces meaningful policy comparison.

---

## Claude's Discretion

- Exact mathematical form of tire degradation curves (research determines)
- Internal naming conventions for new subsystem modules
- Whether electrical deployment is per-lap or per-zone (research determines)
- Specific number of new weather presets to ship
- How new artifact types are named and structured

## Deferred Ideas

- Race-distance strategy and pit optimization (Phase 4)
- Observer/estimation layer (Phase 4)
- Driver-style parameterization (Phase 5)
- Full Pacejka tire model (v2)
- Powertrain simulation (v2)
