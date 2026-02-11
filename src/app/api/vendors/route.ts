import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let where: any = {};

    if (category) {
      where.category = category;
    }

    const vendors = await prisma.vendor.findMany({
      where,
      include: {
        products: true,
      },
    });

    return NextResponse.json(vendors);
  } catch (error) {
    console.error('Get vendors error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch vendors' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
