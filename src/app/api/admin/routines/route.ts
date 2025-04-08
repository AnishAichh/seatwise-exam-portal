import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function GET() {
    try {
        const result = await db.query(
            'SELECT DISTINCT semester FROM exam_routines WHERE is_published = true ORDER BY semester'
        );
        return NextResponse.json({ success: true, routines: result.rows });
    } catch (error) {
        console.error('Error fetching routines:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch routines' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { semester } = await req.json();
        await db.query('DELETE FROM exam_routines WHERE semester = $1 AND is_published = true', [semester]);
        return NextResponse.json({ success: true, message: 'Routine deleted successfully' });
    } catch (error) {
        console.error('Error deleting routine:', error);
        return NextResponse.json({ success: false, message: 'Failed to delete routine' }, { status: 500 });
    }
}
