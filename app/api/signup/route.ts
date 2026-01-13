import { NextResponse } from 'next/server';
import User from '@/models/user.model';
import '@/lib/mongo';
import { signupSchema } from '@/lib/schemas/signup.schema';

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { firstname, lastname, email, phone, password } = parsed.data;

    const errors: Record<string, string> = {};

    if (await User.findOne({ phone })) {
      errors.phone = 'Số điện thoại đã được đăng ký!';
    }

    if (await User.findOne({ email })) {
      errors.email = 'Email đã được đăng ký!';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { errors },
        { status: 409 }
      );
    }

    // ✅ TẠO USER ĐÚNG CÁCH (KHÔNG User.create)
    const user = new User({
      firstname,
      lastname,
      phone,
      email,
      roles: [], // hoặc role mặc định nếu bạn có
    });

    // ✅ HASH PASSWORD QUA METHOD
    await user.setPassword(password);

    // ✅ SAVE
    await user.save();

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('SIGNUP ERROR:', error);

    return NextResponse.json(
      { message: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}