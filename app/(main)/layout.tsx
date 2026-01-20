import Mockup from '@/shared/mockup';
import Navbar from '@/shared/navbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Navbar />
			<main className='grow flex flex-col'>
				<div
					className='px-6 pb-6 grid des:grid-cols-[0.75fr_1fr] flex-1 gap-4
						pt-6 des:pt-0
						'>
					<Mockup />
					{children}
				</div>
			</main>
		</>
	);
}
