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

main() {
  cd "$REPO_ROOT"
  [[ -d "$RUNTIME_ROOT" ]] || fail "Runtime root not found: ${RUNTIME_ROOT}"
  [[ -f "$MANIFEST_PATH" ]] || fail "Manifest not found: ${MANIFEST_PATH}"

  local receipt_dirname
  receipt_dirname="$(manifest_value receipt_dirname)"
  local receipt_dir="${RUNTIME_ROOT}/${receipt_dirname}"
  local stable_receipt="${receipt_dir}/install-receipt.json"
  local manifest_hash
  manifest_hash="$(sha256_of "$MANIFEST_PATH")"

  local has_failures=0

  while IFS=$'\t' read -r relative_path role expected_upstream overlay_hash; do
    local overlay_path="${OVERLAY_ROOT}/${relative_path}"
    local runtime_path="${RUNTIME_ROOT}/${relative_path}"

    [[ -f "$overlay_path" ]] || fail "Overlay file missing: ${overlay_path}"
    [[ -f "$runtime_path" ]] || fail "Runtime file missing: ${runtime_path}"

    local actual_overlay_hash
    actual_overlay_hash="$(sha256_of "$overlay_path")"
    [[ "$actual_overlay_hash" == "$overlay_hash" ]] || fail "Overlay hash mismatch for ${relative_path}"

    local runtime_hash
    runtime_hash="$(sha256_of "$runtime_path")"

    if [[ "$runtime_hash" == "$overlay_hash" ]]; then
      echo "ok      ${relative_path} (${role})"
    elif [[ "$runtime_hash" == "$expected_upstream" ]]; then
      echo "stale   ${relative_path} (${role}) -- runtime matches reviewed upstream, not overlay" >&2
      has_failures=1
    else
      echo "drift   ${relative_path} (${role}) -- runtime hash ${runtime_hash}" >&2
      has_failures=1
    fi
  done < <(emit_targets)

  if [[ -f "$stable_receipt" ]]; then
    local receipt_manifest_hash
    receipt_manifest_hash="$(node - "$stable_receipt" <<'NODE'
const fs = require("fs");
const receipt = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
process.stdout.write(receipt.manifest_hash || "");
NODE
)"
    if [[ "$receipt_manifest_hash" != "$manifest_hash" ]]; then
      echo "receipt mismatch -- ${stable_receipt} was written for manifest ${receipt_manifest_hash}, current manifest is ${manifest_hash}" >&2
      has_failures=1
    fi
  else
    echo "receipt missing -- ${stable_receipt}" >&2
    has_failures=1
  fi

  if [[ "$has_failures" -ne 0 ]]; then
    fail "Future-aware harness verification failed"
  fi

  echo "Future-aware harness verified."
}

main "$@"
