import User, {IUser} from '@/models/user.model';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongo';

export const Login = async (body: { username: string, password: string }) => {
	await dbConnect();

	let user: IUser | undefined
	try {
		const userName = body.username.toLowerCase()
			.replace("+84", "0")
			.replace(/[^\w\s.{@,1}]/g, '')
			.replace(/\s+/g, '')
		console.log(userName, "username")
		const rs: IUser | null = await User.findOne({$or: [{phone: userName}, {email: userName}]});
		console.log(rs, "rs")
		if (rs) {
			const isValid = await rs.validPassword(body.password)
			console.log(isValid, "isValid")
			if (isValid) {
				user = rs.toObject()
			}
		}
	} catch (error) {
		console.error('Error fetching user:', error);
		throw new Error('Failed to fetch user');
	}
	if (!user) {
		throw new Error('Invalid credentials');
	}

	const JWT_SECRET = process.env.JWT_SECRET!;
	return jwt.sign({...user, password: undefined}, JWT_SECRET, {
		expiresIn: '30d',
	});
};