'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import z from 'zod';
import Inputs from './inputs';
import ProfilePicture from './profile-picture';
import userProfileSchema from './schema';

const Profile = () => {
	const form = useForm<z.infer<typeof userProfileSchema>>({
		resolver: zodResolver(userProfileSchema),
		defaultValues: {
			first_name: '',
			last_name: '',
		},
	});

	async function onSubmit(values: z.infer<typeof userProfileSchema>) {}

	return (
		<div className='bg-white p-6 rounded-xl'>
			<h1 className='text-dark-grey text-2xl md:text-[2rem] font-bold leading-normal'>
				Profile Details
			</h1>
			<p className='text-grey text-base leading-normal mt-2'>
				Add your details to create a personal touch to your profile.
			</p>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<ProfilePicture form={form} />
					<Inputs form={form} />

					<div className='border-t border-t-borders border-solid flex justify-end py-6 mt-12'>
						<Button className='w-full md:w-max'>Save</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default Profile;
