// /app/api/student/exam-routine/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const semesterParam = searchParams.get('semester');
        const yearParam = searchParams.get('year');

        let semesters: number[] = [];

        if (semesterParam) {
            const semester = Number(semesterParam);
            if (semester < 1 || semester > 8) {
                return NextResponse.json({ message: 'Invalid semester' }, { status: 400 });
            }
            semesters = [semester];
        } else if (yearParam) {
            const year = Number(yearParam);
            if (![1, 2, 3, 4].includes(year)) {
                return NextResponse.json({ message: 'Invalid year' }, { status: 400 });
            }

            const yearToSemesters: Record<number, number[]> = {
                1: [1, 2],
                2: [3, 4],
                3: [5, 6],
                4: [7, 8],
            };

            semesters = yearToSemesters[year];
        } else {
            return NextResponse.json({ message: 'semester or year is required' }, { status: 400 });
        }

        const result = await db.query(
            `SELECT semester, subject_code, exam_date, start_time, end_time
             FROM exam_routines
             WHERE semester = ANY($1) AND is_published = true
             ORDER BY semester, exam_date`,
            [semesters]
        );

        const grouped = result.rows.reduce((acc: any, row: any) => {
            const { semester, subject_code, exam_date, start_time, end_time } = row;

            if (!acc[semester]) acc[semester] = [];

            acc[semester].push({
                subjectCode: subject_code,
                examDate: exam_date,
                startTime: start_time,
                endTime: end_time,
            });

            return acc;
        }, {});

        const routines = Object.entries(grouped).map(([semester, routine]) => ({
            semester: Number(semester),
            routine,
        }));

        return NextResponse.json({ routines });
    } catch (error) {
        console.error('[STUDENT_EXAM_ROUTINE_GET]', error);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
}
