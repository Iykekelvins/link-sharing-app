import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import Link from '@/models/links';
import connectDB from '@/lib/db';

export async function DELETE(
	request: NextRequest,
	props: { params: Promise<{ id: string }> },
) {
	try {
		const { userId } = await auth();

		const params = await props.params;
		const id = params.id;

		if (!userId) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		await connectDB();

		const linkToDelete = await Link.findOneAndDelete({
			_id: id,
			userClerkId: userId,
		});

		if (!linkToDelete) {
			return NextResponse.json({ message: 'Link not found' }, { status: 404 });
		}

		return NextResponse.json(
			{ message: 'Link deleted successfully' },
			{ status: 200 },
		);
	} catch (error) {
		console.log('Error saving links:', error);

		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
