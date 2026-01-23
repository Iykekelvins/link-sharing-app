'use client';

import { UseFormReturn } from 'react-hook-form';

import userProfileSchema from './schema';
import z from 'zod';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type FormData = z.infer<typeof userProfileSchema>;

export default function Inputs({ form }: { form: UseFormReturn<FormData> }) {
	return (
		<div className='bg-light-grey mt-10 rounded-xl p-5 space-y-3'>
			<FormField
				control={form.control}
				name='first_name'
				render={({ field }) => (
					<FormItem className='grid items-center md:grid-cols-[0.5fr_1fr]'>
						<FormLabel className='text-base text-grey'>First name*</FormLabel>
						<div>
							<FormControl>
								<Input {...field} placeholder='e.g. John' />
							</FormControl>
							<FormMessage />
						</div>
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name='last_name'
				render={({ field }) => (
					<FormItem className='grid items-center md:grid-cols-[0.5fr_1fr]'>
						<FormLabel className='text-base text-grey'>Last name*</FormLabel>
						<div>
							<FormControl>
								<Input {...field} placeholder='e.g. Doe' />
							</FormControl>
							<FormMessage />
						</div>
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name='email'
				render={({ field }) => (
					<FormItem className='grid items-center md:grid-cols-[0.5fr_1fr]'>
						<FormLabel className='text-base text-grey'>Email</FormLabel>
						<div>
							<FormControl>
								<Input {...field} placeholder='e.g. email@example.com' />
							</FormControl>
							<FormMessage />
						</div>
					</FormItem>
				)}
			/>
		</div>
	);
}
