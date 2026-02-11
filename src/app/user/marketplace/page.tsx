'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Marketplace() {
  const [categories] = useState<string[]>([
    'CATERING',
    'FLORIST',
    'DECORATION',
    'LIGHTING',
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const categoryLabels: Record<string, string> = {
    CATERING: '🍽️ Catering',
    FLORIST: '🌹 Florist',
    DECORATION: '🎨 Decoration',
    LIGHTING: '💡 Lighting',
  };

  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);
    setLoading(true);
    try {
      const res = await fetch(`/api/vendors?category=${category}`);
      const data = await res.json();
      setVendors(data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page min-h-screen">
      {/* Header */}
      <div className="bg-primary text-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Browse Vendors</h1>
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
        {!selectedCategory ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              Select a Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className="card hover:shadow-lg transition-shadow cursor-pointer text-center p-8"
                >
                  <p className="text-5xl mb-4">
                    {categoryLabels[category].split(' ')[0]}
                  </p>
                  <h3 className="text-xl font-bold text-gray-800">
                    {categoryLabels[category].split(' ').slice(1).join(' ')}
                  </h3>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-8">
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-primary font-semibold hover:underline mb-4"
              >
                ← Back to Categories
              </button>
              <h2 className="text-3xl font-bold text-gray-800">
                {categoryLabels[selectedCategory]}
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-10">Loading vendors...</div>
            ) : vendors.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-600">No vendors found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map((vendor) => (
                  <Link
                    key={vendor.id}
                    href={`/user/vendor/${vendor.id}/products`}
                  >
                    <div className="card hover:shadow-lg transition-shadow cursor-pointer">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {vendor.businessName}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {vendor.products?.length || 0} products available
                      </p>
                      <p className="text-primary font-semibold">
                        View Products →
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
