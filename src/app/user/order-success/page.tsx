'use client';

import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="container-page min-h-screen flex items-center justify-center">
      <div className="card max-w-md text-center py-12 px-8">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order. You will receive confirmation emails for each vendor.
        </p>

        <div className="space-y-3">
          <Link href="/user/my-orders" className="w-full">
            <button className="btn-primary w-full">View My Orders</button>
          </Link>
          <Link href="/user/home" className="w-full">
            <button className="btn-secondary w-full">Back to Home</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
