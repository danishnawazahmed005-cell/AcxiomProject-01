import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(_request: NextRequest) {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        products: true,
      },
      orderBy: {
        createdAt: 'desc',
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('id');

    if (!vendorId) {
      return NextResponse.json(
        { message: 'Vendor ID is required' },
        { status: 400 }
      );
    }

    await prisma.vendor.delete({
      where: { id: parseInt(vendorId) },
    });

    return NextResponse.json(
      { message: 'Vendor deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete vendor error:', error);
    return NextResponse.json(
      { message: 'Failed to delete vendor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
