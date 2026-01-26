'use client';

import { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
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

	const user = useUser();

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

			const res = await fetch(`/api/users/${user.user?.id}`, {
				method: 'PATCH',
				body: formData,
			});

			const result = await res.json();

			console.log(result);

			if (res.ok) {
				toast.success('Profile updated successfully');
			} else {
				toast.error(result.message || result.error);
			}

			await user.user?.reload();
		} catch (error) {
			handleError(error);
		} finally {
			setIsUpdating(false);
		}
	}

	const userData = useMemo(() => {
		if (!user.user) return null;

		return {
			firstName: user.user.firstName ?? '',
			lastName: user.user.lastName ?? '',
			username: user.user.username ?? '',
			email: user.user.emailAddresses[0]?.emailAddress ?? '',
			profilePicture: user.user.imageUrl,
		};
	}, [user.user]);

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
			</Tabs>
		</div>
	);
};

export default Profile;
