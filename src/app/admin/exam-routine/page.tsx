'use client';
import React, { useEffect, useState } from 'react';

type Subject = {
    id: number;
    semester: number;
    subject_code: string;
    subject_name: string;
    category: string;
};

type RoutineEntry = {
    subject_code: string;
    date: string;
    start_time: string;
    end_time: string;
};

export default function ExamRoutineAdminPage() {
    const [semester, setSemester] = useState<number>(1);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [routine, setRoutine] = useState<RoutineEntry[]>([]);
    const [message, setMessage] = useState('');
    const [isPublishing, setIsPublishing] = useState(false);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await fetch(`/api/subjects?semester=${semester}`);
                const data = await res.json();
                setSubjects(data.subjects);
                setRoutine(
                    data.subjects.map((sub: Subject) => ({
                        subject_code: sub.subject_code,
                        date: '',
                        start_time: '',
                        end_time: '',
                    }))
                );
            } catch (err) {
                console.error('Error fetching subjects:', err);
            }
        };

        fetchSubjects();
    }, [semester]);

    const handleRoutineChange = (
        index: number,
        field: keyof RoutineEntry,
        value: string
    ) => {
        const updated = [...routine];
        updated[index][field] = value;
        setRoutine(updated);
    };

    const handleSave = async () => {
        const res = await fetch('/api/admin/exam-routine', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ semester, routine, isPublished: false }),
        });
        const data = await res.json();
        setMessage(data.message || 'Routine saved successfully!');
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        const res = await fetch('/api/admin/exam-routine', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ semester, routine, isPublished: true }),
        });
        const data = await res.json();
        setMessage(data.message || 'Routine published successfully!');
        setIsPublishing(false);
    };

    const handleDelete = async (subjectCode: string) => {
        const confirm = window.confirm(`Are you sure you want to delete the routine for ${subjectCode}?`);
        if (!confirm) return;

        const res = await fetch(`/api/admin/exam-routine?semester=${semester}&subject_code=${subjectCode}`, {
            method: 'DELETE',
        });

        const data = await res.json();
        setMessage(data.message || 'Routine deleted.');

        setRoutine((prev) => prev.filter((r) => r.subject_code !== subjectCode));
        setSubjects((prev) => prev.filter((s) => s.subject_code !== subjectCode));
    };

    return (
        <div className="p-8 max-w-6xl mx-auto text-black">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">📅 Exam Routine Scheduler</h1>

            <div className="flex items-center gap-4 mb-6">
                <label className="font-medium text-gray-700">Select Semester:</label>
                <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 shadow-sm"
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem}>
                            Semester {sem}
                        </option>
                    ))}
                </select>
            </div>

            <div className="overflow-x-auto rounded-md border shadow-sm">
                <table className="w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 text-gray-800 font-medium">
                        <tr>
                            <th className="px-4 py-3 border-b">Subject Code</th>
                            <th className="px-4 py-3 border-b">Subject Name</th>
                            <th className="px-4 py-3 border-b">Date</th>
                            <th className="px-4 py-3 border-b">Start Time</th>
                            <th className="px-4 py-3 border-b">End Time</th>
                            <th className="px-4 py-3 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map((subject, index) => (
                            <tr key={subject.subject_code} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-2">{subject.subject_code}</td>
                                <td className="px-4 py-2">{subject.subject_name}</td>
                                <td className="px-4 py-2">
                                    <input
                                        type="date"
                                        value={routine[index]?.date || ''}
                                        onChange={(e) => handleRoutineChange(index, 'date', e.target.value)}
                                        className="border rounded-md px-2 py-1 w-full"
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <input
                                        type="time"
                                        value={routine[index]?.start_time || ''}
                                        onChange={(e) => handleRoutineChange(index, 'start_time', e.target.value)}
                                        className="border rounded-md px-2 py-1 w-full"
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <input
                                        type="time"
                                        value={routine[index]?.end_time || ''}
                                        onChange={(e) => handleRoutineChange(index, 'end_time', e.target.value)}
                                        className="border rounded-md px-2 py-1 w-full"
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleDelete(subject.subject_code)}
                                        className="text-red-600 hover:underline"
                                    >
                                        🗑️ Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex gap-4 mt-6">
                <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow"
                >
                    💾 Save Draft
                </button>
                <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow disabled:opacity-60"
                >
                    {isPublishing ? 'Publishing...' : '🚀 Publish & Notify Students'}
                </button>
            </div>

            {message && (
                <p className="mt-4 text-green-700 font-semibold bg-green-100 px-4 py-2 rounded-md border border-green-300">
                    {message}
                </p>
            )}
        </div>
    );
}
