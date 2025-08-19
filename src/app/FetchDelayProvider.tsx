'use client';

import React, { useEffect, useRef } from 'react';

declare global {
	interface Window {
		__FETCH_DELAY_INSTALLED__?: boolean;
	}
}

type FetchInput = RequestInfo | URL;

const MIN_DELAY_MS = 1000;

function isGetApiRequest(input: FetchInput, init?: RequestInit): boolean {
	const method = (init?.method || (input instanceof Request ? input.method : 'GET') || 'GET').toUpperCase();
	if (method !== 'GET') return false;

	try {
		const urlString = typeof input === 'string'
			? input
			: input instanceof URL
				? input.toString()
				: input instanceof Request
					? input.url
					: String(input);

		const url = new URL(urlString, typeof window !== 'undefined' ? window.location.href : 'http://localhost');
		return url.pathname.startsWith('/api/');
	} catch (_err) {
		return false;
	}
}

async function waitForAtLeast(startMs: number, minDelayMs: number): Promise<void> {
	const elapsed = performance.now() - startMs;
	const remaining = minDelayMs - elapsed;
	if (remaining > 0) {
		await new Promise((resolve) => setTimeout(resolve, remaining));
	}
}

export default function FetchDelayProvider({ children }: { children: React.ReactNode }) {
	const originalFetchRef = useRef<typeof fetch | null>(null);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		if (window.__FETCH_DELAY_INSTALLED__) return;

		window.__FETCH_DELAY_INSTALLED__ = true;
		originalFetchRef.current = window.fetch.bind(window);

		const wrappedFetch: typeof fetch = async (input: FetchInput, init?: RequestInit) => {
			const shouldDelay = isGetApiRequest(input, init);
			const start = performance.now();
			try {
				const response = await (originalFetchRef.current as typeof fetch)(input as any, init);
				if (shouldDelay) {
					await waitForAtLeast(start, MIN_DELAY_MS);
				}
				return response;
			} catch (error) {
				if (shouldDelay) {
					await waitForAtLeast(start, MIN_DELAY_MS);
				}
				throw error;
			}
		};

		window.fetch = wrappedFetch;

		return () => {
			if (originalFetchRef.current) {
				window.fetch = originalFetchRef.current;
			}
			window.__FETCH_DELAY_INSTALLED__ = false;
		};
	}, []);

	return <>{children}</>;
}

