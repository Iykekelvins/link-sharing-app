'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { toast } from 'sonner';
import { useSignIn } from '@clerk/nextjs';
import { Lock, Mail } from '@/components/icons';
import { Spinner } from '@/components/ui/spinner';
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

const formSchema = z.object({
	email: z.email(),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.max(100, 'Password must be less than 100 characters'),
});

const SignIn = () => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const { isLoaded, signIn, setActive } = useSignIn();
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);

		if (!isLoaded) return;

		try {
			const signInAttempt = await signIn.create({
				identifier: values.email,
				password: values.password,
			});

			if (signInAttempt.status === 'complete') {
				await setActive({
					session: signInAttempt.createdSessionId,
					navigate: async ({ session }) => {
						if (session?.currentTask) {
							console.log(session?.currentTask);
							return;
						}

						router.push('/');
					},
				});
			}
		} catch (error) {
			if (isClerkAPIResponseError(error)) {
				toast.error(error.message);
			}
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className='md:p-8'>
			<div>
				<h1 className='text-dark-grey text-[2rem] font-bold'>Login</h1>
				<p className='text-grey text-base mt-2'>
					Add your details below to get back into the app
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
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										{...field}
										type='password'
										placeholder='Enter your password'
										icon={<Lock />}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button className='w-full' disabled={isLoading}>
						{isLoading && <Spinner />}
						Login
					</Button>
				</form>
			</Form>

			<p className='text-center text-grey mt-6'>
				Don&apos;t have an account?{' '}
				<Link href='/sign-up' className='text-purple'>
					Create account
				</Link>
			</p>
		</div>
	);
};

export default SignIn;
