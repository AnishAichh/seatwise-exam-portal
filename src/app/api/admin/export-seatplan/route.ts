import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import db from '@/app/lib/db';
import { z } from 'zod';

type SeatData = {
    student_roll: string;
    classroom: string;
    row: number;
    seat_column: number;
    exam_year: number;
    department: string;
};

const departmentColors: Record<string, [number, number, number]> = {
    CSE: [0.8, 0.9, 1],
    CE: [0.83, 0.93, 0.86],
    ME: [0.97, 0.85, 0.85],
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get('year');

    const exam_year = z.coerce.number().int().parse(yearParam);

    try {
        const result = await db.query(
            `SELECT * FROM seat_plans WHERE exam_year = $1 ORDER BY classroom, row, seat_column`,
            [exam_year]
        );

        const seats = result.rows as SeatData[];

        if (seats.length === 0) {
            return NextResponse.json(
                { message: `No seat plan found for year ${exam_year}` },
                { status: 404 }
            );
        }

        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const grouped = seats.reduce((acc: Record<string, SeatData[]>, seat) => {
            if (!acc[seat.classroom]) acc[seat.classroom] = [];
            acc[seat.classroom].push(seat);
            return acc;
        }, {});

        for (const [classroom, entries] of Object.entries(grouped)) {
            const page = pdfDoc.addPage([600, 800]);
            const fontSize = 9;

            page.drawText(`Exam Seat Plan - Year ${exam_year}`, {
                x: 40,
                y: 760,
                size: 16,
                font,
                color: rgb(0.1, 0.1, 0.8),
            });
            page.drawText(`Classroom: ${classroom}`, {
                x: 40,
                y: 740,
                size: fontSize,
                font,
                color: rgb(0.2, 0.2, 0.2),
            });

            const boxWidth = 150;
            const boxHeight = 40;
            const startX = 40;
            const startY = 700;
            const gapX = 20;
            const gapY = 15;


            for (let displayRow = 1; displayRow <= 6; displayRow++) {
                for (let displayCol = 1; displayCol <= 3; displayCol++) {
                    const x = startX + (displayCol - 1) * (boxWidth + gapX);
                    const y = startY - (displayRow - 1) * (boxHeight + gapY);
                    const students = entries.filter(
                        s => s.row === displayCol && s.seat_column === displayRow
                    );

                    page.drawRectangle({
                        x,
                        y,
                        width: boxWidth,
                        height: boxHeight,
                        borderColor: rgb(0, 0, 0),
                        borderWidth: 1,
                        color: rgb(1, 1, 1),
                    });

                    students.forEach((student, i) => {
                        const deptColor = departmentColors[student.department] || [1, 1, 1];
                        const fill = rgb(...deptColor);
                        page.drawRectangle({
                            x: x + 5,
                            y: y + boxHeight - (18 * (i + 1)),
                            width: boxWidth - 10,
                            height: 15,
                            color: fill,
                        });
                        page.drawText(`${student.department} - ${student.student_roll}`, {
                            x: x + 8,
                            y: y + boxHeight - (18 * (i + 1)) + 3,
                            size: fontSize,
                            font,
                            color: rgb(0, 0, 0),
                        });
                    });
                }
            }
        }

        const pdfBytes = await pdfDoc.save();

        return new NextResponse(pdfBytes, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=SeatPlan_Year${exam_year}.pdf`,
            },
        });
    } catch (error) {
        console.error('Error exporting seat plan:', error);
        return NextResponse.json(
            { message: 'Failed to export seat plan' },
            { status: 500 }
        );
    }
}
