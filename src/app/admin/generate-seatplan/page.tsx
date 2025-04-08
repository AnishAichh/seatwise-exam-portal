'use client';

import { useState } from 'react';

export default function GenerateSeatPlanPage() {
    const [year, setYear] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const generate = async () => {
        setLoading(true);
        setMessage('');
        try {
            const res = await fetch('/api/admin/generate-seatplan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ year }),
            });
            const data = await res.json();
            setMessage(data.success ? '✅ Seat plan generated!' : '❌ Failed.');
        } catch (err) {
            setMessage('❌ Server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-xl mx-auto bg-white rounded-lg shadow-md text-black">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Generate Seat Plan</h1>

            <label className="block text-sm font-medium text-gray-700 mb-2">Select Year:</label>
            <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full mb-6 border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
            </select>

            <button
                onClick={generate}
                disabled={loading}
                className={`w-full bg-blue-600 text-white px-4 py-2 rounded font-semibold transition hover:bg-blue-700 disabled:bg-blue-400`}
            >
                {loading ? 'Generating...' : 'Generate'}
            </button>

            {message && (
                <p
                    className={`mt-6 text-center font-medium ${message.includes('✅') ? 'text-green-600' : 'text-red-600'
                        }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
}
