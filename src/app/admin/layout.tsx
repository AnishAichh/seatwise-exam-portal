'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const hideSidebar = pathname === '/admin/login';

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/'); // Redirect to home page
    };

    return (
        <div className="min-h-screen flex">
            {!hideSidebar && (
                <aside className="w-64 bg-gray-900 text-white p-6">
                    <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
                    <nav className="space-y-4">
                        <Link href="/admin/dashboard" className="block hover:text-blue-400">Dashboard</Link>
                        <Link href="/admin/view-seatplan" className="block hover:text-blue-400">View Seat Plan</Link>
                        <Link href="/admin/generate-seatplan" className="block hover:text-blue-400">Generate Seat Plan</Link>
                        <Link href="/admin/other" className="block hover:text-blue-400">Other Features</Link>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left hover:text-red-400 mt-4"
                        >
                            Logout
                        </button>
                    </nav>
                </aside>
            )}

            <main className="flex-1 bg-gray-100 p-8">
                {children}
            </main>
        </div>
    );
}
