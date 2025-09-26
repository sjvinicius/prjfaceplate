"use client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

export default function OnLoggedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);
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
                className="fixed hover:bg-white/20 top-4 left-4 z-50 p-3 text-white rounded shadow-lg cursor-pointer"
            >

                <Menu className="w-6 h-6" />
            </button>

            <aside
                ref={asideRef}
                className={`fixed top-0 left-0 h-screen text-white z-50
                    transition-transform duration-300 transform
                    ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}`}
                style={{ background: "linear-gradient(121.61deg, #4292ED 0.55%, #ED4242 99.45%);" }}
            >

                <div className="flex flex-col h-full">
                    <nav className="flex flex-col mt-4">
                        <div className="rounded mb-6 float-right  cursor-pointer flex items-center justify-between">
                            <Link
                                onClick={() => setIsOpen(false)} href="/" className="w-30">
                                <img src="/logo.svg" />
                            </Link>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="pr-5"
                            >

                                <X className="w-6 h-6 text-black cursor-pointer hover:text-red-400" />
                            </button>
                        </div>

                        <Link
                            onClick={() => setIsOpen(false)} href="/mypage" className="px-4 py-2 hover:bg-white/20 rounded capitalize">
                            Minhas informações
                        </Link>
                        <Link
                            onClick={() => setIsOpen(false)} href="/vehicles" className="px-4 py-2 hover:bg-white/20 rounded capitalize">
                            Meus veículos
                        </Link>
                        <Link
                            onClick={() => setIsOpen(false)} href="/validvehicle" className="px-4 py-2 hover:bg-white/20 rounded capitalize">
                            Validar veículo
                        </Link>
                        <Link
                            onClick={() => setIsOpen(false)} href="/validuser" className="px-4 py-2 hover:bg-white/20 rounded capitalize">
                            Validar Usuários
                        </Link>
                    </nav>
                    <div className="mt-auto flex justify-center items-center my-6">
                        <button
                            className="text-sm px-4 py-2 cursor-pointer text-center justify-center rounded bg-[var(--tertiary)] text-white hover:opacity-80 flex items-center gap-2 disabled:opacity-50"
                        >
                            <Link
                                onClick={() => setIsOpen(false)} href="/login">Sair</Link>
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 relative z-0">{children}</main>
        </div>
    );
}
