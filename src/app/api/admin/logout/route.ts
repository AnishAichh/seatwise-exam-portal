import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true, message: 'Logged out' });

    response.cookies.set('admin_logged_in', '', {
        httpOnly: true,
        path: '/',
        maxAge: 0,
    });

    return response;
}
