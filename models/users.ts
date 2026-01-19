import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		first_name: { type: String, required: false, default: '' },
		last_name: { type: String, required: false, default: '' },
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		username: {
			type: String,
			required: false,
			unique: true,
			sparse: true,
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
