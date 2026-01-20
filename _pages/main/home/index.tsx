import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import EmptyState from './empty-state';

const Home = () => {
	return (
		<div className='bg-white rounded-xl flex flex-col'>
			<div className='p-6 des:p-10 flex-1 flex flex-col'>
				<h1 className='text-dark-grey text-2xl md:text-[2rem] font-bold leading-normal'>
					Customize your links
				</h1>
				<p className='text-grey text-base leading-normal mt-2'>
					Add/edit/remove links below and then share all your profiles with the
					world!
				</p>

				<Button variant={'secondary'} className='mt-10 w-full'>
					+ Add new link
				</Button>

				{/* empty state - no links added */}
				<EmptyState />
			</div>

			<div
				className={cn(
					'border-t border-t-borders border-solid',
					'flex justify-end py-6 px-6 md:px-0',
				)}>
				<Button className='w-full md:w-max min-w-22.5 md:mr-10'>Save</Button>
			</div>
		</div>
	);
};

export default Home;
