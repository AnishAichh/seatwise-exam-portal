'use client';

import React, { useEffect, useState } from 'react';

export default function ViewRoutines() {
    const [routines, setRoutines] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRoutines = async () => {
        const res = await fetch('/api/admin/routines');
        const data = await res.json();
        if (data.success) {
            setRoutines(data.routines.map((r: any) => r.semester));
        }
        setLoading(false);
    };

    const deleteRoutine = async (semester: number) => {
        if (!confirm(`Delete routine for Semester ${semester}?`)) return;
        const res = await fetch('/api/admin/routines', {
            method: 'DELETE',
            body: JSON.stringify({ semester }),
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        if (data.success) {
            setRoutines(routines.filter((s) => s !== semester));
        }
    };

    useEffect(() => {
        fetchRoutines();
    }, []);

    return (
        <div className="text-black">
            <h1 className="text-2xl font-bold mb-6">Published Exam Routines</h1>
            {loading ? (
                <p>Loading...</p>
            ) : routines.length === 0 ? (
                <p>No published routines found.</p>
            ) : (
                <ul className="space-y-4">
                    {routines.map((sem) => (
                        <li key={sem} className="flex items-center justify-between bg-white p-4 shadow rounded">
                            <span className="text-lg">Semester {sem}</span>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={() => deleteRoutine(sem)}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
