'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentLogin() {
    const router = useRouter();
    const [rollNumber, setRollNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/student/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roll_number: rollNumber, password }),
            });
            const data = await res.json();
            if (data.success) {
                router.push('/student/dashboard');
            } else {
                setError(data.message || 'Login failed.');
            }
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 text-black">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow w-full max-w-md"
            >
                <h1 className="text-2xl font-bold mb-4">Student Login</h1>
                {error && <p className="text-red-600 mb-2">{error}</p>}

                <input
                    type="text"
                    placeholder="Roll Number"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
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

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
