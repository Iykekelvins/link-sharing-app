import { auth } from '@clerk/nextjs/server';

import Link from '@/models/links';
import MockupChildren from './mockup-children';
import connectDB from '@/lib/db';

export default async function Mockup() {
	const { userId } = await auth();

	await connectDB();

	const links = await Link.find({ userClerkId: userId }).lean();
	const serializedLinks = JSON.parse(JSON.stringify(links));

	return (
		<div className='bg-white p-6 rounded-xl hidden des:flex items-center justify-center'>
			<MockupChildren links={serializedLinks} />
		</div>
	);
}
