import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema(
	{
		id: { type: String, required: true, unique: true },
		platform: { type: String, required: true },
		url: { type: String, required: true },
		userClerkId: { type: String, required: true },
	},
	{ timestamps: true },
);

export default mongoose.models.Link || mongoose.model('Link', linkSchema);
