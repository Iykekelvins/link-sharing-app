import Navbar from '@/shared/navbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Navbar />
			<main>{children}</main>
		</>
	);
}
