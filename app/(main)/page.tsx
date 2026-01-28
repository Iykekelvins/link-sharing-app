import { currentUser } from '@clerk/nextjs/server';

import Home from '@/_pages/main/home';
import User from '@/models/users';
import connectDB from '@/lib/db';

export default async function Homepage() {
	const user = await currentUser();

	await connectDB();

	let dbUser = await User.findOne({ clerkId: user?.id }).lean();

	if (!dbUser) {
		const newUser = await User.create({
			firstName: user?.firstName || '',
			lastName: user?.lastName || '',
			email: user?.emailAddresses[0]?.emailAddress || '',
			image_url: user?.imageUrl || '',
			clerkId: user?.id || '',
		});

		dbUser = newUser.toObject();
	}

	const serializedProfile = JSON.parse(JSON.stringify(dbUser));

	return <Home user={serializedProfile} />;
}
