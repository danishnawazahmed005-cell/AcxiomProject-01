import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { productName, price, imageUrl, description } = await request.json();

    const productId = parseInt(id);

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: productName || existingProduct.name,
        price: price ? parseFloat(price) : existingProduct.price,
        imageUrl: imageUrl !== undefined ? imageUrl : existingProduct.imageUrl,
        description: description !== undefined ? description : existingProduct.description,
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
        message: 'Product updated successfully',
        product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { message: 'Failed to update product' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { message: 'Failed to delete product' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
