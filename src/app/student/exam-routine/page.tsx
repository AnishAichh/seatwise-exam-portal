'use client';

import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface RoutineEntry {
    subjectCode: string;
    examDate: string;
    startTime: string;
    endTime: string;
}

interface SemesterRoutine {
    semester: number;
    routine: RoutineEntry[];
}

export default function ExamRoutinePage() {
    const [routine, setRoutine] = useState<SemesterRoutine | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoutine = async () => {
            try {
                const meRes = await fetch('/api/student/me');
                const meData = await meRes.json();
                const student = meData.student;

                if (!student) return;

                const studentYear = student.year;

                // Fetch routines by year
                const res = await fetch(`/api/student/exam-routine?year=${studentYear}`);
                const data = await res.json();

                const allRoutines: SemesterRoutine[] = data.routines || [];

                const latestRoutine = allRoutines.sort((a, b) => b.semester - a.semester)[0] || null;

                setRoutine(latestRoutine);
            } catch (err) {
                console.error('Error fetching exam routine:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoutine();
    }, []);

    const handleDownloadPDF = () => {
        if (!routine) return;

        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(`📚 Exam Routine - Semester ${routine.semester}`, 14, 20);

        const rows = routine.routine.map((entry) => [
            entry.subjectCode,
            new Date(entry.examDate).toLocaleDateString(),
            entry.startTime,
            entry.endTime,
        ]);

        doc.autoTable({
            head: [['Subject Code', 'Exam Date', 'Start Time', 'End Time']],
            body: rows,
            startY: 30,
        });

        doc.save(`exam-routine-sem-${routine.semester}.pdf`);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto text-black">
            <h1 className="text-3xl font-bold text-center mb-4">📚 Exam Routine</h1>

            {loading ? (
                <div className="text-center text-gray-600">Loading...</div>
            ) : !routine ? (
                <div className="text-center text-red-500">
                    No published routine found for your semester.
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-blue-700">
                            Semester {routine.semester}
                        </h2>
                        <button
                            onClick={handleDownloadPDF}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Download PDF
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded shadow">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="py-2 px-4 border-b">Subject Code</th>
                                    <th className="py-2 px-4 border-b">Exam Date</th>
                                    <th className="py-2 px-4 border-b">Start Time</th>
                                    <th className="py-2 px-4 border-b">End Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {routine.routine.map((entry, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b text-center">{entry.subjectCode}</td>
                                        <td className="py-2 px-4 border-b text-center">
                                            {new Date(entry.examDate).toLocaleDateString()}
                                        </td>
                                        <td className="py-2 px-4 border-b text-center">{entry.startTime}</td>
                                        <td className="py-2 px-4 border-b text-center">{entry.endTime}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
