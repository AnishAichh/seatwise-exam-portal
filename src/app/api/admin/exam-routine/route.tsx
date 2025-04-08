import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db'; // adjust if you're using prisma or pg
import { z } from 'zod';

const RoutineSchema = z.object({
    semester: z.number(),
    isPublished: z.boolean(),
    routine: z.array(
        z.object({
            subject_code: z.string(),
            date: z.string(), // 'YYYY-MM-DD'
            start_time: z.string(), // 'HH:mm'
            end_time: z.string(),
        })
    ),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = RoutineSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ message: 'Invalid data format' }, { status: 400 });
        }

        const { semester, routine, isPublished } = parsed.data;

        // Remove old routine for that semester
        await db.query('DELETE FROM exam_routines WHERE semester = $1', [semester]);

        // Insert new routine
        const insertPromises = routine.map((entry) =>
            db.query(
                `INSERT INTO exam_routines (semester, subject_code, exam_date, start_time, end_time, is_published)
         VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    semester,
                    entry.subject_code,
                    entry.date,
                    entry.start_time,
                    entry.end_time,
                    isPublished,
                ]
            )
        );

        await Promise.all(insertPromises);

        const message = isPublished
            ? 'Exam routine published and saved successfully!'
            : 'Exam routine saved as draft successfully!';

        return NextResponse.json({ success: true, message });
    } catch (error) {
        console.error('Error saving exam routine:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to save exam routine' },
            { status: 500 }
        );
    }
}
