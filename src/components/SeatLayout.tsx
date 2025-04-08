'use client';

import React, { useState } from 'react';

type StudentSeat = {
    student_roll: string;
    classroom: number;
    row: number;
    seat_column: number;
    department: string;
};

type Props = {
    seatData: StudentSeat[];
    year: number;
    onDelete: (year: number) => void;
};

const getDeptColor = (dept: string) => {
    switch (dept) {
        case 'CSE':
            return 'bg-blue-400';
        case 'CE':
            return 'bg-green-400';
        case 'ME':
            return 'bg-red-400';
        default:
            return 'bg-gray-300';
    }
};

const SeatLayout: React.FC<Props> = ({ seatData, year, onDelete }) => {
    const [loading, setLoading] = useState(false);

    // ✅ Handle empty or undefined seatData safely
    if (!Array.isArray(seatData) || seatData.length === 0) {
        return (
            <div className="text-gray-600 mt-4">
                No seat plan found for Year {year}.
            </div>
        );
    }

    const handleDelete = async () => {
        setLoading(true);

        try {
            const response = await fetch('/api/admin/delete-seatplan', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ year }),
            });

            const result = await response.json();

            if (result.success) {
                alert('Seat plan deleted successfully!');
                onDelete(year); // Notify the parent to remove the current seat plan
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error deleting seat plan:', error);
            alert('Error deleting seat plan');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Group by classroom safely
    const classrooms = Array.from(
        seatData.reduce((map, seat) => {
            if (!map.has(seat.classroom)) map.set(seat.classroom, []);
            map.get(seat.classroom)?.push(seat);
            return map;
        }, new Map<number, StudentSeat[]>())
    );

    return (
        <div className="space-y-10">
            <div className="mb-4">
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className={`px-4 py-2 text-white ${loading ? 'bg-gray-400' : 'bg-red-500'} rounded`}
                >
                    {loading ? 'Deleting...' : 'Delete Seat Plan'}
                </button>
            </div>

            <div className="space-y-10">
                {classrooms.map(([classroomNumber, seats]) => (
                    <div key={classroomNumber}>
                        <h2 className="text-xl font-bold mb-4">Classroom {classroomNumber}</h2>
                        <div className="grid grid-rows-3 gap-4">
                            {[1, 2, 3].map((rowNum) => (
                                <div className="grid grid-cols-6 gap-4" key={rowNum}>
                                    {seats
                                        .filter((seat) => seat.row === rowNum)
                                        .sort((a, b) => a.seat_column - b.seat_column)
                                        .map((seat, index) => (
                                            <div
                                                key={index}
                                                className={`p-2 rounded text-center text-sm text-white ${getDeptColor(
                                                    seat.department
                                                )}`}
                                            >
                                                <div>{seat.student_roll}</div>
                                                <div>{seat.department}</div>
                                            </div>
                                        ))}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeatLayout;
