"use client";
import { useState } from "react";

export default function AdminDashboard() {
    const [year, setYear] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const generateSeatPlan = async () => {
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/admin/generate-seatplan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ year }),
            });

            const data = await res.json();
            if (data.success) {
                setMessage("✅ Seat plan generated successfully!");
            } else {
                setMessage("❌ Failed to generate seat plan.");
            }
        } catch (err) {
            setMessage("❌ Error connecting to server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-12 p-6 shadow-md rounded-lg bg-white">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            <label className="block mb-2 font-medium">Select Year:</label>
            <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full p-2 border rounded mb-4"
            >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
            </select>

            <button
                onClick={generateSeatPlan}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                {loading ? "Generating..." : "Generate Seat Plan"}
            </button>

            {message && (
                <p className="mt-4 font-medium text-center text-green-600">{message}</p>
            )}
        </div>
    );
}
