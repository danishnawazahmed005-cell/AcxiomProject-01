'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MyOrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`/api/orders?userId=${user.id}`);
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchOrders();
    }
  }, [user?.id]);

  return (
    <div className="container-page min-h-screen">
      {/* Header */}
      <div className="bg-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">My Orders</h1>
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
        {loading ? (
          <div className="text-center py-10">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No orders yet</p>
            <Link href="/user/marketplace">
              <button className="btn-primary inline-block">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="card">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Order #{order.id}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
                    {order.status}
                  </span>
                </div>

                <div className="border-b pb-6 mb-6">
                  <p className="text-gray-600 mb-3">
                    <span className="font-semibold">Vendor:</span> {order.vendor.businessName}
                  </p>
                  <p className="text-gray-600 mb-3">
                    <span className="font-semibold">Payment Method:</span>{' '}
                    {order.paymentMethod}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Items ({order.orderItems.length})
                  </h4>
                  <div className="space-y-2">
                    {order.orderItems.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-gray-600"
                      >
                        <span>
                          {item.product.name} × {item.quantity}
                        </span>
                        <span>
                          ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
