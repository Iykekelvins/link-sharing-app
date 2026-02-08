import { Metadata } from 'next';

const title = 'Devlinks';
const description =
	'A full-stack invoice management application built with Next.js, featuring Google authentication, real-time database syncing, and PDF generation capabilities.';
export const url = 'https://link-sharing-app-iyke.vercel.app';

const keywords = [
	'link in bio',
	'social media links',
	'developer profile',
	'portfolio links',
	'linktree alternative',
	'bio link page',
	'share links',
	'link management',
	'personal brand',
	'social links',
	'link hub',
	'developer links',
	'profile page',
	'online presence',
	'link organizer',
	'custom link page',
	'sharable profile',
	'social profile',
	'link tree',
	'bio page',
	'personal link page',
	'centralized links',
	'link sharing platform',
	'social link manager',
	'one link profile',
	'developer hub',
	'github links',
	'linkedin profile',
	'twitter links',
	'portfolio showcase',
	'personal website alternative',
	'quick links',
	'link collection',
	'social media hub',
	'professional links',
	'developer branding',
	'tech profile',
	'coding portfolio',
	'programmer links',
	'software developer profile',
];

export const metaDataOptions: Metadata = {
	generator: 'Next.js',
	applicationName: 'Devlinks',
	referrer: 'origin-when-cross-origin',
	keywords,
	authors: [{ name: 'Kelvin Ochubili', url: 'https://twitter.com/iykekelvins' }],
	creator: 'Kelvin Ochubili',
	publisher: 'Kelvin Ochubili',
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		title,
		description,
		url,
		siteName: 'Devlinks',
		images: [
			{
				url: '/opengraph-image.png',
				width: 800,
				height: 600,
			},
			{
				url: '/opengraph-image.png',
				width: 1800,
				height: 1600,
				alt: 'Devlinks',
			},
		],
		locale: 'en_US',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title,
		description,
		creator: '@iykekelvins',
		images: ['/opengraph-image.png'],
	},
	alternates: {
		canonical: '/',
	},
	robots: {
		index: true,
		follow: true,
		nocache: false,
		googleBot: {
			index: true,
			follow: true,
			noimageindex: false,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
};
