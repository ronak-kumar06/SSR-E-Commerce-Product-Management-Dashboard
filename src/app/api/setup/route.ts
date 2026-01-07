import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    const email = "admin@example.com";
    const password = "demo@123";

    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await User.findOne({ email });

    if (existing) {
      existing.password = hashedPassword;
      await existing.save();
      return NextResponse.json({
        message: "Admin password reset successfully",
        email,
        password,
      });
    }

    await User.create({
      name: "Admin User",
      email,
      password: hashedPassword,
      role: "admin",
    });

    return NextResponse.json({
      message: "Admin created successfully",
      email,
      password,
    });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Admin setup failed" },
//       { status: 500 }
//     );
//   }
} catch (error: any) {
  console.error("ADMIN SETUP ERROR:", error);

  return NextResponse.json(
    {
      error: "Admin setup failed",
      details: error?.message || error,
    },
    { status: 500 }
  );
}
}
