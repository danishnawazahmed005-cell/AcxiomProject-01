'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type TabType = 'items' | 'add-item' | 'transactions';

export default function VendorDashboard() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('items');

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Welcome {user?.name}!</h1>
            <button
              onClick={handleLogout}
              className="bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setActiveTab('items')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'items'
                  ? 'bg-white text-primary'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Your Items
            </button>
            <button
              onClick={() => setActiveTab('add-item')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'add-item'
                  ? 'bg-white text-primary'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Add New Item
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'transactions'
                  ? 'bg-white text-primary'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Transaction
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'items' && <YourItemsTab />}
        {activeTab === 'add-item' && <AddNewItemTab />}
        {activeTab === 'transactions' && <TransactionsTab />}
      </div>
    </div>
  );
}

function YourItemsTab() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // First, get vendor info
        const vendorsRes = await fetch(`/api/vendors`);
        const vendors = await vendorsRes.json();
        const myVendor = vendors.find(
          (v: any) => v.userId === user?.id
        );

        if (myVendor) {
          const productsRes = await fetch(
            `/api/products?vendorId=${myVendor.id}`
          );
          const productsData = await productsRes.json();
          setProducts(productsData);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchProducts();
    }
  }, [user?.id]);

  const handleDelete = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      setProducts(products.filter((p) => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 mb-4">No products added yet.</p>
        <p className="text-gray-500">Click &quot;Add New Item&quot; to add your first product.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="card">
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {product.name}
          </h3>
          <p className="text-gray-600 mb-2">{product.description}</p>
          <p className="text-2xl font-bold text-primary mb-4">
            ₹{product.price}
          </p>
          <div className="flex gap-3">
            <Link
              href={`/vendor/dashboard/edit-product/${product.id}`}
              className="flex-1"
            >
              <button className="btn-primary w-full">Update</button>
            </Link>
            <button
              onClick={() => handleDelete(product.id)}
              className="flex-1 btn-secondary"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AddNewItemTab() {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    imageUrl: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Get vendor ID
      const vendorsRes = await fetch(`/api/vendors`);
      const vendors = await vendorsRes.json();
      const myVendor = vendors.find(
        (v: any) => v.userId === user?.id
      );

      if (!myVendor) {
        setError('Vendor information not found');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          vendorId: myVendor.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to add product');
        setLoading(false);
        return;
      }

      setSuccess('Product added successfully!');
      setFormData({
        productName: '',
        price: '',
        imageUrl: '',
        description: '',
      });

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Item</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name
          </label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Enter product name"
            className="input-field"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            className="input-field"
            step="0.01"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image URL
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="input-field"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            className="input-field"
            rows={4}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}

function TransactionsTab() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [statusMap, setStatusMap] = useState<Record<number, string>>({});
  const [error, setError] = useState('');

  const statusOptions = [
    'PENDING',
    'RECEIVED',
    'READY_FOR_SHIPPING',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Get vendor ID first
        const vendorsRes = await fetch(`/api/vendors`);
        const vendors = await vendorsRes.json();
        const myVendor = vendors.find(
          (v: any) => v.userId === user?.id
        );

        if (myVendor) {
          const ordersRes = await fetch(
            `/api/orders?vendorId=${myVendor.id}`
          );
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
          
          // Initialize status map with current statuses
          const initialStatusMap: Record<number, string> = {};
          ordersData.forEach((order: any) => {
            initialStatusMap[order.id] = order.status;
          });
          setStatusMap(initialStatusMap);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchOrders();
    }
  }, [user?.id]);

  const handleStatusChange = (orderId: number, newStatus: string) => {
    setStatusMap((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));
  };

  const handleUpdateStatus = async (orderId: number) => {
    setUpdating(orderId);
    setError('');

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusMap[orderId] }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to update status');
        setUpdating(null);
        return;
      }

      // Update orders list
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? { ...order, status: statusMap[orderId] }
            : order
        )
      );

      setUpdating(null);
    } catch (err) {
      console.error('Error updating status:', err);
      setError('An error occurred while updating status');
      setUpdating(null);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {orders.map((order) => (
        <div key={order.id} className="card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Order #{order.id}
              </h3>
              <p className="text-gray-600 text-sm">
                Customer: {order.user.name} ({order.user.email})
              </p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              ₹{order.totalAmount}
            </span>
          </div>

          <div className="border-b pb-4 mb-4">
            <p className="text-gray-700">
              <span className="font-semibold">Items:</span> {order.orderItems.length} item(s)
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="font-semibold text-gray-800 mb-3">Update Order Status</p>
            <div className="space-y-2 mb-4">
              {statusOptions.map((status) => (
                <label key={status} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name={`status-${order.id}`}
                    value={status}
                    checked={statusMap[order.id] === status}
                    onChange={() => handleStatusChange(order.id, status)}
                    disabled={updating === order.id}
                    className="w-4 h-4"
                  />
                  <span className="ml-3 text-gray-700">
                    {status
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={() => handleUpdateStatus(order.id)}
              disabled={updating === order.id || statusMap[order.id] === order.status}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating === order.id ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
