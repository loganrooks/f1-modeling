/**
 * Vehicle parameters for the quasi-steady-state lap model.
 * All units are SI.
 */
export interface VehicleParams {
  /** Vehicle mass in kg (includes driver). */
  mass: number;
  /** Aerodynamic drag factor kx = 0.5 * rho * Cd * A in Ns^2/m^2. */
  dragFactor: number;
  /** Aerodynamic downforce factor kz = 0.5 * rho * Cl * A in Ns^2/m^2. */
  downforceFactor: number;
  /** Peak power unit output in Watts. */
  peakPower: number;
  /** Tire friction coefficient mu (dimensionless). */
  gripCoefficient: number;
}

/**
 * A single distance-indexed point on the circuit centerline consumed by the solver.
 * Only carries distance and curvature -- spatial coordinates are for visualization only.
 */
export interface CircuitLayoutPoint {
  /** Distance in meters from the start/finish line. */
  distance: number;
  /** Curvature in 1/m. Positive = left, negative = right, 0 = straight. */
  curvature: number;
}

/**
 * A single point in the solved speed profile output.
 */
export interface SpeedProfilePoint {
  /** Distance in meters from the start/finish line. */
  distance: number;
  /** Speed in m/s at this point. */
  speed: number;
  /** The dominant constraint regime at this point. */
  regime: "accelerating-grip" | "accelerating-power" | "braking" | "cornering";
  /** Curvature in 1/m at this point. */
  curvature: number;
  /** Lateral acceleration in g-units. */
  lateralG: number;
  /** Longitudinal acceleration in g-units (positive = accel, negative = decel). */
  longitudinalG: number;
  /** Time increment in seconds for this segment (0 for the first point). */
  timeIncrement: number;
}

/**
 * Aggregated result for a single circuit sector.
 */
export interface SectorResult {
  /** Zero-based sector index. */
  sectorIndex: number;
  /** Human-readable sector name. */
  sectorName: string;
  /** Start distance in meters. */
  startDistance: number;
  /** End distance in meters. */
  endDistance: number;
  /** Total time through this sector in seconds. */
  sectorTime: number;
  /** Minimum speed in m/s (typically at a corner apex). */
  minSpeed: number;
  /** Maximum speed in m/s (typically at the end of a straight). */
  maxSpeed: number;
  /** The dominant limiting factor in this sector. */
  limitingFactor: "grip" | "power" | "aero" | "mixed";
}

/**
 * Complete output from the lap model solver.
 */
export interface LapModelOutput {
  /** Total lap time in seconds. */
  lapTime: number;
  /** Per-point speed profile for the entire lap. */
  speedProfile: SpeedProfilePoint[];
  /** Per-sector aggregated results. */
  sectorResults: SectorResult[];
  /** Documented model assumptions and limitations. */
  assumptions: string[];
}

/**
 * Engineering-inference defaults based on public 2026 FIA regulation direction.
 * Not authoritative -- use regulation presets for constraint propagation.
 *
 * - mass: 798 kg (2026 minimum weight)
 * - dragFactor: ~1.05 (approx 0.5 * 1.225 * 0.9 * 1.9)
 * - downforceFactor: ~3.8 (approx 0.5 * 1.225 * 3.5 * 1.78)
 * - peakPower: 735000 W (~1000 HP)
 * - gripCoefficient: 1.7 (high-performance slick tires)
 */
export const DEFAULT_VEHICLE_PARAMS: VehicleParams = {
  mass: 798,
  dragFactor: 1.05,
  downforceFactor: 3.8,
  peakPower: 735_000,
  gripCoefficient: 1.7,
};
