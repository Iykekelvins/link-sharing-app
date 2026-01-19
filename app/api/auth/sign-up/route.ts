import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/lib/db';
import User from '@/models/users';

export async function POST(req: NextRequest) {
	try {
		await connectDB();

		const { email, image_url, clerkId } = await req.json();

		if (!email || !clerkId) {
			return NextResponse.json(
				{ message: 'Email and clerkId are required' },
				{ status: 400 },
			);
		}

		// Check if user already exists
		const existingUser = await User.findOne({ clerkId });

		if (existingUser) {
			return NextResponse.json(
				{ message: 'User already exists', user: existingUser },
				{ status: 400 },
			);
		}

		// Create new user
		const newUser = await User.create({
			first_name: '',
			last_name: '',
			username: null,
			email,
			image_url: image_url || '',
			clerkId,
		});

		return NextResponse.json(
			{ message: 'User created successfully', user: newUser },
			{ status: 201 },
		);
	} catch (error) {
		console.log(error);

		return NextResponse.json(
			{
				message: 'Something went wrong, please try again later',
			},
			{ status: 500 },
		);
	}
}
