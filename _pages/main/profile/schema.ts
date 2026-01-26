import { z } from 'zod';

const userProfileSchema = z.object({
	firstName: z.string().min(1, "can't be empty"),
	lastName: z.string().min(1, "can't be empty"),
	username: z.string().min(1, "can't be empty"),
	profilePicture: z.union([
		z
			.instanceof(File)
			.refine((file) => file.size <= 5 * 1024 * 1024, {
				message: 'File size must be less than 5MB',
			})
			.refine(
				(file) =>
					['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type),
				{ message: 'Only .jpg, .png, .webp and .gif formats are supported' },
			),
		z.string(),
		z.literal(''),
	]),
});

export default userProfileSchema;
