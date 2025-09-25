"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

export default function OnLoggedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(true);
    const asideRef = useRef<HTMLDivElement>(null);

    // Fecha o menu ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (asideRef.current && !asideRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative min-h-screen">
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-30 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="fixed top-4 left-4 z-50 p-3 text-white rounded shadow-lg"
            >
                ☰
            </button>

            <aside
                ref={asideRef}
                className={`fixed top-0 left-0 h-screen text-white z-50 p-4
                    transition-transform duration-300 transform
                    ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}`}
                style={{ background: "linear-gradient(121.61deg, #4292ED 0.55%, #ED4242 99.45%);" }}
            >

                <div className="flex flex-col h-full">
                    <nav className="flex flex-col gap-3 mt-4">
                        <Link href="" className="p-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded shadow-lg float-right cursor-pointer"
                            >
                                close
                            </button>
                        </Link>

                        <Link href="/validvehicle" className="p-2 hover:underline">
                            Minhas informações
                        </Link>
                        <Link href="/vehicles" className="p-2 hover:underline">
                            Meus veículos
                        </Link>
                        <Link href="/validvehicle" className="p-2 hover:underline">
                            Validar veículo
                        </Link>
                        <Link href="/validvehicle" className="p-2 hover:underline">
                            Validar Usuários
                        </Link>
                    </nav>
                    <div className="mt-auto flex justify-center items-center">
                        <button
                            className="text-sm px-4 py-2 cursor-pointer text-center justify-center rounded bg-[var(--tertiary)] text-white hover:opacity-80 flex items-center gap-2 disabled:opacity-50"
                        >
                            <Link href="/login">Sair</Link>
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 relative z-0">{children}</main>
        </div>
    );
}
