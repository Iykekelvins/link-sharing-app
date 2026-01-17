'use client';

import { useForm } from 'react-hook-form';
import { Lock, Mail } from '@/components/icons';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import Link from 'next/link';

const formSchema = z
	.object({
		email: z.string().email(),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.max(100, 'Password must be less than 100 characters'),
		confirmPassword: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.max(100, 'Password must be less than 100 characters'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

const SignUp = () => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		console.log('values', values);
	}

	return (
		<div className='md:p-8'>
			<div>
				<h1 className='text-dark-grey text-[2rem] font-bold'>Create account</h1>
				<p className='text-grey text-base mt-2'>
					Let&apos;s get you started sharing your links!
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='mt-10 space-y-6'>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email address</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder='e.g. iyke@email.com'
										icon={<Mail />}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Create password</FormLabel>
								<FormControl>
									<Input
										{...field}
										type='password'
										placeholder='At least 8 characters'
										icon={<Lock />}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='confirmPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm password</FormLabel>
								<FormControl>
									<Input
										{...field}
										type='password'
										placeholder='At least 8 characters'
										icon={<Lock />}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button className='w-full'>Create new account</Button>
				</form>
			</Form>

			<p className='text-center text-grey mt-6'>
				Already have an account?
				<Link href='/sign-in' className='text-purple'>
					{' '}
					Login
				</Link>
			</p>
		</div>
	);
};

export default SignUp;
