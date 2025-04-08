// app/student/hall-ticket/page.tsx
'use client';
import React from 'react';

export default function HallTicket() {
    return (
        <div className='text-black'>
            <h1 className="text-3xl font-bold mb-4">Your Hall Ticket</h1>
            <p>Click the button below to download your hall ticket.</p>
            <a
                href="/api/student/hall-ticket/download?roll=YOUR_STUDENT_ROLL" // Replace YOUR_STUDENT_ROLL appropriately (e.g., from context)
                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Download Hall Ticket
            </a>
        </div>
    );
}
