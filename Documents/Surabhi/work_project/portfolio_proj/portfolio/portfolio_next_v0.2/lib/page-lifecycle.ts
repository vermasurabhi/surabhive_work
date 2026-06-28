// In Next.js, cleanup is handled by useEffect return functions.
// This stub is kept for compatibility with liquid-hub which imports setPageCleanup.
let pageCleanup: (() => void) | null = null;

export function runPageCleanup(): void {
  pageCleanup?.();
  pageCleanup = null;
}

export function setPageCleanup(cleanup: (() => void) | null): void {
  pageCleanup?.();
  pageCleanup = cleanup;
}
