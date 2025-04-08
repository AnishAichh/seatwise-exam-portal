import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Normalize path to remove trailing slashes
    const cleanPath = pathname.replace(/\/+$/, '');

    // Admin protection
    if (
        pathname.startsWith('/admin') &&
        !pathname.startsWith('/admin/login')
    ) {
        const adminLoggedIn = request.cookies.get('admin_logged_in');
        if (!adminLoggedIn) {
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            return NextResponse.redirect(url);
        }
    }

    // Public student pages
    const publicStudentPaths = new Set([
        '/student/login',
        '/student/register',
        '/student/forgot-password', // if needed
    ]);

    const isProtectedStudentRoute =
        pathname.startsWith('/student') && !publicStudentPaths.has(cleanPath);

    if (isProtectedStudentRoute) {
        const studentLoggedIn = request.cookies.get('student_logged_in');
        if (!studentLoggedIn) {
            const url = request.nextUrl.clone();
            url.pathname = '/student/login';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/student/:path*'],
};
