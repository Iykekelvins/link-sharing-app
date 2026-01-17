import * as React from 'react';

import { cn } from '@/lib/utils';
import { Eye, EyeClosed } from 'lucide-react';

function Input({
	className,
	type,
	icon,
	...props
}: React.ComponentProps<'input'> & { icon?: React.ReactNode }) {
	const [showPassword, setShowPassword] = React.useState(false);

	return (
		<div className={cn(icon && 'relative flex items-center')}>
			<span className='absolute left-4'>{icon && icon}</span>
			<input
				type={type === 'password' && showPassword ? 'text' : type}
				data-slot='input'
				className={cn(
					'file:text-foreground placeholder:opacity-50 selection:bg-purple border-borders',
					'h-12 w-full min-w-0 rounded-lg border bg-transparent py-1 px-4 text-base',
					'transition-[color,box-shadow] outline-none file:inline-flex file:h-7 duration-300',
					'focus-visible:border-purple focus-visible:shadow-[0px_0px_32px_0px_#633CFF40] text-dark-grey',
					'file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
					'aria-invalid:border-red',
					icon && 'pl-11',
					className,
				)}
				{...props}
			/>
			{type === 'password' && (
				<button
					type='button'
					className='absolute right-4'
					onClick={() => setShowPassword(!showPassword)}>
					{!showPassword ? (
						<Eye size={16} color='#737373' />
					) : (
						<EyeClosed size={16} color='#737373' />
					)}
				</button>
			)}
		</div>
	);
}

export { Input };
