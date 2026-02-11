import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    const orderId = parseInt(id);

    if (!['PENDING', 'RECEIVED', 'READY_FOR_SHIPPING', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status' },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        orderItems: {
          include: { product: true },
        },
        user: {
          select: { id: true, email: true, name: true },
        },
        vendor: {
          select: { id: true, businessName: true },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Order status updated successfully',
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { message: 'Failed to update order' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: { product: true },
        },
        user: {
          select: { id: true, email: true, name: true },
        },
        vendor: {
          select: { id: true, businessName: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch order' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
