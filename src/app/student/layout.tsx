'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [showSidebar, setShowSidebar] = useState(true);
    const [studentName, setStudentName] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (pathname === '/student/login') {
            setShowSidebar(false);
        } else {
            setShowSidebar(true);
            fetch('/api/student/me')
                .then(res => res.json())
                .then(data => {
                    if (data.student) setStudentName(data.student.name);
                });
        }
    }, [pathname]);

    const handleLogout = async () => {
        await fetch('/api/student/logout');
        router.push('/student/login');
    };

    return (
        <div className="min-h-screen flex">
            {showSidebar && (
                <aside className="w-64 bg-gray-800 text-white p-6 space-y-4">
                    <h2 className="text-2xl font-bold">Welcome, {studentName}</h2>
                    <nav className="flex flex-col gap-2">
                        <Link href="/student/dashboard" className="hover:text-blue-300">Dashboard</Link>
                        <Link href="/student/seat" className="hover:text-blue-300">Seat Assignment</Link>
                        <Link href="/student/hall-ticket" className="hover:text-blue-300">Hall Ticket</Link>
                        <Link href="/student/exam-routine" className="hover:text-blue-300">Exam Routine</Link>
                        <Link href="/student/syllabus" className="hover:text-blue-300">Syllabus</Link>
                        <button
                            onClick={handleLogout}
                            className="mt-4 text-red-400 hover:text-red-600 text-left"
                        >
                            Logout
                        </button>
                    </nav>
                </aside>
            )}

            <main className="flex-1 bg-gray-100 p-8">{children}</main>
        </div>
    );
}
