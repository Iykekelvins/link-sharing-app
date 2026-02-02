'use client';

import { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { useUserStore } from '@/store/useUserStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { handleError } from '@/lib/utils';

import userProfileSchema from './schema';
import z from 'zod';
import Inputs from './inputs';
import ProfilePicture from './profile-picture';
import Email from './email';

const Profile = () => {
	const form = useForm<z.infer<typeof userProfileSchema>>({
		resolver: zodResolver(userProfileSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			username: '',
			profilePicture: undefined,
		},
	});

	const clerkUser = useUser();
	const user = useUserStore((s) => s.user);
	const setUser = useUserStore((s) => s.setUser);

	const [isUpdating, setIsUpdating] = useState(false);

	async function onSubmit(values: z.infer<typeof userProfileSchema>) {
		try {
			setIsUpdating(true);

			const formData = new FormData();

			formData.append('firstName', values.firstName);
			formData.append('lastName', values.lastName);
			formData.append('username', values.username);

			if (typeof form.getValues('profilePicture') === 'object') {
				formData.append('profilePicture', values.profilePicture);
			}

			const res = await fetch(`/api/users/${clerkUser.user?.id}`, {
				method: 'PATCH',
				body: formData,
			});

			const result = await res.json();

			if (res.ok) {
				toast.success(result.message);
				setUser(result?.user);
			} else {
				toast.error(result.message || result.error);
			}

			await clerkUser.user?.reload();
		} catch (error) {
			handleError(error);
		} finally {
			setIsUpdating(false);
		}
	}

	const userData = useMemo(() => {
		if (!clerkUser.user) return null;

		return {
			firstName: clerkUser.user.firstName ?? '',
			lastName: clerkUser.user.lastName ?? '',
			username: clerkUser.user.username ?? '',
			profilePicture: user?.image_url ?? clerkUser.user.imageUrl ?? '',
		};
	}, [clerkUser.user, user]);

	useEffect(() => {
		if (userData) {
			form.reset(userData);
		}
	}, [userData, form]);

	return (
		<div className='bg-white p-6 rounded-xl'>
			<h1 className='text-dark-grey text-2xl md:text-[2rem] font-bold leading-normal'>
				Profile Details
			</h1>
			<p className='text-grey text-base leading-normal mt-2'>
				Add your details to create a personal touch to your profile.
			</p>

			{clerkUser.user?.passwordEnabled ? (
				<Tabs defaultValue='account' className='w-full mt-6'>
					<TabsList variant='line'>
						<TabsTrigger value='account' className='text-dark-grey'>
							Account Info
						</TabsTrigger>
						<TabsTrigger value='email' className='text-dark-grey'>
							Email Address
						</TabsTrigger>
					</TabsList>
					<TabsContent value='account'>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<ProfilePicture form={form} />
								<Inputs form={form} />

								<div className='border-t border-t-borders border-solid flex justify-end py-6 mt-12'>
									<Button className='w-full md:w-max' disabled={isUpdating}>
										{isUpdating && <Spinner />}
										<span>Save</span>
									</Button>
								</div>
							</form>
						</Form>
					</TabsContent>
					<TabsContent value='email'>
						<Email />
					</TabsContent>
				</Tabs>
			) : (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<ProfilePicture form={form} />
						<Inputs form={form} />

						<div className='border-t border-t-borders border-solid flex justify-end py-6 mt-12'>
							<Button className='w-full md:w-max' disabled={isUpdating}>
								{isUpdating && <Spinner />}
								<span>Save</span>
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	);
};

export default Profile;
