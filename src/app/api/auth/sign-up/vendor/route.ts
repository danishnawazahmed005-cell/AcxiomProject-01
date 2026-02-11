import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, businessName, category, address } =
      await request.json();

    // Validate input
    if (!name || !email || !password || !businessName || !category || !address) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user and vendor in a transaction
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'VENDOR',
        contactDetails: businessName,
        vendors: {
          create: {
            businessName,
            category,
            address,
          },
        },
      },
      include: {
        vendors: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Vendor account created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Vendor sign-up error:', error);
    return NextResponse.json(
      { message: 'An error occurred during vendor sign-up' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
