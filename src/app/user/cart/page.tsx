'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="container-page min-h-screen">
      {/* Header */}
      <div className="bg-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <Link href="/user/home">
              <button className="px-6 py-2 bg-white text-primary rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {items.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <Link href="/user/marketplace">
              <button className="btn-primary inline-block">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="card overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">
                        Product
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Quantity
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Total
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.productId} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-semibold text-gray-800">
                                {item.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">₹{item.price}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                              −
                            </button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity + 1)
                              }
                              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-red-600 hover:text-red-800 font-semibold"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <Link href="/user/marketplace">
                  <button className="btn-secondary">Continue Shopping</button>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="card sticky top-20">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 border-b pb-4">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-600">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-semibold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-6 text-lg">
                  <span className="font-bold text-gray-800">Grand Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{getTotal().toFixed(2)}
                  </span>
                </div>

                <Link href="/user/checkout" className="w-full">
                  <button className="btn-primary w-full">Proceed to Checkout</button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
