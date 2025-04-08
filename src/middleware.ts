import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Admin auth
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

    // Student auth — protect only dashboard and other secure pages
    if (
        pathname.startsWith('/student/dashboard') ||
        pathname.startsWith('/student/profile') ||
        pathname.startsWith('/student/seat') ||
        pathname.startsWith('/student/hallticket') // Add more protected pages here
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

export const config = {
    matcher: ['/admin/:path*', '/student/:path*'],
};
