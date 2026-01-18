'use client';

import { useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { toast } from 'sonner';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

const codeFormSchema = z.object({
	code: z.string().min(6, "Can't be empty"),
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

	const codeForm = useForm<z.infer<typeof codeFormSchema>>({
		resolver: zodResolver(codeFormSchema),
		defaultValues: {
			code: '',
		},
	});

	const { signUp, setActive, isLoaded } = useSignUp();
	const [verifying, setVerifying] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);

		if (!isLoaded) return;

		try {
			await signUp?.create({
				emailAddress: values.email,
				password: values.password,
			});

			await signUp?.prepareEmailAddressVerification({
				strategy: 'email_code',
			});

			toast.success(`An otp has been sent to ${values.email}`);
			setVerifying(true);
		} catch (error) {
			if (isClerkAPIResponseError(error)) {
				toast.error(error.message);
			}
		} finally {
			setIsLoading(false);
		}
	}

	async function onCodeSubmit(values: z.infer<typeof codeFormSchema>) {
		setIsLoading(true);

		if (!isLoaded) return;

		try {
			const signUpAttempt = await signUp?.attemptEmailAddressVerification({
				code: values.code,
			});

			if (signUpAttempt?.status === 'complete') {
				await setActive({
					session: signUpAttempt?.createdSessionId,
					navigate: async ({ session }) => {
						if (session?.currentTask) {
							console.log(session?.currentTask);
							return;
						}

						// router.push('/')
						console.log(session.user);
					},
				});
			} else {
				console.error('Sign-up attempt not complete:', signUpAttempt);
				console.error('Sign-up attempt status:', signUpAttempt?.status);
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
			{!verifying ? (
				<>
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

							<Button className='w-full' disabled={isLoading}>
								{isLoading && <Spinner />}
								Continue
							</Button>
						</form>
					</Form>
				</>
			) : (
				<>
					<h1 className='text-dark-grey text-[2rem] font-bold'>Input OTP</h1>
					<Form {...codeForm}>
						<form
							onSubmit={codeForm.handleSubmit(onCodeSubmit)}
							className='mt-4 space-y-6'>
							<FormField
								control={codeForm.control}
								name='code'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<InputOTP maxLength={6} {...field} className='w-full'>
												<InputOTPGroup className='w-full'>
													<InputOTPSlot index={0} />
													<InputOTPSlot index={1} />
													<InputOTPSlot index={2} />
													<InputOTPSlot index={3} />
													<InputOTPSlot index={4} />
													<InputOTPSlot index={5} />
												</InputOTPGroup>
											</InputOTP>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button className='w-full' disabled={isLoading}>
								{isLoading && <Spinner />}
								Create new account
							</Button>
						</form>
					</Form>
				</>
			)}

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
