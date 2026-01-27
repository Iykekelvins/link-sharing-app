import type { Metadata } from 'next';
import { Instrument_Sans } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';

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
		'Consolidate your developer presence across the web. Connect your GitHub, LinkedIn, Twitter, portfolio, and other platforms into a single, shareable profile link. Make it easy for recruiters, collaborators, and the community to find you everywhere.',
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
