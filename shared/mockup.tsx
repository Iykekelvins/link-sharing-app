'use client';

import { useLinkStore } from '@/store/useLinkStore';
import { useUserStore } from '@/store/useUserStore';
import { useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { PREVIEWLIST } from '@/components/preview-list';

import Link from 'next/link';
import Image from 'next/image';

export default function Mockup() {
	const links = useLinkStore((s) => s.links);

	const user = useUserStore((s) => s.user);
	const clerkUser = useUser();

	return (
		<div className='bg-white p-6 rounded-xl hidden des:flex items-center justify-center'>
			<div
				className={cn(
					'border border-grey border-solid h-[39.438rem] w-[19.188rem]',
					'rounded-[3.5rem] flex flex-col items-center justify-center',
					'relative',
				)}>
				<div className='flex flex-col items-center relative z-2'>
					{user && (
						<Image
							src={
								!user.image_url ? clerkUser.user?.imageUrl || '' : user?.image_url
							}
							width={96}
							height={96}
							alt={
								user.firstName
									? `${user?.firstName} ${user?.lastName} profile picture`
									: ''
							}
							className='rounded-full'
						/>
					)}

					{!user?.firstName && !user?.lastName ? (
						<div className='bg-grey-placeholder rounded-full h-2 w-18 mt-3.5' />
					) : (
						<h3 className='text-dark-grey text-[1.125rem] font-semibold mt-3.5'>
							{`${user?.firstName} ${user?.lastName}`}
						</h3>
					)}
					{!user?.email ? (
						<div className='bg-grey-placeholder rounded-full h-4 w-40 mt-6' />
					) : (
						<p className='text-grey text-sm mt-1'>{user?.email}</p>
					)}
				</div>

				<ul className='flex flex-col w-full gap-5 px-9 relative z-2 mt-8'>
					{[...Array(5)].map((_, i) => {
						if (links[i] && links[i].platform) {
							const findIcon = PREVIEWLIST.find(
								(item) => item.platform === links[i].platform,
							)?.icon;

							return (
								<li key={i}>
									<Link
										href={links[i].url}
										prefetch={false}
										target='_blank'
										rel='noopener'
										className='[&_svg]:w-full'>
										{findIcon}
									</Link>
								</li>
							);
						}
						return (
							<li key={i}>
								<div className='h-11 w-full bg-grey-placeholder rounded-lg' />
							</li>
						);
					})}
				</ul>

				<svg
					width='285'
					height='611'
					viewBox='0 0 285 611'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					className='absolute'>
					<path
						d='M45 0.5H69C75.3513 0.5 80.5 5.64873 80.5 12C80.5 20.0081 86.9919 26.5 95 26.5H190C198.008 26.5 204.5 20.0081 204.5 12C204.5 5.64873 209.649 0.5 216 0.5H240C264.577 0.5 284.5 20.4233 284.5 45V566C284.5 590.577 264.577 610.5 240 610.5H45C20.4233 610.5 0.5 590.577 0.5 566V45C0.500004 20.4233 20.4233 0.5 45 0.5Z'
						fill='white'
						stroke='#737373'
					/>
				</svg>
			</div>
		</div>
	);
}
