import { z } from 'zod';

const userProfileSchema = z.object({
	first_name: z.string().min(1, "can't be empty"),
	last_name: z.string().min(1, "can't be empty"),
	username: z.string().min(1, "can't be empty"),
	email: z.email(),
	profilePicture: z
		.instanceof(File, { message: 'Profile picture is required' })
		.refine((file) => file.size <= 5 * 1024 * 1024, {
			message: 'File size must be less than 5MB',
		})
		.refine(
			(file) =>
				['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type),
			{ message: 'Only .jpg, .png, .webp and .gif formats are supported' },
		),
});

export default userProfileSchema;
