import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const roll = searchParams.get('roll');
    if (!roll) {
        return NextResponse.json(
            { error: 'Missing roll param' },
            { status: 400 }
        );
    }

    try {
        const result = await pool.query(
            'SELECT * FROM seat_plans WHERE student_roll = $1',
            [roll]
        );
        if (result.rows.length === 0) {
            return NextResponse.json({ seat: null });
        }
        return NextResponse.json({ seat: result.rows[0] });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        );
    }
}
