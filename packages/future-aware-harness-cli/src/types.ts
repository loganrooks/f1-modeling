export type RuntimeInstallStatus =
  | "overlay"
  | "upstream"
  | "drift"
  | "missing";

export type RuntimeState =
  | "overlay_current"
  | "upstream_current"
  | "mixed"
  | "drift"
  | "missing_runtime_root"
  | "missing_targets";

export type RuntimeRecommendedAction =
  | "none"
  | "install-runtime"
  | "upgrade-runtime"
  | "manual-review";

export type RuntimeAction =
  | "already_materialized"
  | "install_overlay"
  | "restored_from_backup";

export interface RuntimeTarget {
  relativePath: string;
  role: string;
  expectedUpstreamSha256: string;
  overlaySha256: string;
}

export interface RuntimeCompatibilityProfile {
  id: string;
  label: string;
  targets: RuntimeTarget[];
}

export interface RuntimeManifest {
  manifestVersion: number;
  frameworkName: string;
  frameworkVersion: string;
  createdAt?: string | undefined;
  runtimeRootDefault: string;
  receiptDirname: string;
  legacyReceiptDirnames: string[];
  compatibilityProfiles: RuntimeCompatibilityProfile[];
}

export interface RuntimeTargetInspection extends RuntimeTarget {
  overlayPath: string;
  runtimePath: string;
  currentHash: string | null;
  status: RuntimeInstallStatus;
}

export interface RuntimeInspection {
  runtimeRoot: string;
  receiptRoot: string;
  stableReceiptPath: string;
  manifestHash: string;
  manifest: RuntimeManifest;
  profile: RuntimeCompatibilityProfile;
  state: RuntimeState;
  recommendedAction: RuntimeRecommendedAction;
  targets: RuntimeTargetInspection[];
}

export interface RuntimePlanRow {
  relativePath: string;
  role: string;
  previousHash: string | null;
  installedHash: string | null;
  action: RuntimeAction | "blocked";
}

export interface RuntimePlan {
  inspection: RuntimeInspection;
  mode: "install" | "upgrade";
  actions: RuntimePlanRow[];
  blockedReason: string | null;
  backupDir: string | null;
}

export interface RuntimeReceipt {
  frameworkName: string;
  frameworkVersion: string;
  profileId: string;
  mode: "install" | "upgrade" | "restore";
  appliedAt: string;
  runtimeRoot: string;
  manifestHash: string;
  backupDir: string | null;
  targets: RuntimePlanRow[];
}

export type ProjectStrategy =
  | "create_if_missing"
  | "replace_if_framework_owned"
  | "patch_managed_section"
  | "manual_review_required";

export interface ProjectManagedFileManifest {
  id: string;
  relativePath: string;
  strategy: ProjectStrategy;
  template: string;
  description: string;
  sectionId?: string | undefined;
}

export interface ProjectManifest {
  manifestVersion: number;
  frameworkName: string;
  frameworkVersion: string;
  markerPath: string;
  receiptDirname: string;
  managedFiles: ProjectManagedFileManifest[];
}

export type ProjectFileStateKind =
  | "missing"
  | "current"
  | "needs_update"
  | "adoptable_match"
  | "adoptable_legacy"
  | "injectable"
  | "existing"
  | "conflict";

export interface ProjectMarkerEntry {
  path: string;
  strategy: ProjectStrategy;
  template: string;
  managedHash: string | null;
  templateHash: string;
  sectionId?: string | undefined;
  scaffoldOnly?: boolean | undefined;
  lastAction: string;
}

export interface ProjectMarkerFile {
  frameworkName: string;
  frameworkVersion: string;
  manifestVersion: number;
  projectRoot: string;
  lastReconciledAt: string;
  mode: "bootstrap" | "upgrade";
  files: Record<string, ProjectMarkerEntry>;
}

export interface ProjectManagedFileState extends ProjectManagedFileManifest {
  absolutePath: string;
  exists: boolean;
  desiredContent: string;
  desiredHash: string;
  currentHash: string | null;
  state: ProjectFileStateKind;
  markerEntry: ProjectMarkerEntry | null;
  details: string;
}

export type ProjectState = "absent" | "partial" | "managed" | "ambiguous";

export type ProjectRecommendedAction =
  | "bootstrap-project"
  | "upgrade-project"
  | "manual-review";

export interface ProjectInspection {
  projectRoot: string;
  markerPath: string;
  receiptRoot: string;
  manifestHash: string;
  manifest: ProjectManifest;
  marker: ProjectMarkerFile | null;
  state: ProjectState;
  recommendedAction: ProjectRecommendedAction;
  files: ProjectManagedFileState[];
}

export type ProjectAction =
  | "create_file"
  | "replace_file"
  | "adopt_file"
  | "wrap_legacy_section"
  | "replace_section"
  | "prepend_section"
  | "create_section_file"
  | "scaffold_present"
  | "blocked";

export interface ProjectPlanRow {
  id: string;
  relativePath: string;
  action: ProjectAction;
  currentHash: string | null;
  nextHash: string | null;
  details: string;
}

export interface ProjectPlan {
  inspection: ProjectInspection;
  mode: "bootstrap" | "upgrade";
  actions: ProjectPlanRow[];
  blockedReason: string | null;
}

export interface ProjectReceipt {
  frameworkName: string;
  frameworkVersion: string;
  mode: "bootstrap" | "upgrade";
  appliedAt: string;
  projectRoot: string;
  manifestHash: string;
  actions: ProjectPlanRow[];
}

export interface VerifyResult {
  ok: boolean;
  issues: string[];
}
