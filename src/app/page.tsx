'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="container-page flex items-center justify-center min-h-screen">
      <div className="card w-full max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Event Management System
          </h1>
          <p className="text-gray-600 mb-8">
            Manage technical events with ease. Choose your role and get started.
          </p>

          <div className="space-y-4">
            <Link href="/login">
              <button className="btn-primary w-full">
                Login
              </button>
            </Link>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don&apos;t have an account?</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Link href="/sign-up/user">
                <button className="btn-secondary w-full">
                  User Sign Up
                </button>
              </Link>
              <Link href="/sign-up/vendor">
                <button className="btn-secondary w-full">
                  Vendor Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
