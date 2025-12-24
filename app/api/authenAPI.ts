// import { NextRequest, NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';
//
// export default async function AuthAPI(req: NextRequest) {
//   const token = req.cookies.get('accessToken')?.value;
//
//   if (!token) {
//     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//   }
//
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!);
//     if (!decoded) {
//       return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
//     }
//
//     // Token hợp lệ, tiếp tục xử lý
//     return NextResponse.next();
//   } catch (err: any) {
//     console.error(err);
//     return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
//   }
// }
