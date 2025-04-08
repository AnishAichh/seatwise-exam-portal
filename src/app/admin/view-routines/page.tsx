'use client';

import React, { useEffect, useState } from 'react';

interface RoutineEntry {
    subjectCode: string;
    examDate: string;
    startTime: string;
    endTime: string;
}

export default function ViewRoutines() {
    const [routines, setRoutines] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewSemester, setViewSemester] = useState<number | null>(null);
    const [routineDetails, setRoutineDetails] = useState<RoutineEntry[] | null>(null);

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

    const handleView = async (semester: number) => {
        const res = await fetch(`/api/student/exam-routine?semester=${semester}`);
        const data = await res.json();
        const semRoutine = data.routines?.find((r: any) => r.semester === semester);
        if (semRoutine) {
            setRoutineDetails(semRoutine.routine);
            setViewSemester(semester);
        } else {
            alert('Routine not found for selected semester.');
        }
    };

    const closeModal = () => {
        setViewSemester(null);
        setRoutineDetails(null);
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
                        <li
                            key={sem}
                            className="flex items-center justify-between bg-white p-4 shadow rounded"
                        >
                            <span className="text-lg">Semester {sem}</span>
                            <div className="flex gap-3">
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    onClick={() => handleView(sem)}
                                >
                                    View
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    onClick={() => deleteRoutine(sem)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* View Modal */}
            {viewSemester !== null && routineDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg">
                        <h2 className="text-xl font-bold mb-4 text-center text-blue-700">
                            📚 Exam Routine - Semester {viewSemester}
                        </h2>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full border text-sm text-gray-800">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-2 px-4 border">Subject Code</th>
                                        <th className="py-2 px-4 border">Exam Date</th>
                                        <th className="py-2 px-4 border">Start Time</th>
                                        <th className="py-2 px-4 border">End Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {routineDetails.map((entry, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="py-2 px-4 border text-center">
                                                {entry.subjectCode}
                                            </td>
                                            <td className="py-2 px-4 border text-center">
                                                {new Date(entry.examDate).toLocaleDateString()}
                                            </td>
                                            <td className="py-2 px-4 border text-center">{entry.startTime}</td>
                                            <td className="py-2 px-4 border text-center">{entry.endTime}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="text-center">
                            <button
                                onClick={closeModal}
                                className="mt-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
