'use client';

import { useState } from 'react';
import { useLinkStore } from '@/store/useLinkStore';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import EmptyState from './empty-state';
import Link from './link';

const Home = () => {
	const { links, addLink, setLinks } = useLinkStore((state) => state);

	const [errors, setErrors] = useState<ValidationErrors>({});

	const isValidUrl = (url: string): boolean => {
		if (!url.trim()) return false;

		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	};

	const [isLoading, setIsLoading] = useState(false);

	const handleSave = async () => {
		const newErrors: ValidationErrors = {};

		links.forEach((item) => {
			const urlError = !isValidUrl(item.url);
			const selectError = !item.platform;

			if (urlError || selectError) {
				newErrors[item.id!] = {
					url: urlError,
					platform: selectError,
				};
				toast.warning('Please fill all necessary fields!');
			}
		});

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			// handle saving links to db

			try {
				setIsLoading(true);

				const linksToSave = links.map((link) => ({
					platform: link.platform,
					url: link.url,
					id: link.id,
				}));

				const response = await fetch('/api/links', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ links: linksToSave }),
				});

				if (!response.ok) {
					toast.error('Failed to save links');
					return;
				}

				const data = await response.json();
				toast.success(data.message);
				setLinks(data.links);
			} catch (error) {
				console.log(error);

				toast.error('Failed to save links. Please try again.');
			} finally {
				setIsLoading(false);
			}
		} else {
			console.log('Validation errors:', newErrors);
		}
	};

	return (
		<div className='bg-white rounded-xl flex flex-col'>
			<div className='p-6 des:p-10 flex-1 flex flex-col'>
				<h1 className='text-dark-grey text-2xl md:text-[2rem] font-bold leading-normal'>
					Customize your links
				</h1>
				<p className='text-grey text-base leading-normal mt-2'>
					Add/edit/remove links below and then share all your profiles with the
					world!
				</p>

				<Button
					variant={'secondary'}
					className='mt-10 w-full'
					disabled={links.length === 14}
					onClick={() =>
						addLink({
							platform: '',
							url: '',
							id: crypto.randomUUID(),
						})
					}>
					+ Add new link
				</Button>

				{/* empty state - no links added */}
				{links.length === 0 ? (
					<EmptyState />
				) : (
					<ul className='flex flex-col gap-6 mt-6  overflow-y-auto'>
						{links.map((link, i) => (
							<Link
								key={link.id || link._id}
								index={i + 1}
								link={link}
								errors={errors}
								setErrors={setErrors}
							/>
						))}
					</ul>
				)}
			</div>

			<div
				className={cn(
					'border-t border-t-borders border-solid',
					'flex justify-end py-6 px-6 md:px-0',
				)}>
				<Button
					className='w-full md:w-max min-w-22.5 md:mr-10'
					onClick={handleSave}
					disabled={isLoading || links.length === 0}>
					{isLoading && <Spinner />}
					Save
				</Button>
			</div>
		</div>
	);
};

export default Home;
