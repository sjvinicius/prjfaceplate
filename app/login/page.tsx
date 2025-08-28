'use client'
import { Link, LogIn } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {

    const [email, setEmail] = useState('')
    const [pwd, setPassword] = useState('')
    const [isloading, setLoading] = useState(false);

    const searchParams = useSearchParams();

    useEffect(() => {

        if (searchParams.get('expired')) {
            toast.error("Sessão expirada, faça login novamente.", {
                style: {
                    borderRadius: "10px",
                    background: "#DEAF21",
                    color: "#FFF",
                },
                duration: 2000,
            });
        }
    }, [searchParams]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    const handleLogin = async () => {
        setLoading(true);

        try {

            let redirect = "/consulta"

            if (!email || !pwd) {
                throw new Error("Preencha corretamente os campos.")
            }

            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, pwd }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.erro || 'Erro de autenticação, entre em contato com o suporte.');

            const { role } = data

            if (["admin", "gerente"].includes(role)) {

                redirect = "/dashboard"
            }

            const params = new URLSearchParams(window.location.search);
            const redirectTo = params.get('redirect') || redirect;

            window.location.href = redirectTo;
        } catch (err: any) {
            toast.error(err.message, {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
                duration: 2000,
            });

            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center h-screen py-5 px-3">
            <h1>Bem vindo a FacePlate</h1>

            <div className="my-auto flex flex-col justify-center items-center">

                <input
                    type="email"
                    placeholder="example@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-3 px-4 py-2 border rounded w-full max-w-xs"
                    required={true}
                    onKeyDown={handleKeyDown}
                />

                <input
                    type="password"
                    placeholder="********"
                    value={pwd}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-5 px-4 py-2 border rounded w-full max-w-xs"
                    required={true}
                    onKeyDown={handleKeyDown}
                />

                <button
                    onClick={handleLogin}
                    disabled={isloading}
                    className="px-4 py-2 w-full text-center justify-center rounded bg-blue-800 text-white hover:bg-orange-600 flex items-center gap-2 disabled:opacity-50"
                >
                    {isloading ? 'Entrando...' : (
                        <>
                            Entrar
                            <LogIn size={18} />
                        </>
                    )}
                </button>


            </div>

            <Toaster />
        </div>
    );
}


