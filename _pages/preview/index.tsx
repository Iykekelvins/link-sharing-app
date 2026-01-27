'use client';

import { PREVIEWLIST } from '@/components/preview-list';
import { cn } from '@/lib/utils';
import { Link as LinkProps, useLinkStore } from '@/store/useLinkStore';
import { User, useUserStore } from '@/store/useUserStore';

import Image from 'next/image';
import Link from 'next/link';

const Preview = ({ user, links }: { user: User; links: LinkProps[] }) => {
	const storeUser = useUserStore((s) => s.user);
	const storeLinks = useLinkStore((s) => s.links);

	return (
		<div
			className={cn(
				'mt-24  sm:bg-white mx-auto sm:rounded-3xl py-12 sm:px-14',
				'sm:shadow-[0px_0px_32px_0px_#0000001A] relative z-10 mb-6',
			)}>
			<div className='flex flex-col items-center justify-center'>
				<div className='flex flex-col items-center'>
					<div className='rounded-full border-4 border-purple border-solid'>
						{(user || storeUser) && (
							<Image
								src={
									user
										? (user?.image_url as string)
										: (storeUser?.image_url as string)
								}
								width={104}
								height={104}
								alt={
									user
										? `${user.firstName} ${user.lastName}`
										: `${storeUser?.firstName} ${storeUser?.lastName}`
								}
								className='rounded-full object-cover'
							/>
						)}
					</div>

					<h1 className='text-2xl font-bold text-dark-grey mt-6.25'>
						{user
							? `${user.firstName} ${user.lastName}`
							: `${storeUser?.firstName} ${storeUser?.lastName}`}
					</h1>

					<p className='text-grey text-base mt-2'>
						{user ? user.email : storeUser?.email}
					</p>
				</div>

				{links && links.length > 0 ? (
					<ul className='flex flex-col gap-5 mt-14'>
						{links.map((_, i) => {
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
						})}
					</ul>
				) : (
					storeLinks.length > 0 && (
						<ul className='flex flex-col gap-5 mt-14'>
							{storeLinks.map((_, i) => {
								if (storeLinks[i] && storeLinks[i].platform) {
									const findIcon = PREVIEWLIST.find(
										(item) => item.platform === storeLinks[i].platform,
									)?.icon;

									return (
										<li key={i}>
											<Link
												href={storeLinks[i].url}
												prefetch={false}
												target='_blank'
												rel='noopener'
												className='[&_svg]:w-full'>
												{findIcon}
											</Link>
										</li>
									);
								}
							})}
						</ul>
					)
				)}
			</div>
		</div>
	);
};

export default Preview;
