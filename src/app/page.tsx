// app/page.tsx
'use client';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-black">
      <h1 className="text-4xl font-bold mb-8">Welcome to Our Seat Plan App</h1>
      <div className="space-y-4 space-x-4">
        <Link
          href="/admin/login"
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Admin Login
        </Link>
        <Link
          href="/student/login"
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Student Login
        </Link>
        <Link
          href="/student/register"
          className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Student Register
        </Link>
      </div>
    </div>
  );
}
