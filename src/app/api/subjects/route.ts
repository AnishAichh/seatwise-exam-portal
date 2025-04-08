import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const semester = searchParams.get('semester');
    const category = searchParams.get('category'); // Optional: Theory, Practical, Elective

    try {
        const values: any[] = [];
        let query = 'SELECT * FROM subjects WHERE 1=1';

        if (semester) {
            query += ' AND semester = $1';
            values.push(Number(semester));
        }

        if (category) {
            const paramIndex = values.length + 1;
            query += ` AND category = $${paramIndex}`;
            values.push(category);
        }

        const result = await pool.query(query, values);

        return NextResponse.json({ subjects: result.rows });
    } catch (error) {
        console.error('Error fetching subjects:', error);
        return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 });
    }
}
