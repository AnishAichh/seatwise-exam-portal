// app/admin/login/layout.tsx
import React from 'react';

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            {children}
        </div>
    );
}
