import User from '@/models/user.model';
import jwt from 'jsonwebtoken';
import   '@/lib/mongo';

export const Login = async (body: { username: string, password: string
}) => {
	const username = body.username
		.toLowerCase()
		.replace('+84', '0')
		.replace(/\s+/g, '');

	const user = await User.findOne({
		$or: [{ email: username }, { phone: username }],
	}).select('+password');

	if (!user) {
		throw new Error('Invalid credentials');
	}

	const isValid = await user.validPassword(body.password);
	if (!isValid) {
		throw new Error('Invalid credentials');
	}

	const token = jwt.sign(
		{
			userId: user._id,
			email: user.email,
			phone: user.phone,
		},
		process.env.JWT_SECRET!,
		{ expiresIn: '30d' }
	);

	return token;
};