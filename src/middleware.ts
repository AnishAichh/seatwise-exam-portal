import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

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

    // Student protection
    const isStudentAuthRoute = ['/student/login', '/student/register'];
    const isStudentProtected = pathname.startsWith('/student') &&
        !isStudentAuthRoute.some((publicPath) => pathname.startsWith(publicPath));

    if (isStudentProtected) {
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
