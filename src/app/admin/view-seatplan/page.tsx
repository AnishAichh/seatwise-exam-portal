'use client';

import React, { useState, useEffect } from 'react';
import SeatLayout from '@/components/SeatLayout';

const ViewSeatPlan = () => {
    const [seatData, setSeatData] = useState<any[]>([]);
    const [year, setYear] = useState<number>(1);
    const [message, setMessage] = useState<string | null>(null);

    const fetchSeatPlans = async (selectedYear: number) => {
        try {
            const res = await fetch(`/api/admin/view-seatplan?year=${selectedYear}`);
            const data = await res.json();
            if (data.message) {
                setMessage(data.message);
                setSeatData([]);
            } else {
                setSeatData(data.seatPlans);
                setMessage(null);
            }
        } catch (error) {
            console.error('Error fetching seat plan:', error);
            setMessage('Failed to fetch seat plan');
        }
    };

    const handleDelete = async (selectedYear: number) => {
        try {
            const res = await fetch('/api/admin/delete-seatplan', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ year: selectedYear }),
            });

            const data = await res.json();
            if (data.success) {
                setMessage(data.message);
                setSeatData([]);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error('Error deleting seat plan:', error);
            setMessage('Failed to delete seat plan');
        }
    };

    const handleDownloadPDF = async () => {
        try {
            const res = await fetch(`/api/admin/export-seatplan?year=${year}`);
            if (!res.ok) throw new Error('Failed to download PDF');
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `SeatPlan_Year${year}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Failed to download PDF');
        }
    };

    useEffect(() => {
        fetchSeatPlans(year);
    }, [year]);

    return (
        <div className="text-black">
            <h1 className="text-2xl font-bold mb-4">View Seat Plan</h1>

            <div className="mb-4 flex gap-4 items-center">
                <select
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="border px-4 py-2 rounded"
                >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                </select>

                <button
                    onClick={() => fetchSeatPlans(year)}
                    disabled={!!message}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Fetch Seat Plan
                </button>

                <button
                    onClick={handleDownloadPDF}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Download Seat Plan PDF
                </button>
            </div>

            {message && <p className="text-red-500">{message}</p>}

            <h2 className="text-xl font-semibold mb-2">Seat Assignments for Year {year}</h2>
            <SeatLayout seatData={seatData} year={year} onDelete={handleDelete} />
        </div>
    );
};

export default ViewSeatPlan;
