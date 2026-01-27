'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import { revalidateLinks } from '@/lib/revalidate';

export default function DeleteLinkModal({
	id,
	openDeleteModal,
	setOpenDeleteModal,
}: {
	id: string;
	openDeleteModal: boolean;
	setOpenDeleteModal: (open: boolean) => void;
}) {
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDeleteLink = async () => {
		try {
			setIsDeleting(true);

			const res = await fetch(`/api/links/${id}`, {
				method: 'DELETE',
			});

			if (res.ok) {
				toast.success('Link deleted successfully.');
			}
		} catch (error) {
			console.log(error);

			toast.error('Failed to delete the link. Please try again.');
		} finally {
			setIsDeleting(false);
			setOpenDeleteModal(false);
			await revalidateLinks();
		}
	};

	return (
		<Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
			<DialogTrigger asChild>
				<button
					className={cn(
						'text-grey text-base hover:text-purple',
						'transition-colors duration-300 ease-in-out',
					)}>
					Remove
				</button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle className='text-dark-grey'>Delete Link</DialogTitle>
				<DialogDescription>
					This will remove the link from your public page.
				</DialogDescription>

				<Button onClick={handleDeleteLink} disabled={isDeleting}>
					{isDeleting && <Spinner />} Continue
				</Button>
			</DialogContent>
		</Dialog>
	);
}
