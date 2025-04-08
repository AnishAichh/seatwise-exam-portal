import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { name, roll_number, department, year, password } = await req.json();

        const checkRes = await pool.query(
            'SELECT * FROM students WHERE roll_number = $1',
            [roll_number]
        );
        if (checkRes.rows.length > 0) {
            return NextResponse.json(
                { success: false, message: 'Roll number already registered.' },
                { status: 400 }
            );
        }

        await pool.query(
            `INSERT INTO students (name, roll_number, department, year, password)
       VALUES ($1, $2, $3, $4, $5)`,
            [name, roll_number, department, year, password]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error registering student:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
