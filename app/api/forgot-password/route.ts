import { NextResponse } from 'next/server';
import crypto from 'crypto';
import User from '@/models/user.model';
import '@/lib/mongo';
import { sendResetEmail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { message: 'Email là bắt buộc' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    // 🔐 Không tiết lộ email tồn tại hay không
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // 1️⃣ Tạo token gốc
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 2️⃣ Hash token để lưu DB (AN TOÀN)
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // 3️⃣ Lưu vào DB
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 phút
    await user.save();

    // 4️⃣ Link reset (GỬI TOKEN GỐC)
    const resetUrl =
      `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    await sendResetEmail(user.email, resetUrl);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('FORGOT PASSWORD ERROR:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}