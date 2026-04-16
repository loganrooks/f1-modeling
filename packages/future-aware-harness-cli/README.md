# Future-Aware Harness CLI

`fa-harness` installs and reconciles the future-aware planning harness at two layers:

- user-level GSDR runtime overlay
- project-level doctrine, governance, and audit scaffolding

The package is designed to run as a deterministic CLI first. A later skill wrapper can call into the same runtime and project reconciliation paths when repo-specific judgment is needed.

## Commands

- `fa-harness onboard`
- `fa-harness inspect`
- `fa-harness install-runtime`
- `fa-harness upgrade-runtime`
- `fa-harness restore-runtime`
- `fa-harness verify-runtime`
- `fa-harness bootstrap-project`
- `fa-harness upgrade-project`
- `fa-harness verify-project`

## Development

From the repo root:

```bash
npm run typecheck --workspace @f1-modeling/future-aware-harness-cli
npm run test --workspace @f1-modeling/future-aware-harness-cli
npm pack --workspace @f1-modeling/future-aware-harness-cli
```

`npm pack` triggers `sync-assets`, which snapshots the reviewed runtime overlay into `generated-assets/` so the tarball is self-contained.
