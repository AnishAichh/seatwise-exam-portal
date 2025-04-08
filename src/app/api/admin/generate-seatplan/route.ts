import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";

// POST /api/admin/generate-seatplan
export async function POST(req: NextRequest) {
    try {
        const { year } = await req.json();

        if (!year) {
            return NextResponse.json({ success: false, message: "Year is required" }, { status: 400 });
        }

        // 1. Fetch all students of selected year
        const { rows: students } = await pool.query(
            "SELECT * FROM students WHERE year = $1 ORDER BY name",
            [year]
        );

        const cse = students.filter(s => s.department === "CSE");
        const ce = students.filter(s => s.department === "CE");
        const me = students.filter(s => s.department === "ME");

        const classrooms = [];
        const seatsPerClassroom = 36;
        let classCounter = 1;

        // 2. Generate FULL classrooms (12 from each dept)
        while (cse.length >= 12 && ce.length >= 12 && me.length >= 12) {
            const block = [
                ...cse.splice(0, 12),
                ...ce.splice(0, 12),
                ...me.splice(0, 12),
            ];

            const seatPlan = generateAntiCheatingLayout(block);
            for (const seat of seatPlan) {
                classrooms.push({
                    classroom: classCounter,
                    ...seat,
                    exam_year: year,
                });
            }
            classCounter++;
        }

        // 3. Combine remaining students for PARTIAL classroom
        const remaining = [...cse, ...ce, ...me];
        if (remaining.length > 0) {
            const partialSeatPlan = generateAntiCheatingLayout(remaining);
            for (const seat of partialSeatPlan) {
                classrooms.push({
                    classroom: classCounter,
                    ...seat,
                    exam_year: year,
                });
            }
        }

        // 4. Insert into seat_plans table
        const insertQuery = `
            INSERT INTO seat_plans (student_roll, classroom, row, seat_column, exam_year, department)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;

        for (const seat of classrooms) {
            await pool.query(insertQuery, [
                seat.student_roll,
                seat.classroom,
                seat.row,
                seat.seat_column,
                seat.exam_year,
                seat.department,
            ]);
        }

        return NextResponse.json({
            success: true,
            message: `Seat plan generated for Year ${year}. ${classCounter - 1} full classroom(s) and ${remaining.length > 0 ? 1 : 0} partial classroom.`,
        });

    } catch (error) {
        console.error("Error generating seat plan:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

// 🧠 Flexible anti-cheating layout generator
function generateAntiCheatingLayout(students: any[]) {
    const basePattern = [
        [0, 0], [0, 2], [0, 4],
        [1, 1], [1, 3], [1, 5],
        [2, 0], [2, 2], [2, 4],
        [0, 1], [1, 0], [2, 1],
        [0, 3], [1, 2], [2, 3],
        [0, 5], [1, 4], [2, 5],
        [0, 0], [0, 2], [0, 4],
        [1, 1], [1, 3], [1, 5],
        [2, 0], [2, 2], [2, 4],
        [0, 1], [1, 0], [2, 1],
        [0, 3], [1, 2], [2, 3],
        [0, 5], [1, 4], [2, 5],
    ];

    const shuffled = [...students].sort(() => Math.random() - 0.5);
    const layout = [];

    for (let i = 0; i < shuffled.length; i++) {
        const student = shuffled[i];
        const [r, c] = basePattern[i];
        layout.push({
            row: r + 1,
            seat_column: c + 1,
            student_roll: student.roll_number, // ✅ Correct field from students table
            department: student.department,
        });

    }

    return layout;
}
