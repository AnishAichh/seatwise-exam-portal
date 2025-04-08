'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [showSidebar, setShowSidebar] = useState(false);
    const [studentName, setStudentName] = useState('');
    const [isCheckingAuth, setIsCheckingAuth] = useState(true); // auth loading
    const router = useRouter();

    useEffect(() => {
        // ❗ Hide sidebar on /student/login or /student/register
        if (pathname === '/student/login' || pathname === '/student/register') {
            setShowSidebar(false);
            setIsCheckingAuth(false);
            return;
        }

        const checkAuth = async () => {
            try {
                const res = await fetch('/api/student/me');
                const data = await res.json();

                if (data.student) {
                    setStudentName(data.student.name);
                    setShowSidebar(true);
                } else {
                    router.push('/student/login');
                }
            } catch (err) {
                router.push('/student/login');
            } finally {
                setIsCheckingAuth(false);
            }
        };

        checkAuth();
    }, [pathname, router]);

    const handleLogout = async () => {
        await fetch('/api/student/logout');
        router.push('/');
    };

    if (isCheckingAuth) return null; // or a spinner if preferred

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
