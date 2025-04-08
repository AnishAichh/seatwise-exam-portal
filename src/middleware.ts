import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 🧠 Only protect student dashboard and beyond, not login or register
    const isStudentProtected =
        pathname.startsWith('/student') &&
        pathname !== '/student/login' &&
        pathname !== '/student/register';

    if (isStudentProtected) {
        const studentLoggedIn = request.cookies.get('student_logged_in');
        if (!studentLoggedIn) {
            const url = request.nextUrl.clone();
            url.pathname = '/student/login';
            return NextResponse.redirect(url);
        }
    }

    // 🧠 Admin protection (same idea)
    const isAdminProtected =
        pathname.startsWith('/admin') && pathname !== '/admin/login';

    if (isAdminProtected) {
        const adminLoggedIn = request.cookies.get('admin_logged_in');
        if (!adminLoggedIn) {
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

// ✅ Only run middleware on these paths:
export const config = {
    matcher: [
        '/admin((?!/login).*)',
        '/student((?!/(login|register)).*)',
    ],
};
