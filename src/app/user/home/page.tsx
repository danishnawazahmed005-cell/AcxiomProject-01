'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';

export default function UserHome() {
  const { user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (mounted) {
      setCartCount(getItemCount());
    }
  }, [mounted, getItemCount]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('authToken');
    router.push('/');
  };

  if (!mounted) return null;

  return (
    <div className="container-page min-h-screen">
      {/* Header */}
      <div className="bg-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Event Marketplace</h1>
            <button
              onClick={handleLogout}
              className="bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 flex-wrap mt-6">
            <Link href="/user/marketplace">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Browse Vendors
              </button>
            </Link>
            <Link href="/user/cart">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Cart ({cartCount})
              </button>
            </Link>
            <Link href="/user/my-orders">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Order Status
              </button>
            </Link>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Guest List
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <p className="text-lg text-gray-700">
            Welcome, <span className="font-semibold">{user?.name}</span>!
          </p>
          <p className="text-gray-600 mt-2">
            Browse through vendors and find the perfect items for your event.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/user/marketplace">
            <div className="card cursor-pointer hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                🎉 Browse Vendors
              </h3>
              <p className="text-gray-600 mb-4">
                Explore vendors by category and find products
              </p>
              <p className="text-primary font-semibold">Get Started →</p>
            </div>
          </Link>

          <Link href="/user/cart">
            <div className="card cursor-pointer hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                🛒 Shopping Cart
              </h3>
              <p className="text-gray-600 mb-4">
                View items in your cart and checkout
              </p>
              <p className="text-primary font-semibold">
                {cartCount} item{cartCount !== 1 ? 's' : ''} in cart →
              </p>
            </div>
          </Link>

          <Link href="/user/my-orders">
            <div className="card cursor-pointer hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                📋 Order Status
              </h3>
              <p className="text-gray-600 mb-4">
                Track your orders and their status
              </p>
              <p className="text-primary font-semibold">Check Status →</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
