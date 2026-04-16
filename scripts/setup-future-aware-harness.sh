#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
HARNESS_ROOT="${REPO_ROOT}/tooling/future-aware-harness"
MANIFEST_PATH="${HARNESS_ROOT}/manifest.json"
OVERLAY_ROOT="${HARNESS_ROOT}/overlay/get-shit-done-reflect"
RUNTIME_ROOT="${GSDR_RUNTIME_ROOT:-$HOME/.codex/get-shit-done-reflect}"

fail() {
  echo "Error: $*" >&2
  exit 1
}

sha256_of() {
  sha256sum "$1" | awk '{print $1}'
}

manifest_value() {
  local key="$1"
  node - "$MANIFEST_PATH" "$key" <<'NODE'
const fs = require("fs");
const manifest = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const key = process.argv[3];
const value = manifest[key];
if (value === undefined) {
  process.exit(1);
}
if (typeof value === "string") {
  process.stdout.write(value);
} else {
  process.stdout.write(JSON.stringify(value));
}
NODE
}

resolve_existing_backup_dir() {
  local stable_receipt="$1"
  local receipts_dir="$2"
  node - "$stable_receipt" "$receipts_dir" <<'NODE'
const fs = require("fs");
const path = require("path");

const [stableReceipt, receiptsDir] = process.argv.slice(2);

function readBackup(receiptPath) {
  if (!receiptPath || !fs.existsSync(receiptPath)) {
    return "";
  }
  const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
  return receipt.backup_dir || "";
}

let backup = readBackup(stableReceipt);
if (backup) {
  process.stdout.write(backup);
  process.exit(0);
}

if (!receiptsDir || !fs.existsSync(receiptsDir)) {
  process.exit(0);
}

const files = fs
  .readdirSync(receiptsDir)
  .filter((name) => name.endsWith(".json"))
  .sort()
  .reverse();

for (const file of files) {
  backup = readBackup(path.join(receiptsDir, file));
  if (backup) {
    process.stdout.write(backup);
    process.exit(0);
  }
}
NODE
}

resolve_backup_file_for_target() {
  local receipt_dir="$1"
  local preferred_backup_dir="$2"
  local relative_path="$3"

  if [[ -n "$preferred_backup_dir" && -f "${preferred_backup_dir}/${relative_path}" ]]; then
    printf '%s\n' "${preferred_backup_dir}/${relative_path}"
    return 0
  fi

  local backups_root="${receipt_dir}/backups"
  [[ -d "$backups_root" ]] || return 1

  local found
  found="$(find "$backups_root" -type f -path "*/${relative_path}" | sort | tail -n 1 || true)"
  [[ -n "$found" ]] || return 1

  printf '%s\n' "$found"
}

emit_targets() {
  node - "$MANIFEST_PATH" <<'NODE'
const fs = require("fs");
const manifest = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
for (const target of manifest.targets) {
  process.stdout.write([
    target.relative_path,
    target.role,
    target.expected_upstream_sha256,
    target.overlay_sha256,
  ].join("\t") + "\n");
}
NODE
}

write_receipt() {
  local mode="$1"
  local manifest_hash="$2"
  local applied_at="$3"
  local backup_dir="$4"
  local rows_path="$5"
  local output_path="$6"

  node - "$MANIFEST_PATH" "$mode" "$manifest_hash" "$applied_at" "$backup_dir" "$rows_path" "$output_path" "$REPO_ROOT" "$RUNTIME_ROOT" <<'NODE'
const fs = require("fs");
const path = require("path");

const [
  manifestPath,
  mode,
  manifestHash,
  appliedAt,
  backupDir,
  rowsPath,
  outputPath,
  repoRoot,
  runtimeRoot,
] = process.argv.slice(2);

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const rows = fs
  .readFileSync(rowsPath, "utf8")
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const [relative_path, role, previous_hash, installed_hash, action] = line.split("\t");
    return { relative_path, role, previous_hash, installed_hash, action };
  });

const receipt = {
  name: manifest.name,
  stage: manifest.stage,
  mode,
  applied_at: appliedAt,
  repo_root: repoRoot,
  runtime_root: runtimeRoot,
  manifest_path: path.relative(repoRoot, manifestPath),
  manifest_hash: manifestHash,
  backup_dir: backupDir || null,
  targets: rows,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(receipt, null, 2) + "\n");
NODE
}

restore_last_install() {
  local receipt_dirname
  receipt_dirname="$(manifest_value receipt_dirname)"
  local receipt_dir="${RUNTIME_ROOT}/${receipt_dirname}"
  local stable_receipt="${receipt_dir}/install-receipt.json"
  local receipts_dir="${receipt_dir}/receipts"

  [[ -f "$stable_receipt" ]] || fail "No install receipt found at ${stable_receipt}"

  local backup_dir
  backup_dir="$(node - "$stable_receipt" <<'NODE'
const fs = require("fs");
const receipt = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
process.stdout.write(receipt.backup_dir || "");
NODE
)"

  [[ -n "$backup_dir" ]] || fail "Latest install receipt does not record a backup directory"
  [[ -d "$backup_dir" ]] || fail "Backup directory missing: ${backup_dir}"

  while IFS=$'\t' read -r relative_path _role _expected_upstream _overlay_hash; do
    local backup_path
    backup_path="$(resolve_backup_file_for_target "$receipt_dir" "$backup_dir" "$relative_path")" || \
      fail "Missing backup for ${relative_path} in recorded backup history under ${receipt_dir}"
    local runtime_path="${RUNTIME_ROOT}/${relative_path}"
    mkdir -p "$(dirname "$runtime_path")"
    cp "$backup_path" "$runtime_path"
    echo "restored ${relative_path}"
  done < <(emit_targets)

  local timestamp
  timestamp="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  local compact_ts
  compact_ts="$(date -u +"%Y%m%dT%H%M%SZ")"
  local rows_log
  rows_log="$(mktemp)"
  local restore_receipt="${receipt_dir}/receipts/restore-${compact_ts}.json"
  mkdir -p "${receipt_dir}/receipts"

  while IFS=$'\t' read -r relative_path role _expected_upstream _overlay_hash; do
    local restored_hash
    restored_hash="$(sha256_of "${RUNTIME_ROOT}/${relative_path}")"
    printf '%s\t%s\t%s\t%s\t%s\n' \
      "$relative_path" "$role" "$restored_hash" "$restored_hash" "restored_from_backup" >> "$rows_log"
  done < <(emit_targets)

  write_receipt "restore" "$(sha256_of "$MANIFEST_PATH")" "$timestamp" "$backup_dir" "$rows_log" "$restore_receipt"
  rm -f "$rows_log"

  echo "Restore complete."
  echo "Backup source: ${backup_dir}"
}

