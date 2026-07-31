// Single source of truth for site-wide values so nothing gets hand-typed
// inconsistently across pages. Fill these in first when starting a new
// client project — everything else (BaseHead, Header, Footer, schema)
// reads from here.

export const SITE_TITLE = 'Client Name';
export const SITE_DESCRIPTION = 'One sentence describing what this business does and for whom.';

export const SITE_PHONE = '(555) 555-5555';
export const SITE_EMAIL = 'hello@example.com';
export const SITE_ADDRESS = ''; // optional — leave blank if the client has no public storefront address

export const NAV_LINKS = [
	{ label: 'Home', href: '/' },
	{ label: 'About', href: '/about/' },
	{ label: 'Services', href: '/services/' },
	{ label: 'Gallery', href: '/gallery/' },
	{ label: 'Contact', href: '/contact/' },
];
