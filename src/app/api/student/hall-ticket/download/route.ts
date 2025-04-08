// app/api/student/hall-ticket/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import pool from '@/app/lib/db';
import { z } from 'zod';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const roll = searchParams.get('roll'); // Optionally pass roll as query param or read from session
        if (!roll) {
            return NextResponse.json({ error: 'Missing roll parameter' }, { status: 400 });
        }

        // Fetch student details (and exam info if needed)
        const studentRes = await pool.query('SELECT * FROM students WHERE roll_number = $1', [roll]);
        if (studentRes.rows.length === 0) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }
        const student = studentRes.rows[0];

        // Create a simple hall ticket PDF
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const page = pdfDoc.addPage([600, 800]);
        page.drawText('Hall Ticket', { x: 50, y: 750, size: 24, font, color: rgb(0, 0, 0) });
        page.drawText(`Name: ${student.name}`, { x: 50, y: 700, size: 16, font });
        page.drawText(`Roll: ${student.roll_number}`, { x: 50, y: 680, size: 16, font });
        // Add more details like exam schedule etc.
        const pdfBytes = await pdfDoc.save();

        return new NextResponse(pdfBytes, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=HallTicket_${student.roll_number}.pdf`,
            },
        });
    } catch (error) {
        console.error('Error generating hall ticket:', error);
        return NextResponse.json({ error: 'Failed to generate hall ticket' }, { status: 500 });
    }
}
