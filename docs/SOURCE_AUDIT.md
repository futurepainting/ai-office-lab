# Source Audit — AI Office Lab

This document maps the public Munder Difflin source into **runtime infrastructure to preserve** and **product-specific layers to replace**.

## Baseline findings

The forked source is substantially newer than the `package.json` version string suggests. The public model catalog already contains current Codex model entries such as GPT-6 Astra and GPT-5.6 Sol/Terra/Luna, while `CHANGELOG.md` contains unreleased work beyond the older package version. Treat `package.json.version` as release metadata that may lag the actual source state.

The project is a real Electron multi-agent harness, not only a visual simulation.

## Core runtime — preserve

| Capability | Primary source | Initial decision |
| --- | --- | --- |
| PTY agent processes | `src/main/pty.ts` | Preserve |
| Provider abstraction | `src/shared/agentProvider.ts` | Preserve |
| Codex command support | `src/shared/codexCommands.ts` | Preserve |
| Model catalog | `src/shared/modelCatalog.json` | Preserve, later rebrand labels only if needed |
| Hive / router / mailboxes | `src/main/hive.ts` | Preserve |
| Provider lifecycle hooks | `src/main/hooks.ts` | Preserve |
| Orchestrator identity plumbing | `src/shared/godIdentity.ts` | Preserve mechanism; replace default identity |
| Long-term / semantic memory | `src/main/memory.ts` | Preserve |
| Tasks persistence | `src/shared/taskLedger.ts`, hive `tasks.json` | Preserve |
| Schedules / webhooks / context triggers | `src/shared/triggers.ts` | Preserve |
| Circuit breaker | `src/main/breaker.ts` | Preserve |
| Config / budgets / spawn gates | `src/main/config.ts` | Preserve |
| Hiring manifest transport | `src/main/hire.ts`, `src/shared/hire.ts` | Preserve transport/security; redesign UX |
| Git / worktree isolation | `src/main/git.ts` | Preserve |
| Renderer ↔ main boundary | `src/preload/index.ts` | Preserve typed IPC boundary |

## Product/UI layer — redesign

| Surface | Current source | AI Office Lab direction |
| --- | --- | --- |
| Product shell | `src/renderer/src/App.tsx` | Redesign incrementally |
| Agent creation | `components/AddAgentModal.tsx` | Keep capability fields, redesign hiring UX |
| Agent cards | `components/AgentCard.tsx`, `AgentStrip.tsx` | Redesign around role/department/project |
| Command center | `components/CommandCenterPanel.tsx` | Replace with company-oriented control center |
| Tasks UI | `components/TasksKanban.tsx` | Reuse task data, redesign presentation later |
| Memory UI | `components/MemoryPanel.tsx`, `MemoryGraphPanel.tsx` | Reuse data, redesign presentation later |
| Pixel office | `scene/office/*` | Optional visualization layer; not core runtime |
| Design system | `design/*` | Replace brand tokens incrementally |
| Onboarding | `components/OnboardingWizard.tsx` | Redesign for AI Office Lab |

## Product-specific dependencies to remove or abstract

### 1. Default orchestrator identity

`src/shared/godIdentity.ts`

Current default:

```ts
export const DEFAULT_GOD_NAME = 'Michael';
```

The rename mechanism itself is good and should remain. Only the default identity and Michael-specific copy should be replaced.

Known dependent files include:

- `src/renderer/src/i18n/index.ts`
- `src/renderer/src/hooks/useHive.ts`
- `src/renderer/src/components/MichaelBooting.tsx`
- tests covering renamed orchestrator behavior

**Plan:** introduce a product identity/config layer rather than bulk search-replacing the name.

### 2. Application identity

`electron-builder.yml`

Current values include:

- `appId: in.munderdiffl.app`
- `productName: Munder Difflin`
- original copyright metadata

These must eventually be replaced before independent distribution.

### 3. Upstream release/update coupling

`src/shared/updateState.ts` currently points at:

```ts
export const REPO = 'chaitanyagiri/munder-difflin';
```

This is useful while tracking upstream but must not remain as the product updater source after AI Office Lab becomes independently packaged.

### 4. The Office-specific visual identity

Known sources include:

- `src/renderer/src/scene/office/cast.ts`
- `src/renderer/src/scene/office/portraitArt.ts`
- `src/renderer/src/components/MichaelBooting.tsx`
- brand copy and translations

The runtime must not depend semantically on TV-show character names.

### 5. Third-party pixel assets

The source code is MIT licensed, but bundled office tiles/maps under `src/renderer/src/assets/` are licensed separately from LimeZu and require attribution.

Relevant files:

- `LICENSE-ASSETS`
- `src/renderer/src/assets/ATTRIBUTION.md`

**Plan:** keep these temporarily for development parity, but replace them before a fully independent visual identity is shipped unless we intentionally retain and comply with that asset license.

### 6. Website / service coupling

The source contains references to the original project's domains and accounts, including:

- `munderdiffl.in`
- `harnessmd.com`
- upstream GitHub repository references

These should be separated into:
- runtime-required endpoints
- updater endpoints
- documentation/marketing links
- authentication/licensing endpoints that may belong only to the original distribution

Do not remove any endpoint until its runtime role is confirmed.

## Safety behavior worth preserving

The current code already contains several controls that should survive the refactor:

- Codex auto mode keeps `workspace-write` sandboxing rather than dropping the sandbox entirely.
- The orchestrator's ability to spawn workers is separately gated by `orchestratorMaySpawn`.
- Circuit breaker escalation is steer → constrain → stop.
- Hard stop is opt-in rather than the default.
- Webhook trigger modes support strict approval gating.
- Hiring manifests contain validation and SSRF protections.

These are infrastructure, not branding, and should not be weakened during UI/product changes.

## Baseline CI status

The upstream CI workflow originally ran only on `main` and `release/**`.

AI Office Lab's `develop` branch has been updated so the existing CI definition also targets `develop`. A push to the new fork did not produce a workflow run yet. New GitHub forks commonly require Actions to be explicitly enabled before inherited workflows execute, so the next baseline step is to enable Actions on the fork and run the untouched build/typecheck path.

## Refactor order

1. Confirm untouched source builds on Windows and CI.
2. Introduce a centralized product identity module/config.
3. Route default orchestrator name, app name, links, and update repository through it.
4. Keep runtime behavior unchanged and run typecheck/build after each identity change.
5. Replace product shell and visual system progressively.
6. Add departments, roles, reporting lines, and project/team concepts above the existing agent model.
7. Replace third-party visual assets before independent distribution.

## Non-goals for the first refactor

- No rewrite of the PTY runtime.
- No replacement of the Hive routing protocol.
- No removal of provider support.
- No simplification to a three-agent-only system.
- No weakening of sandboxing or circuit-breaker behavior.
- No PRO feature circumvention or copying unavailable proprietary UI code.
