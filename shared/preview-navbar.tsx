import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import Link from 'next/link';

export default function PreviewNavbar() {
	return (
		<header className='sm:h-89.25 sm:bg-purple rounded-b-3xl fixed top-0 left-0 w-full sm:p-6'>
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
				<Button className='w-1/2 sm:w-max'>Share Link</Button>
			</nav>
		</header>
	);
}
