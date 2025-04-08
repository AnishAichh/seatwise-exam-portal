'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentRegister() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        roll_number: '',
        department: '',
        year: 1,
        password: '',
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/student/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                setMessage('Registration successful! Please log in.');
                router.push('/student/login');
            } else {
                setError(data.message || 'Registration failed.');
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
                <h1 className="text-2xl font-bold mb-4">Student Registration</h1>
                {error && <p className="text-red-600 mb-2">{error}</p>}
                {message && <p className="text-green-600 mb-2">{message}</p>}

                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border p-2 mb-3 rounded"
                    required
                />
                <input
                    type="text"
                    name="roll_number"
                    placeholder="Student Roll Number"
                    value={formData.roll_number}
                    onChange={handleChange}
                    className="w-full border p-2 mb-3 rounded"
                    required
                />

                <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full border p-2 mb-3 rounded"
                    required
                >
                    <option value="">Select Department</option>
                    <option value="CSE">CSE</option>
                    <option value="CE">CE</option>
                    <option value="ME">ME</option>
                </select>

                <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full border p-2 mb-3 rounded"
                    required
                >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                </select>

                <input
                    type="password"
                    name="password"
                    placeholder="Create Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border p-2 mb-3 rounded"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded"
                >
                    Register
                </button>
            </form>
        </div>
    );
}
