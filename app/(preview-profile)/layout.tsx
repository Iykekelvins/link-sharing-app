import PreviewNavbar from '@/shared/preview-navbar';

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<PreviewNavbar />
			<main className='grow flex flex-col'>{children}</main>
		</>
	);
}
