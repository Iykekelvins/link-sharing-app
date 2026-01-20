import { cn } from '@/lib/utils';

import Image from 'next/image';

export default function EmptyState() {
	return (
		<div
			className={cn(
				'bg-light-grey rounded-lg mt-6 py-5 md:py-16 p-5 flex-1 text-center',
				'flex flex-col items-center justify-center',
			)}>
			<Image
				src='/empty-state.svg'
				width={250}
				height={160}
				alt='Empty state graphic'
			/>
			<h2 className='text-2xl md:text-[2rem] text-dark-grey font-bold mt-10'>
				Let&apos;s get you started
			</h2>
			<p className='text-grey text-base leading-normal mt-6 max-w-122'>
				Use the “Add new link” button to get started. Once you have more than one
				link, you can reorder and edit them. We&apos;re here to help you share your
				profiles with everyone!
			</p>
		</div>
	);
}
