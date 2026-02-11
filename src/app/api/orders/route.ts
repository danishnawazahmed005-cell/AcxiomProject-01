import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId, vendorId, orderItems, totalAmount, paymentMethod } =
      await request.json();

    if (!userId || !vendorId || !orderItems || !totalAmount) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create order with order items
    const order = await prisma.order.create({
      data: {
        userId,
        vendorId,
        totalAmount: parseFloat(totalAmount),
        paymentMethod: paymentMethod || 'CASH',
        status: 'PENDING',
        orderItems: {
          create: orderItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.price,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        vendor: {
          select: {
            id: true,
            businessName: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Order created successfully',
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { message: 'Failed to create order' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const vendorId = searchParams.get('vendorId');

    let where: any = {};

    if (userId) {
      where.userId = parseInt(userId);
    }

    if (vendorId) {
      where.vendorId = parseInt(vendorId);
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        vendor: {
          select: {
            id: true,
            businessName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch orders' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
