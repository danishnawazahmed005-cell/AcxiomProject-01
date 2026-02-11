'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import OrderSuccessModal from '@/components/OrderSuccessModal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, getTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState({
    totalAmount: 0,
    shippingDetails: {
      name: '',
      address: '',
      city: '',
      state: '',
      paymentMethod: '',
    },
  });

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    paymentMethod: 'CASH',
  });

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!user?.id) {
        setError('User information not found');
        setLoading(false);
        return;
      }

      if (items.length === 0) {
        setError('Your cart is empty');
        setLoading(false);
        return;
      }

      // Group items by vendor and create separate orders
      const vendorGroups: Record<number, any[]> = {};
      items.forEach((item) => {
        if (!vendorGroups[item.vendorId]) {
          vendorGroups[item.vendorId] = [];
        }
        vendorGroups[item.vendorId].push({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });
      });

      // Create orders for each vendor
      const createdOrders = [];
      for (const [vendorId, orderItems] of Object.entries(vendorGroups)) {
        const vendorTotal = orderItems.reduce(
          (sum, item: any) => sum + item.price * item.quantity,
          0
        );

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            vendorId: parseInt(vendorId),
            orderItems,
            totalAmount: vendorTotal,
            paymentMethod: formData.paymentMethod,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.message || 'Failed to place order');
          setLoading(false);
          return;
        }

        const orderData = await response.json();
        createdOrders.push(orderData.order);
      }

      // Show success modal instead of redirecting
      const totalAmount = getTotal();
      setSuccessData({
        totalAmount,
        shippingDetails: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          paymentMethod: formData.paymentMethod,
        },
      });

      setShowSuccessModal(true);
      clearCart();
    } catch (err) {
      setError('An error occurred while placing the order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  if (!mounted || !user) return null;

  if (items.length === 0 && !showSuccessModal) {
    return (
      <div className="container-page min-h-screen flex items-center justify-center">
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <Link href="/user/marketplace">
            <button className="btn-primary inline-block">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page min-h-screen">
      <OrderSuccessModal
        isOpen={showSuccessModal}
        totalAmount={successData.totalAmount}
        shippingDetails={successData.shippingDetails}
        onClose={handleCloseModal}
      />

      {/* Header */}
      <div className="bg-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <Link href="/user/cart">
              <button className="px-6 py-2 bg-white text-primary rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Back to Cart
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="card">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Delivery Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter street address"
                      className="input-field"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="input-field"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                        className="input-field"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pin Code
                    </label>
                    <input
                      type="text"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleChange}
                      placeholder="Enter pin code"
                      className="input-field"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="card">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Payment Method
                </h2>

                <div className="space-y-3">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CASH"
                      checked={formData.paymentMethod === 'CASH'}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 font-medium text-gray-700">
                      Cash on Delivery
                    </span>
                  </label>

                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={formData.paymentMethod === 'UPI'}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 font-medium text-gray-700">
                      UPI Payment
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3 text-lg disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card sticky top-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6 border-b pb-4 max-h-96 overflow-y-auto">
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

              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">
                  ₹{getTotal().toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center mb-6 text-lg border-t pt-4">
                <span className="font-bold text-gray-800">Total:</span>
                <span className="text-2xl font-bold text-primary">
                  ₹{getTotal().toFixed(2)}
                </span>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                <p className="font-semibold mb-2">📦 Delivery Details</p>
                <p>We&apos;ll send separate invoices for each vendor&apos;s order.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
