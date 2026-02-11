import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');
    const category = searchParams.get('category');

    let where: any = {};

    if (vendorId) {
      where.vendorId = parseInt(vendorId);
    }

    if (category) {
      where.vendor = {
        category: category,
      };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        vendor: {
          select: {
            id: true,
            businessName: true,
            category: true,
          },
        },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch products' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productName, price, imageUrl, description, vendorId } =
      await request.json();

    if (!productName || !price || !vendorId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: productName,
        price: parseFloat(price),
        imageUrl: imageUrl || null,
        description: description || null,
        vendorId: parseInt(vendorId),
      },
      include: {
        vendor: {
          select: {
            id: true,
            businessName: true,
            category: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Product created successfully',
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { message: 'Failed to create product' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
