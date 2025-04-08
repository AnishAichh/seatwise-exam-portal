import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET(req: NextRequest) {
    try {
        const rollCookie = req.cookies.get('student_logged_in');

        if (!rollCookie?.value) {
            return NextResponse.json({ success: false, message: 'Unauthorized: No cookie' }, { status: 401 });
        }

        const rollNumber = rollCookie.value;

        console.log('👤 Student Roll from Cookie:', rollNumber);

        // Fetch student year
        const studentResult = await pool.query(
            'SELECT year FROM students WHERE roll_number = $1',
            [rollNumber]
        );

        if (studentResult.rows.length === 0) {
            console.log('❌ Student not found');
            return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
        }

        const year = studentResult.rows[0].year;
        console.log('🎓 Student Year:', year);

        const seatResult = await pool.query(
            'SELECT * FROM seat_plans WHERE student_roll = $1 AND exam_year = $2',
            [rollNumber, year]
        );

        if (seatResult.rows.length === 0) {
            console.log('📭 No seat plan found for', rollNumber, 'in year', year);
            return NextResponse.json({ success: false, message: 'No seat plan found' }, { status: 404 });
        }

        console.log('✅ Seat Plan Found:', seatResult.rows[0]);

        return NextResponse.json({ success: true, seat: seatResult.rows[0] });
    } catch (error) {
        console.error('🔥 Server Error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
