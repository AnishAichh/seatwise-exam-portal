'use client';

import { useEffect, useState } from "react";

interface Seat {
    student_roll: string;
    classroom: number;
    row: number;
    seat_column: number;
    department: string;
}

export default function StudentDashboard() {
    const [seat, setSeat] = useState<Seat | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSeat = async () => {
            const res = await fetch("/api/student/my-seatplan");
            const data = await res.json();
            if (data.success) setSeat(data.seat);
            setLoading(false);
        };
        fetchSeat();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6 bg-white text-black rounded shadow">
            <h2 className="text-2xl font-bold mb-4">🎟️ Your Seat Plan</h2>
            {seat ? (
                <div>
                    <p><strong>Roll:</strong> {seat.student_roll}</p>
                    <p><strong>Classroom:</strong> {seat.classroom}</p>
                    <p><strong>Row:</strong> {seat.row}</p>
                    <p><strong>Column:</strong> {seat.seat_column}</p>
                    <p><strong>Department:</strong> {seat.department}</p>
                </div>
            ) : (
                <p className="text-red-600">No seat plan found. Please contact admin.</p>
            )}
        </div>
    );
}
