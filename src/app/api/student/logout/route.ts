// src/app/api/student/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true, message: 'Logged out' });

    response.cookies.set('student_logged_in', '', {
        path: '/',
        maxAge: 0,
    });

    return response;
}
