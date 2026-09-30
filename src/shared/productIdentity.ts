/**
 * Product identity seam for AI Office Lab.
 *
 * Keep runtime mechanics decoupled from product naming so the fork can replace
 * Munder Difflin-specific branding without touching the PTY/Hive/provider core.
 *
 * Phase 1 intentionally preserves the upstream values. Later refactors can change
 * these constants while the rest of the runtime keeps the same contracts.
 */
export const PRODUCT_IDENTITY = {
  productName: 'Munder Difflin',
  defaultOrchestratorName: 'Manager',
  updateRepository: 'chaitanyagiri/munder-difflin',
  deepLinkScheme: 'munderdifflin',
  releaseArtifactPrefix: 'Munder-Difflin'
} as const;

export const PRODUCT_NAME: string = PRODUCT_IDENTITY.productName;
export const DEFAULT_ORCHESTRATOR_NAME: string = PRODUCT_IDENTITY.defaultOrchestratorName;
export const UPDATE_REPOSITORY: string = PRODUCT_IDENTITY.updateRepository;
export const DEEP_LINK_SCHEME: string = PRODUCT_IDENTITY.deepLinkScheme;
export const RELEASE_ARTIFACT_PREFIX: string = PRODUCT_IDENTITY.releaseArtifactPrefix;
