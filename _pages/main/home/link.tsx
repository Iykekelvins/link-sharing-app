'use client';

import { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function Link({
	index,
	link,
	errors,
	setErrors,
}: {
	index: number;
	link: LinkProp;
	errors: ValidationErrors;
	setErrors: (e: ValidationErrors) => void;
}) {
	const { links, updateLink, removeLink } = useLinkStore((state) => state);

	const [openDropdown, setOpenDropdown] = useState(false);

	const isPlatformAdded = (platform: string) =>
		links.find((link) => link.platform !== '' && link.platform === platform) !==
		undefined;

	const handleInputChange = (
		id: string,
		field: 'url' | 'platform',
		value: string,
	) => {
		updateLink(link.id as string, {
			[field]: value,
		});

		if (link.id && errors[link.id] && value.trim() !== '') {
			setErrors({
				...errors,
				[id]: {
					...errors[id],
					[field === 'url' ? 'url' : 'platform']: false,
				},
			});
		}
	};

	const isValidUrl = (url: string): boolean => {
		if (!url.trim()) return false;

		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	};

	const handleBlur = (id: string, field: 'url' | 'platform', value: string) => {
		// Re-validate on blur if field is empty or invalid
		if (errors[id]) {
			const isUrlField = field === 'url';
			const hasError = isUrlField ? !isValidUrl(value) : !value;

			if (hasError) {
				setErrors({
					...errors,
					[id]: {
						...errors[id],
						[isUrlField ? 'url' : 'select']: true,
					},
				});
			}
		}
	};

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
					onClick={() => removeLink(link.id as string)}>
					Remove
				</button>
			</div>

			<div className='mt-3'>
				<h3 className='text-dark-grey text-xs'>Platform</h3>
				<Select
					open={openDropdown}
					onOpenChange={setOpenDropdown}
					value={link.platform}
					onValueChange={(e) => handleInputChange(link.id as string, 'platform', e)}>
					<SelectTrigger
						className={cn(
							'w-full mt-1',
							openDropdown && 'border-purple shadow-[0px_0px_32px_0px_#633CFF40]',
						)}
						onBlur={(e) => handleBlur(link.id as string, 'platform', e.target.value)}
						aria-invalid={errors[link.id as string]?.platform}>
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
				{errors[link.id as string]?.platform && (
					<span className='text-xs text-red'>can&apos;t be empty</span>
				)}

				<div className='mt-3'>
					<Label
						className={`text-dark-grey text-xs ${errors[link.id as string]?.url ? 'text-red' : ''}`}
						htmlFor={`link-${index}`}>
						Link
					</Label>
					<Input
						name={`link-${index}`}
						id={`link-${index}`}
						value={link.url}
						onChange={(e) =>
							handleInputChange(link.id as string, 'url', e.target.value)
						}
						onBlur={(e) => handleBlur(link.id as string, 'url', e.target.value)}
						className='mt-1'
						aria-invalid={errors[link.id as string]?.url}
					/>
					{errors[link.id as string]?.url && (
						<span className='text-xs text-red'>
							{errors[link.id as string].url && !link.url
								? "can't be empty"
								: 'invalid url'}
						</span>
					)}
				</div>
			</div>
		</li>
	);
}
