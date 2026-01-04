import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helper';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { adminOnboardSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // Only admins can create new admins
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = adminOnboardSchema.parse(body);

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create new admin user
    const newAdmin = new User({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      role: 'admin',
    });

    await newAdmin.save();

    return NextResponse.json(
      { message: 'Admin created successfully', user: { id: newAdmin._id, email: newAdmin.email } },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    console.error('Error creating admin:', error);
    return NextResponse.json({ error: error.message || 'Failed to create admin' }, { status: 500 });
  }
}

