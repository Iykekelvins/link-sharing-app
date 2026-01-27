import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import connectDB from '@/lib/db';

import Link from '@/models/links';

export async function POST(request: NextRequest) {
	try {
		const { userId } = await auth();

		if (!userId) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const { links } = await request.json();

		if (!links || !Array.isArray(links) || links.length === 0) {
			return NextResponse.json({ message: 'No links provided' }, { status: 400 });
		}

		await connectDB();

		await Link.deleteMany({ userClerkId: userId });

		const linkDocuments = links.map((link, index) => ({
			...link,
			userClerkId: userId,
			order: index,
		}));

		const savedLinks = await Link.insertMany(linkDocuments);

		return NextResponse.json(
			{ message: 'Links saved successfully', links: savedLinks },
			{ status: 201 },
		);
	} catch (error) {
		console.log('Error saving links:', error);

		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
