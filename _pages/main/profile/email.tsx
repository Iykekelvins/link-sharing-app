'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useReverification, useUser } from '@clerk/nextjs';
import { useUserStore } from '@/store/useUserStore';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { EmailAddressResource } from '@clerk/types';

const emailSchema = z.object({
	email: z.email(),
});

const codeFormSchema = z.object({
	code: z.string().min(6, "Can't be empty"),
});

export default function Email() {
	const [verifying, setVerifying] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [emailObj, setEmailObj] = useState<EmailAddressResource | undefined>();

	const { user, isLoaded } = useUser();

	const updateUser = useUserStore((s) => s.updateUser);

	const form = useForm<z.infer<typeof emailSchema>>({
		resolver: zodResolver(emailSchema),
		defaultValues: {
			email: '',
		},
	});

	const codeForm = useForm<z.infer<typeof codeFormSchema>>({
		resolver: zodResolver(codeFormSchema),
		defaultValues: {
			code: '',
		},
	});

	const createEmailAddress = useReverification((email: string) =>
		user?.createEmailAddress({ email }),
	);

	const onSubmitEmail = async (values: z.infer<typeof emailSchema>) => {
		setIsLoading(true);
		if (!isLoaded || !user) return;

		try {
			const res = await createEmailAddress(values.email);
			await user.reload();

			const emailAddress = user.emailAddresses.find((a) => a.id === res?.id);

			setEmailObj(emailAddress);

			toast.success(`A verification code has been sent to ${values.email}`);
			emailAddress?.prepareVerification({ strategy: 'email_code' });

			setVerifying(true);
		} catch (error) {
			if (isClerkAPIResponseError(error)) {
				toast.error(error.message);
			}
		} finally {
			setIsLoading(false);
		}
	};

	async function onCodeSubmit(values: z.infer<typeof codeFormSchema>) {
		setIsLoading(true);

		if (!isLoaded) return;

		try {
			const emailVerifyAttempt = await emailObj?.attemptVerification({
				code: values.code,
			});

			if (emailVerifyAttempt?.verification?.status === 'verified') {
				toast.success('Email verified successfully');
				await user?.reload();

				updateUser({ email: emailObj?.emailAddress || '' });
				setIsLoading(false);
				setVerifying(false);

				form.reset();
				codeForm.reset();

				const formData = new FormData();
				formData.append('email', emailObj?.emailAddress || '');

				await fetch(`/api/users/${user?.id}`, {
					method: 'PATCH',
					body: formData,
				});
			} else if (emailVerifyAttempt?.verification?.status === 'expired') {
				toast.error('The verification code has expired. Please request a new one.');
			} else {
				toast.error('Invalid verification code. Please try again.');
			}
		} catch (error) {
			if (isClerkAPIResponseError(error)) {
				toast.error(error.message);
			}
		}
	}

	return (
		<div className='mt-4 max-w-sm'>
			<h2 className='text-2xl text-dark-grey font-bold mb-4'>
				Change Email Address
			</h2>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmitEmail)}
					className={cn(verifying && 'hidden')}>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>New Email Address</FormLabel>
								<FormControl>
									<Input {...field} placeholder='Enter your new email' />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button disabled={isLoading} className='mt-6'>
						{isLoading && <Spinner />}
						Submit
					</Button>
				</form>
			</Form>

			{/* otp */}

			<Form {...codeForm}>
				<form
					onSubmit={codeForm.handleSubmit(onCodeSubmit)}
					className={cn('mt-4 space-y-6', !verifying && 'hidden')}>
					<FormField
						control={codeForm.control}
						name='code'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Enter OTP</FormLabel>
								<FormControl>
									<InputOTP
										maxLength={6}
										value={field.value}
										onChange={field.onChange}
										onBlur={field.onBlur}
										name={field.name}
										className='w-full'>
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
					<div className='flex items-center gap-4'>
						<Button disabled={isLoading}>
							{isLoading && <Spinner />}
							Verify OTP
						</Button>
						<Button
							variant={'secondary'}
							disabled={isLoading}
							type='button'
							onClick={() => onSubmitEmail({ email: emailObj?.emailAddress || '' })}>
							{isLoading && <Spinner />}
							Resend OTP
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
