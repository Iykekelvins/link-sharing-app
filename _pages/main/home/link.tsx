'use client';

import { useEffect, useState } from 'react';
import { Link as LinkProp, useLinkStore } from '@/store/useLinkStore';
import { cn } from '@/lib/utils';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { MENULIST } from '@/components/menu-list';

export default function Link({ index, link }: { index: number; link: LinkProp }) {
	const { links, updateLink, removeLink } = useLinkStore((state) => state);

	const [openDropdown, setOpenDropdown] = useState(false);
	const [selectedPlatform, setSelectedPlatform] = useState(link.platform ?? '');
	const [url, setUrl] = useState(link.url ?? '');

	const isPlatformAdded = (platform: string) =>
		links.find((link) => link.platform !== '' && link.platform === platform) !==
		undefined;

	useEffect(() => {
		updateLink(link.id, {
			platform: selectedPlatform,
			url,
		});
	}, [link.id, selectedPlatform, updateLink, url]);

	return (
		<li className='bg-light-grey p-5 rounded-xl'>
			<div className='flex items-center justify-between'>
				<button className='flex items-center gap-2'>
					<svg
						width='12'
						height='6'
						viewBox='0 0 12 6'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<rect width='12' height='1' fill='#737373' />
						<rect y='5' width='12' height='1' fill='#737373' />
					</svg>
					<h2 className='text-grey text-base font-bold'>Link #{index}</h2>
				</button>

				<button
					className={cn(
						'text-grey text-base hover:text-purple',
						'transition-colors duration-300 ease-in-out',
					)}
					onClick={() => removeLink(link.id)}>
					Remove
				</button>
			</div>

			<div className='mt-3'>
				<h3 className='text-dark-grey text-xs'>Platform</h3>
				<Select
					open={openDropdown}
					onOpenChange={setOpenDropdown}
					value={selectedPlatform}
					onValueChange={(value) => setSelectedPlatform(value)}>
					<SelectTrigger
						className={cn(
							'w-full mt-1',
							openDropdown && 'border-purple shadow-[0px_0px_32px_0px_#633CFF40]',
						)}>
						<SelectValue placeholder='Select platform' />
					</SelectTrigger>
					<SelectContent
						className='border-borders bg-white shadow-[0px_0px_32px_0px_#0000001A]] rounded-lg'
						position='popper'>
						{MENULIST.map((item, i) => (
							<SelectItem
								key={item.platform}
								value={item.platform}
								disabled={isPlatformAdded(item.platform)}
								className={cn(
									'py-3 cursor-pointer rounded-none text-dark-grey',
									i !== MENULIST.length - 1 &&
										'border-b border-b-borders border-solid',
									isPlatformAdded(item.platform) && 'text-purple',
									item.platform === 'Dev.to'
										? 'data-disabled:[&_svg_path:first-child]:fill-purple'
										: 'data-disabled:[&_svg_path]:fill-purple',
								)}>
								{item.icon} {item.platform}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</li>
	);
}
