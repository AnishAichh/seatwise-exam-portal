import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db'; // a
import { z } from 'zod';

const RoutineSchema = z.object({
    semester: z.number(),
    isPublished: z.boolean(),
    routine: z.array(
        z.object({
            subject_code: z.string(),
            date: z.string(),
            start_time: z.string(),
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


        await db.query('DELETE FROM exam_routines WHERE semester = $1', [semester]);


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


export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const semester = Number(searchParams.get('semester'));
        const subjectCode = searchParams.get('subject_code');

        if (!semester || !subjectCode) {
            return NextResponse.json(
                { success: false, message: 'Missing semester or subject_code' },
                { status: 400 }
            );
        }

        await db.query(
            'DELETE FROM exam_routines WHERE semester = $1 AND subject_code = $2',
            [semester, subjectCode]
        );

        return NextResponse.json({
            success: true,
            message: `Routine for subject ${subjectCode} deleted successfully.`,
        });
    } catch (error) {
        console.error('Error deleting routine entry:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete routine entry' },
            { status: 500 }
        );
    }
}
