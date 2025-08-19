// Clean single implementation only
'use client';

import React, { useEffect, useRef } from 'react';

declare global {
	interface Window {
		__FETCH_DELAY_INSTALLED__?: boolean;
	}
}

type FetchInput = RequestInfo | URL;

const MAX_DURATION_MS = 1000;

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
		if (!url.pathname.startsWith('/api/')) return false;
		const excluded = ['/api/jobs', '/api/newjobs', '/api/hirings', '/api/news', '/api/reviews'];
		return !excluded.some((p) => url.pathname === p || url.pathname.startsWith(p + '/'));
	} catch (_err) {
		return false;
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
			const shouldCap = isGetApiRequest(input, init);
			if (!shouldCap) {
				return (originalFetchRef.current as typeof fetch)(input as any, init);
			}

			const controller = new AbortController();
			const timeoutId = setTimeout(() => {
				try { controller.abort('timeout'); } catch (_err) {}
			}, MAX_DURATION_MS);

			// Respect existing signal: propagate caller aborts
			const originalSignal = init?.signal || (input instanceof Request ? input.signal : undefined);
			if (originalSignal) {
				const anySignal: any = originalSignal as any;
				if (anySignal.aborted) {
					try { controller.abort(anySignal.reason); } catch (_err) {}
				} else {
					originalSignal.addEventListener('abort', () => {
						try { controller.abort(anySignal.reason); } catch (_err) {}
					}, { once: true });
				}
			}

			try {
				const nextInit: RequestInit = { ...(init || {}), signal: controller.signal };
				return await (originalFetchRef.current as typeof fetch)(input as any, nextInit);
			} finally {
				clearTimeout(timeoutId);
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