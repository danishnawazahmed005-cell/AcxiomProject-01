'use client';

import Link from 'next/link';

interface OrderSuccessModalProps {
  isOpen: boolean;
  totalAmount: number;
  shippingDetails: {
    name: string;
    address: string;
    city: string;
    state: string;
    paymentMethod: string;
  };
  onClose: () => void;
}

export default function OrderSuccessModal({
  isOpen,
  totalAmount,
  shippingDetails,
  onClose,
}: OrderSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md mx-4">
        {/* Thank You Message */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">THANK YOU!</h2>
          <p className="text-gray-600">Your order has been placed successfully</p>
        </div>

        {/* Total Amount */}
        <div className="bg-primary text-white rounded-lg p-6 mb-6 text-center">
          <p className="text-gray-200 mb-2">TOTAL AMOUNT</p>
          <p className="text-4xl font-bold">₹{totalAmount.toFixed(2)}</p>
        </div>

        {/* Shipping Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">Shipping Details</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-semibold text-gray-800">{shippingDetails.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Address</p>
              <p className="font-semibold text-gray-800">
                {shippingDetails.address}, {shippingDetails.city}, {shippingDetails.state}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Payment Method</p>
              <p className="font-semibold text-gray-800">
                {shippingDetails.paymentMethod === 'CASH'
                  ? 'Cash on Delivery'
                  : 'UPI Payment'}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Link href="/user/marketplace" className="w-full">
            <button
              onClick={onClose}
              className="btn-primary w-full py-3 text-lg"
            >
              Continue Shopping
            </button>
          </Link>
          <Link href="/user/my-orders" className="w-full">
            <button className="btn-secondary w-full py-3">
              View Orders
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
