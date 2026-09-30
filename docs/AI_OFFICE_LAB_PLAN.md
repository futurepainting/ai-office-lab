# AI Office Lab — Reuse & Refactor Plan

This fork starts from `chaitanyagiri/munder-difflin` and keeps the upstream relationship intact.

## Goal

Build an independent AI office product on top of the existing open-source multi-agent runtime, while preserving the difficult infrastructure that already works and replacing the product-specific branding, organization model, and user experience.

## Preserve first

Do not rewrite these unless a concrete limitation is proven:

- PTY-based agent runtime and process lifecycle
- Provider abstraction and CLI adapters
- Codex / Claude / Gemini / other supported engines
- Hive inbox/outbox routing and agent-to-agent messaging
- Orchestrator execution path
- Task ledger and task persistence
- Long-term memory and semantic-memory integration
- Triggers / schedules / webhook routing
- Circuit breaker and human-in-the-loop safety controls
- Git/worktree isolation and filesystem bridges
- Usage / token / cost telemetry plumbing

## Replace or redesign

These are product-layer concerns and may be substantially changed:

- Munder Difflin branding and copy
- Michael / The Office-specific identity
- Pixel-office art direction and licensed LimeZu assets
- Office layout and navigation
- Agent hiring UX
- Organization structure, departments, roles, and hierarchy
- Project / team / reporting UX
- Approval and reporting surfaces
- Onboarding flow

## Licensing constraints

- Source code is MIT licensed; retain required copyright and license notice.
- Bundled LimeZu pixel-art assets are separately licensed and are not covered by the MIT license.
- Long-term product work should replace third-party visual assets with original assets unless their separate license is intentionally retained and credited.

## Branch policy

- `main`: upstream-compatible stable baseline
- `develop`: integration branch for AI Office Lab work
- `feature/*`: scoped implementation branches

Avoid direct product refactors on `main`.

## First milestones

1. Verify the fork builds from source on Windows without product changes.
2. Build a source map for runtime, orchestrator, hive, tasks, memory, triggers, breaker, and renderer.
3. Inventory all Munder Difflin / Michael / The Office / asset-specific dependencies.
4. Introduce a product-identity layer so branding can change without touching runtime logic.
5. Replace visual/product shell incrementally while keeping the existing runtime functional.
6. Add organization concepts (departments, roles, reporting lines) as a layer above agents rather than changing the PTY/provider core.
7. Only after parity is preserved, add new AI Office-specific features.

## Current working assumption

The public source already contains the core multi-agent engine needed for this project. The professional workspace shipped in current binaries may not be fully represented in the public repository, so AI Office Lab should not depend on proprietary or unavailable Pro UI code. The plan is to reuse the open runtime and build an independent product surface.


## Baseline CI

GitHub Actions is enabled on the fork. The `develop` branch is used to exercise the untouched upstream typecheck/build path, including a Windows baseline job before product refactors begin.
