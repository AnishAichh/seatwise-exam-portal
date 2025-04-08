// src/app/api/student/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET(req: NextRequest) {
    const cookie = req.cookies.get('student_logged_in');
    if (!cookie) return NextResponse.json({ student: null });

    const roll = cookie.value;

    try {
        const result = await pool.query('SELECT * FROM students WHERE roll_number = $1', [roll]);

        if (result.rows.length === 0) {
            return NextResponse.json({ student: null });
        }

        const student = result.rows[0];
        return NextResponse.json({ student });
    } catch (error) {
        return NextResponse.json({ student: null });
    }
}
