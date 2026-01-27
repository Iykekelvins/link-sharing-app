'use client';

import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import Link from 'next/link';

export default function PreviewNavbar() {
	const pathname = usePathname();

	const handleLinkCopy = () => {
		if (pathname === '/preview') return;

		navigator.clipboard.writeText(window.location.href);
		toast.success('Link copied to clipboard!');
	};

	return (
		<>
			<header className='pt-4 sm:pt-6 px-4 sm:px-6 sticky -top-4 sm:-top-6 z-20'>
				<nav
					className={cn(
						'bg-white flex items-center justify-between gap-4',
						'p-4 sm:rounded-xl',
					)}>
					<Link href='/' className='w-full sm:w-max block'>
						<Button variant='secondary' className='w-full'>
							Back to Editor
						</Button>
					</Link>
					<Button className='w-1/2 sm:w-max' onClick={handleLinkCopy}>
						Share Link
					</Button>
				</nav>
			</header>
			<div className='sm:h-89.25 sm:bg-purple rounded-b-3xl fixed top-0 left-0 w-full sm:p-6' />
		</>
	);
}
