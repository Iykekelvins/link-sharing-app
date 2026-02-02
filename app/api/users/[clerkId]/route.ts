import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

import User from '@/models/users';
import connectDB from '@/lib/db';
import userProfileSchema from '@/_pages/main/profile/schema';
import cloudinary from '@/lib/cloudinary';

export async function PATCH(
	req: NextRequest,
	props: { params: Promise<{ clerkId: string }> },
) {
	try {
		const { userId } = await auth();
		const params = await props.params;
		const clerkId = params.clerkId;

		if (!userId) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		if (userId !== clerkId) {
			return NextResponse.json(
				{ message: 'Forbidden - You can only update your own profile.' },
				{ status: 403 },
			);
		}

		const formData = await req.formData();

		const firstName = formData.get('firstName') as string;
		const lastName = formData.get('lastName') as string;
		const username = formData.get('username') as string;
		const email = formData.get('email') as string;
		const profilePicture = formData.get('profilePicture') as File | null;

		// validate text fields
		const validatedData = userProfileSchema.omit({ profilePicture: true }).parse({
			firstName,
			lastName,
			username,
			email,
		});

		await connectDB();

		// check if username has already been taken
		const existingUsername = await User.findOne({
			username: validatedData.username,
			clerkId: { $ne: clerkId },
		});

		if (existingUsername) {
			return NextResponse.json(
				{
					message: 'Username already taken',
				},
				{
					status: 409,
				},
			);
		}

		// get current user
		const user = await User.findOne({ clerkId });
		if (!user) {
			return NextResponse.json(
				{
					message: 'User not found',
				},
				{ status: 404 },
			);
		}

		let profilePictureUrl = user.profilePicture;

		if (profilePicture && profilePicture.size > 0) {
			const validTypes = [
				'image/jpeg',
				'image/jpg',
				'image/png',
				'image/webp',
				'image/gif',
			];

			if (!validTypes.includes(profilePicture.type)) {
				return NextResponse.json(
					{ error: 'Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed' },
					{ status: 400 },
				);
			}

			if (profilePicture.size > 5 * 1024 * 1024) {
				return NextResponse.json(
					{ error: 'File size must be less than 5MB' },
					{ status: 400 },
				);
			}

			try {
				// convert file to base 64
				const bytes = await profilePicture.arrayBuffer();
				const buffer = Buffer.from(bytes);
				const base64Image = `data:${profilePicture.type};base64,${buffer.toString('base64')}`;

				const uploadResult = await cloudinary.uploader.upload(base64Image, {
					folder: 'devlinks-profile-pictures',
					public_id: `user-${clerkId}-${Date.now()}`,
					transformation: [
						{ width: 400, height: 400, crop: 'fill', gravity: 'face' },
						{ quality: 'auto:good' },
						{ fetch_format: 'auto' },
					],
					overwrite: true,
				});

				profilePictureUrl = uploadResult.secure_url;

				// Delete old image from Cloudinary if it exists and is a Cloudinary URL
				if (user.profilePicture?.includes('cloudinary.com')) {
					try {
						const publicId = user.profilePicture
							.split('/')
							.slice(-2)
							.join('/')
							.split('.')[0];
						await cloudinary.uploader.destroy(publicId);
					} catch (deleteError) {
						console.error('Error deleting old image:', deleteError);
					}
				}
			} catch (uploadError) {
				console.error('Cloudinary upload error:', uploadError);
				return NextResponse.json(
					{ error: 'Failed to upload image' },
					{ status: 500 },
				);
			}
		}

		const updatedUser = await User.findOneAndUpdate(
			{
				clerkId,
			},
			{
				firstName: validatedData.firstName,
				lastName: validatedData.lastName,
				username: validatedData.username,
				email: validatedData.email,
				image_url: profilePictureUrl,
				updatedAt: new Date(),
			},
			{ new: true },
		);

		const client = await clerkClient();
		await client.users.updateUser(clerkId, {
			firstName: validatedData.firstName,
			lastName: validatedData.lastName,
			username: validatedData.username,
		});

		return NextResponse.json(
			{
				message: 'Profile updated successfully',
				user: {
					clerkId: updatedUser.clerkId,
					email: updatedUser.email,
					username: updatedUser.username,
					firstName: updatedUser.firstName,
					lastName: updatedUser.lastName,
					image_url: updatedUser.image_url,
					updatedAt: updatedUser.updatedAt,
				},
			},
			{ status: 200 },
		);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		console.log(error);

		if (error.name === 'ZodError') {
			return NextResponse.json(
				{
					error: 'Invalid data provided',
					details: error.errors,
				},
				{ status: 400 },
			);
		}

		if (error.clerkError) {
			return NextResponse.json(
				{ error: 'Failed to update Clerk user data' },
				{ status: 500 },
			);
		}

		return NextResponse.json(
			{
				message: 'Something went wrong, please try again later',
			},
			{ status: 500 },
		);
	}
}

export async function GET(
	req: NextRequest,
	props: { params: Promise<{ clerkId: string }> },
) {
	try {
		const { userId } = await auth();

		const params = await props.params;
		const clerkId = params.clerkId;

		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		await connectDB();

		const user = await User.findOne({ clerkId });

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		return NextResponse.json(
			{
				user: {
					clerkId: user.clerkId,
					email: user.email,
					username: user.username,
					firstName: user.firstName,
					lastName: user.lastName,
					image_url: user.image_url,
					createdAt: user.createdAt,
					updatedAt: user.updatedAt,
				},
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error fetching user:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
