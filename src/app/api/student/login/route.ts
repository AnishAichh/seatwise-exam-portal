import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { roll_number, password } = await req.json();

        const result = await pool.query(
            'SELECT * FROM students WHERE roll_number = $1 AND password = $2',
            [roll_number, password]
        );

        if (result.rows.length === 1) {
            const response = NextResponse.json({ success: true });
            response.cookies.set('student_logged_in', roll_number, {
                httpOnly: true,
                path: '/',
                maxAge: 60 * 60,
            });
            return response;
        } else {
            return NextResponse.json(
                { success: false, message: 'Invalid roll number or password.' },
                { status: 401 }
            );
        }
    } catch (err) {
        console.error('Error in student login:', err);
        return NextResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        );
    }
}