install_overlay() {
  [[ -d "$RUNTIME_ROOT" ]] || fail "Runtime root not found: ${RUNTIME_ROOT}"
  [[ -f "$MANIFEST_PATH" ]] || fail "Manifest not found: ${MANIFEST_PATH}"

  local receipt_dirname
  receipt_dirname="$(manifest_value receipt_dirname)"
  local receipt_dir="${RUNTIME_ROOT}/${receipt_dirname}"
  local receipts_dir="${receipt_dir}/receipts"
  local stable_receipt="${receipt_dir}/install-receipt.json"
  mkdir -p "$receipt_dir" "$receipts_dir"

  local manifest_hash
  manifest_hash="$(sha256_of "$MANIFEST_PATH")"
  local timestamp
  timestamp="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  local compact_ts
  compact_ts="$(date -u +"%Y%m%dT%H%M%SZ")"

  local plan_log
  plan_log="$(mktemp)"
  local applied_log
  applied_log="$(mktemp)"
  trap 'rm -f "${plan_log:-}" "${applied_log:-}"' EXIT

  local install_needed=0

  while IFS=$'\t' read -r relative_path role expected_upstream overlay_hash; do
    local overlay_path="${OVERLAY_ROOT}/${relative_path}"
    local runtime_path="${RUNTIME_ROOT}/${relative_path}"
    [[ -f "$overlay_path" ]] || fail "Overlay file missing: ${overlay_path}"
    [[ -f "$runtime_path" ]] || fail "Runtime file missing: ${runtime_path}"

    local actual_overlay_hash
    actual_overlay_hash="$(sha256_of "$overlay_path")"
    [[ "$actual_overlay_hash" == "$overlay_hash" ]] || fail "Overlay hash mismatch for ${relative_path}"

    local current_hash
    current_hash="$(sha256_of "$runtime_path")"
    local action
    if [[ "$current_hash" == "$overlay_hash" ]]; then
      action="already_materialized"
    elif [[ "$current_hash" == "$expected_upstream" ]]; then
      action="install_overlay"
      install_needed=1
    else
      fail "Runtime drift detected for ${relative_path}. Expected upstream ${expected_upstream} or overlay ${overlay_hash}, found ${current_hash}"
    fi

    printf '%s\t%s\t%s\t%s\t%s\n' \
      "$relative_path" "$role" "$current_hash" "$overlay_hash" "$action" >> "$plan_log"
  done < <(emit_targets)

  local backup_dir=""
  if [[ "$install_needed" -eq 1 ]]; then
    backup_dir="${receipt_dir}/backups/${compact_ts}"
    mkdir -p "$backup_dir"
  else
    backup_dir="$(resolve_existing_backup_dir "$stable_receipt" "$receipts_dir")"
  fi

  while IFS=$'\t' read -r relative_path role previous_hash overlay_hash action; do
    local overlay_path="${OVERLAY_ROOT}/${relative_path}"
    local runtime_path="${RUNTIME_ROOT}/${relative_path}"
    if [[ "$action" == "install_overlay" ]]; then
      mkdir -p "${backup_dir}/$(dirname "$relative_path")"
      cp "$runtime_path" "${backup_dir}/${relative_path}"
      cp "$overlay_path" "$runtime_path"
    fi

    local installed_hash
    installed_hash="$(sha256_of "$runtime_path")"
    [[ "$installed_hash" == "$overlay_hash" ]] || fail "Post-install hash mismatch for ${relative_path}"

    printf '%s\t%s\t%s\t%s\t%s\n' \
      "$relative_path" "$role" "$previous_hash" "$installed_hash" "$action" >> "$applied_log"
    echo "${action} ${relative_path}"
  done < "$plan_log"

  local timestamped_receipt="${receipts_dir}/install-${compact_ts}.json"
  write_receipt "install" "$manifest_hash" "$timestamp" "$backup_dir" "$applied_log" "$stable_receipt"
  write_receipt "install" "$manifest_hash" "$timestamp" "$backup_dir" "$applied_log" "$timestamped_receipt"

  echo "Install complete."
  echo "Runtime root: ${RUNTIME_ROOT}"
  if [[ -n "$backup_dir" ]]; then
    echo "Backup dir: ${backup_dir}"
  else
    echo "Backup dir: none (runtime already matched overlay)"
  fi
  echo "Receipt: ${stable_receipt}"
}

main() {
  cd "$REPO_ROOT"
  case "${1:-}" in
    --restore)
      restore_last_install
      ;;
    "")
      install_overlay
      ;;
    *)
      fail "Unknown argument: ${1}"
      ;;
  esac
}

main "$@"
