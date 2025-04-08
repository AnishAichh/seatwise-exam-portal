// src/app/api/admin/login/route.ts
import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function POST(req: Request) {
    const { username, password } = await req.json();

    try {
        const result = await pool.query(
            'SELECT * FROM admins WHERE username = $1 AND password = $2',
            [username, password]
        );

        if (result.rows.length === 1) {
            const response = NextResponse.json({ success: true, message: 'Login successful' });

            response.cookies.set('admin_logged_in', 'true', {
                httpOnly: true,
                path: '/',
                maxAge: 60 * 60,
            });

            return response;
        } else {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }
    } catch (err) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
