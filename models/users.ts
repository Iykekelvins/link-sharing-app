import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		firstName: { type: String, default: '' },
		lastName: { type: String, default: '' },
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		username: {
			type: String,
			default: undefined,
		},
		image_url: { type: String, default: '' },
		clerkId: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.models.User || mongoose.model('User', userSchema);
