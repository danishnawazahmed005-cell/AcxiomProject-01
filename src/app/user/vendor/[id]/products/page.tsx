'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';

export default function VendorProducts({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [vendor, setVendor] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();
  const [animatingProductId, setAnimatingProductId] = useState<number | null>(null);
  const [addedProductId, setAddedProductId] = useState<number | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (!resolvedParams?.id) return;

    const fetchData = async () => {
      try {
        // Fetch vendor details
        const vendorsRes = await fetch(`/api/vendors`);
        const vendors = await vendorsRes.json();
        const foundVendor = vendors.find(
          (v: any) => v.id === parseInt(resolvedParams.id)
        );
        setVendor(foundVendor);

        // Fetch products for this vendor
        const productsRes = await fetch(
          `/api/products?vendorId=${resolvedParams.id}`
        );
        const productsData = await productsRes.json();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams?.id]);

  const handleAddToCart = (product: any) => {
    addItem({
      productId: product.id,
      vendorId: product.vendorId,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });

    // Simple button animation + inline message when item is added
    setAnimatingProductId(product.id);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAnimatingProductId((current) =>
        current === product.id ? null : current
      );
      setAddedProductId((current) =>
        current === product.id ? null : current
      );
    }, 800);
  };

  if (loading) {
    return (
      <div className="container-page min-h-screen flex items-center justify-center">
        <div>Loading vendor products...</div>
      </div>
    );
  }

  return (
    <div className="container-page min-h-screen">
      {/* Header */}
      <div className="bg-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/user/marketplace">
                <button className="text-white hover:underline mb-2">
                  ← Back to Vendors
                </button>
              </Link>
              <h1 className="text-3xl font-bold">
                {vendor?.businessName}
              </h1>
            </div>
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
        {products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600">No products available from this vendor.</p>
          </div>
        ) : (
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
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-gray-600 text-sm mb-3">
                    {product.description.substring(0, 100)}
                    {product.description.length > 100 ? '...' : ''}
                  </p>
                )}
                <div className="flex justify-between items-center mb-4">
                  <p className="text-2xl font-bold text-primary">
                    ₹{product.price}
                  </p>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`btn-primary w-full transition-transform duration-150 ${
                      animatingProductId === product.id ? 'scale-95' : ''
                    }`}
                  >
                    Add to Cart
                  </button>
                  {addedProductId === product.id && (
                    <p className="text-sm text-green-600 text-center">
                      Added to the cart
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
