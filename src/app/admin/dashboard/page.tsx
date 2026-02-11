'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type TabType = 'users' | 'vendors';

export default function AdminDashboard() {
  const { logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [usersRes, vendorsRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/vendors'),
        ]);

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        } else {
          setError('Failed to fetch users');
        }

        if (vendorsRes.ok) {
          const vendorsData = await vendorsRes.json();
          setVendors(vendorsData);
        } else {
          setError('Failed to fetch vendors');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      fetchData();
    }
  }, [mounted]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('authToken');
    router.push('/');
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter((u) => u.id !== userId));
      } else {
        setError('Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('An error occurred while deleting user');
    }
  };

  const handleDeleteVendor = async (vendorId: number) => {
    if (!confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/vendors?id=${vendorId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setVendors(vendors.filter((v) => v.id !== vendorId));
      } else {
        setError('Failed to delete vendor');
      }
    } catch (err) {
      console.error('Error deleting vendor:', err);
      setError('An error occurred while deleting vendor');
    }
  };

  if (!mounted) return null;

  return (
    <div className="container-page min-h-screen">
      {/* Header */}
      <div className="bg-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'users'
                  ? 'bg-white text-primary'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Maintain Users
            </button>
            <button
              onClick={() => setActiveTab('vendors')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'vendors'
                  ? 'bg-white text-primary'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Maintain Vendors
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Users</h3>
            <p className="text-4xl font-bold text-primary">{users.length}</p>
          </div>
          <div className="card">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Vendors</h3>
            <p className="text-4xl font-bold text-primary">{vendors.length}</p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">All Users</h2>
            {loading ? (
              <div className="text-center py-10">Loading...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-10 text-gray-600">No users found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Role</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Created</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-800">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">#{u.id}</td>
                        <td className="py-3 px-4 font-medium text-gray-800">{u.name}</td>
                        <td className="py-3 px-4 text-gray-600">{u.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              u.role === 'ADMIN'
                                ? 'bg-red-100 text-red-800'
                                : u.role === 'VENDOR'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Vendors Tab */}
        {activeTab === 'vendors' && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">All Vendors</h2>
            {loading ? (
              <div className="text-center py-10">Loading...</div>
            ) : vendors.length === 0 ? (
              <div className="text-center py-10 text-gray-600">No vendors found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Business Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Owner Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Address</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">Products</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-800">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.map((v) => (
                      <tr key={v.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">#{v.id}</td>
                        <td className="py-3 px-4 font-medium text-gray-800">{v.businessName}</td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                            {v.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{v.user.email}</td>
                        <td className="py-3 px-4 text-gray-600 text-sm">{v.address}</td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-800">
                            {v.products?.length || 0} item(s)
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteVendor(v.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/">
            <button className="btn-secondary px-8 py-3">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
