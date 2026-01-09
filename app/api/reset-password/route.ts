import { NextResponse } from 'next/server';
import crypto from 'crypto';
import User from '@/models/user.model';
import '@/lib/mongo';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { message: 'Thiếu dữ liệu' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

    // 1️⃣ Hash token để so sánh với DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // 2️⃣ Tìm user với token + chưa hết hạn
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+password');

    if (!user) {
      return NextResponse.json(
        { message: 'Token không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      );
    }

    // 3️⃣ ✅ SET PASSWORD ĐÚNG CÁCH (HASH QUA METHOD)
    await user.setPassword(password);

    // 4️⃣ Clear token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // 5️⃣ Save
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Đổi mật khẩu thành công',
    });
  } catch (error: any) {
    console.error('RESET PASSWORD ERROR:', error);

    return NextResponse.json(
      {
        message:
          error?.message ||
          'Internal Server Error',
      },
      { status: 500 }
    );
  }
}