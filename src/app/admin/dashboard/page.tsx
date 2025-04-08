'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const router = useRouter();

    return (
        <div className='text-black'>
            <h1 className="text-3xl font-bold mb-6">Welcome, Admin!</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow-md p-6 rounded">
                    <h2 className="text-xl font-semibold mb-2">Generate Seat Plan</h2>
                    <p className="text-gray-600">Mix students and create cheat-proof seating by year.</p>
                    <button
                        onClick={() => router.push('/admin/generate-seatplan')}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Go
                    </button>
                </div>

                <div className="bg-white shadow-md p-6 rounded">
                    <h2 className="text-xl font-semibold mb-2">View Seat Plans</h2>
                    <p className="text-gray-600">See generated layouts and export them to PDF.</p>
                    <button
                        onClick={() => router.push('/admin/view-seatplan')}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        View
                    </button>
                </div>

                {/* ✅ New Exam Routine Card */}
                <div className="bg-white shadow-md p-6 rounded">
                    <h2 className="text-xl font-semibold mb-2">Exam Routine</h2>
                    <p className="text-gray-600">Schedule and publish semester-wise exam dates.</p>
                    <button
                        onClick={() => router.push('/admin/exam-routine')}
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                        Schedule
                    </button>
                </div>
            </div>
        </div>
    );
}
