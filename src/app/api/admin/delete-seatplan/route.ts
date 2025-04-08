import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function DELETE(req: NextRequest) {
    try {
        const { year } = await req.json();

        if (!year) {
            return NextResponse.json({ success: false, message: "Year is required" }, { status: 400 });
        }

        // Delete seat plans for the selected year
        const deleteQuery = 'DELETE FROM seat_plans WHERE exam_year = $1';
        await pool.query(deleteQuery, [year]);

        return NextResponse.json({ success: true, message: `Seat plan for year ${year} deleted successfully!` });
    } catch (error) {
        console.error("Error deleting seat plan:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
