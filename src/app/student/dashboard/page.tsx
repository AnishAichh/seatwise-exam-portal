'use client';

import React, { useEffect, useState } from 'react';

export default function StudentDashboard() {
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchStudent() {
            try {
                const res = await fetch('/api/student/me');
                const data = await res.json();

                if (data?.student) {
                    setStudent(data.student);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error('Failed to fetch student:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchStudent();
    }, []);

    if (loading) return <div className="p-8 text-xl">Loading dashboard...</div>;
    if (error || !student) return <div className="p-8 text-red-600 text-xl">Failed to load student data.</div>;

    return (
        <div className="text-black">
            <h1 className="text-3xl font-bold mb-6">Welcome, {student.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Seat Assignment</h2>
                    <p>View where you're seated during the exam.</p>
                    <a
                        href="/student/seat"
                        className="mt-2 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        View Seat Assignment
                    </a>
                </div>



                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Hall Ticket</h2>
                    <p>You can view and download your hall ticket here.</p>
                    <a
                        href="/api/student/hall-ticket/download"
                        className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Download Hall Ticket
                    </a>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Exam Routine</h2>
                    <p>View your upcoming exam routine.</p>
                    <a
                        href="/student/exam-routine"
                        className="mt-2 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        View Exam Routine
                    </a>
                </div>


                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Syllabus</h2>
                    <p>Access your course syllabus and study materials.</p>
                    <a
                        href="/student/syllabus"
                        className="mt-2 inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    >
                        View Syllabus
                    </a>
                </div>
            </div>
        </div>
    );
}
