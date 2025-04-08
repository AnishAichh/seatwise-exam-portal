import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');

    if (!year) {
        return NextResponse.json({ message: "Year is required" }, { status: 400 });
    }

    const numericYear = parseInt(year);
    if (isNaN(numericYear)) {
        return NextResponse.json({ message: "Invalid year format" }, { status: 400 });
    }

    try {
        const res = await pool.query(
            "SELECT * FROM seat_plans WHERE exam_year = $1 ORDER BY classroom, row, seat_column",
            [numericYear]
        );
        return NextResponse.json({ seatPlans: res.rows });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to fetch seat plan" }, { status: 500 });
    }
}
