import type { APIRoute } from 'astro';
import { SITE_TITLE } from '../consts';

// Auto-generates a favicon from the business name's first letter so a new
// client project has a reasonable default with zero manual asset work.
// Once the client has a real logo, replace this with a static file in
// public/ (favicon.svg or .ico) and delete this route — see CLAUDE.md.
const initial = (SITE_TITLE.trim().charAt(0) || '?').toUpperCase();

// Keep this in sync with --color-accent / --color-accent-contrast in
// tokens.css — this is a static build-time asset, so it can't read CSS
// custom properties directly.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#1A8917"/><text x="16" y="22" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="16" fill="#FFFFFF">${initial}</text></svg>`;

export const GET: APIRoute = () =>
	new Response(svg, {
		headers: { 'Content-Type': 'image/svg+xml' },
	});
