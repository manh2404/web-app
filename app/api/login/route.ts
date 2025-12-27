import { NextResponse } from 'next/server';
import { Login } from '@/lib/services/auth.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = await Login(body);

    const res = NextResponse.json({ success: true });

    res.cookies.set({
      name: 'accessToken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Login failed' },
      { status: 401 }
    );
  }
}
