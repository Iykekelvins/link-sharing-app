import type { Metadata } from 'next';
import { Instrument_Sans } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';
import { metaDataOptions } from '@/lib/metadata';

import './globals.css';

const instrumentSans = Instrument_Sans({
	variable: '--font-instrument-sans',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: {
		default: 'Devlinks - Home',
		template: 'Devlinks - %s',
	},
	description:
		'A full-stack invoice management application built with Next.js, featuring Google authentication, real-time database syncing, and PDF generation capabilities.',
	metadataBase: new URL('https://link-sharing-app-iyke.vercel.app'),
	...metaDataOptions,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<body className={`${instrumentSans.variable} antialiased`}>
					{children}
					<Toaster position='bottom-center' richColors theme='dark' />
				</body>
			</html>
		</ClerkProvider>
	);
}
