// app/(dashboard)/layout.tsx
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <h1>teste</h1>
            {children}
        </div>
    );
}
