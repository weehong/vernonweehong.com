const WINDOW_MS = 15 * 60 * 1000;
const MAX_HITS = 5;

const hitsByKey = new Map<string, Array<number>>();

export function isRateLimited(key: string, now: number = Date.now()): boolean {
	const prior = (hitsByKey.get(key) ?? []).filter(
		(stamp) => now - stamp < WINDOW_MS
	);
	if (prior.length >= MAX_HITS) {
		hitsByKey.set(key, prior);
		return true;
	}
	prior.push(now);
	hitsByKey.set(key, prior);
	return false;
}

export function resetRateLimits(): void {
	hitsByKey.clear();
}
