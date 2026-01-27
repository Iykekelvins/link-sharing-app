import { Metadata } from 'next';

import User from '@/models/users';
import Link from '@/models/links';
import connectDB from '@/lib/db';
import Preview from '@/_pages/preview';

type Props = {
	params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const username = (await params).username;

	await connectDB();

	const user = await User.findOne({ username }).lean();

	return {
		title: `${user.firstName} ${user.lastName}`,
		description: `${user.firstName} ${user.lastName}'s profile page on Devlinkz.`,
		openGraph: {
			title: `${user.firstName} ${user.lastName}`,
			description: `${user.firstName} ${user.lastName}'s profile page on Devlinkz.`,
			images: user.image_url ? [user.image_url] : undefined,
		},
	};
}

const Profilepage = async ({
	params,
}: {
	params: Promise<{ username: string }>;
}) => {
	const { username } = await params;

	await connectDB();

	const user = await User.findOne({ username }).lean();
	const userLinks = await Link.find({ userClerkId: user?.clerkId }).lean();

	const serializedProfile = JSON.parse(JSON.stringify(user));
	const serializedLinks = JSON.parse(JSON.stringify(userLinks));

	return <Preview user={serializedProfile} links={serializedLinks} />;
};

export default Profilepage;
