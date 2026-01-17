import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className='grow flex'>
			<div
				className='flex flex-col md:items-center 
				md:justify-center flex-1 p-8'>
				<Image src='/logo.png' width={182.5} height={40} alt='Devlinks logo' />

				<div className='md:bg-white max-w-119 w-full mt-12.5 rounded-xl'>
					{children}
				</div>
			</div>
		</main>
	);
}
