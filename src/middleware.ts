import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow static files and Next.js internals
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.startsWith('/api')
    ) {
        return NextResponse.next();
    }

    // 🔥 Delete cookie if already logged in and visiting /student/register
    if (pathname === '/student/register') {
        const studentLoggedIn = request.cookies.get('student_logged_in');
        if (studentLoggedIn) {
            const response = NextResponse.next();
            response.cookies.delete('student_logged_in');
            return response;
        }
        return NextResponse.next();
    }

    // 🔒 Admin route protection
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const adminLoggedIn = request.cookies.get('admin_logged_in');
        if (!adminLoggedIn) {
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            return NextResponse.redirect(url);
        }
    }

    // 🔒 Student route protection (but allow login/register)
    if (
        pathname.startsWith('/student') &&
        !pathname.startsWith('/student/login') &&
        !pathname.startsWith('/student/register')
    ) {
        const studentLoggedIn = request.cookies.get('student_logged_in');
        if (!studentLoggedIn) {
            const url = request.nextUrl.clone();
            url.pathname = '/student/login';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

// ✅ Match only paths we care about
export const config = {
    matcher: ['/admin/:path*', '/student/:path*'],
};
