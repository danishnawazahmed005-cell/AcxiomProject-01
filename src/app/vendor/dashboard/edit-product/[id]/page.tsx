'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    imageUrl: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (!resolvedParams?.id) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products?id=${resolvedParams.id}`);
        const products = await response.json();
        const foundProduct = Array.isArray(products) ? products[0] : products;

        if (foundProduct) {
          setProduct(foundProduct);
          setFormData({
            productName: foundProduct.name,
            price: foundProduct.price.toString(),
            imageUrl: foundProduct.imageUrl || '',
            description: foundProduct.description || '',
          });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams?.id]);

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
    setSubmitting(true);

    try {
      const response = await fetch(`/api/products/${resolvedParams?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to update product');
        setSubmitting(false);
        return;
      }

      setSuccess('Product updated successfully!');
      setTimeout(() => {
        router.push('/vendor/dashboard');
      }, 2000);
    } catch (err) {
      setError('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-page min-h-screen flex items-center justify-center">
        <div>Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page min-h-screen flex items-center justify-center">
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">Product not found</p>
          <Link href="/vendor/dashboard">
            <button className="btn-primary inline-block">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page min-h-screen">
      {/* Header */}
      <div className="bg-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <Link href="/vendor/dashboard">
              <button className="px-6 py-2 bg-white text-primary rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="card">
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
                className="input-field"
                required
                disabled={submitting}
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
                className="input-field"
                step="0.01"
                required
                disabled={submitting}
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
                className="input-field"
                disabled={submitting}
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
                className="input-field"
                rows={4}
                disabled={submitting}
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
