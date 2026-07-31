// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://example.com', // TODO: replace with the client's real domain before launch
	build: {
		// Inline all page CSS directly into the HTML instead of splitting it
		// into a separate hashed file. On a slow connection, an external
		// stylesheet request can lose the race with first paint, showing a
		// flash of unstyled (browser-default) content before it loads.
		inlineStylesheets: 'always',
	},
	integrations: [sitemap()],
});
