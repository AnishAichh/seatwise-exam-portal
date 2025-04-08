// app/admin/login/page.tsx
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (data.success) {
            router.push('/admin/dashboard');
        } else {
            setError(data.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md text-black">
            <h1 className="text-2xl font-bold mb-4">Admin Login</h1>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border p-2 mb-3 rounded"
                required
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-2 mb-3 rounded"
                required
            />

            {error && <p className="text-red-600 mb-2">{error}</p>}

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
                Login
            </button>
        </form>
    );
}
