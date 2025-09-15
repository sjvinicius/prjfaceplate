'use client'
import { LogIn } from "lucide-react";
import Link from "next/link";
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

            let redirect = "/vehicles"

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

            const { role } = data.user

            if (["admin", "gerente"].includes(role)) {

                redirect = "/vehicles"
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
        <>
            {/* <img src="/leftbg.svg" style={{ position: "absolute", height: "100vh", left: 0 }}></img>
            <img src="/rightbg.svg" style={{ position: "absolute", height: "100vh", right: 0 }}></img> */}

            <div className="flex flex-col items-center h-screen py-5 px-3">

                <div
                    className="w-[60vh] my-auto flex flex-col h-[90vh] rounded-md px-[10vh] py-[3vh] justify-center items-center bg-[var(--background)]"
                    style={{
                        filter: "drop-shadow(-6px 4px 6.8px rgba(0, 0, 0, 0.25))"
                    }}
                >

                    <div className="flex flex-col gap-1 w-full items-center justify-center">

                        <div className="flex flex-col text-center justify-center items-center mb-5">
                            <img src="/logo.svg" />
                            <p className="text-sm">Tecnologia e proteção para sua casa, em um só lugar.</p>
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm" htmlFor="email">
                                Usuário
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="example@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mb-3 text-sm px-4 py-2 border rounded w-full max-w-xs"
                                required={true}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm" htmlFor="password">
                                Senha
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="********"
                                value={pwd}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mb-5 px-4 text-sm py-2 border rounded w-full max-w-xs"
                                required={true}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <button
                            onClick={handleLogin}
                            disabled={isloading}
                            className="text-sm w-30 px-4 py-2 cursor-pointer text-center justify-center rounded bg-gray-400 text-white hover:bg-gray-500 flex items-center gap-2 disabled:opacity-50"
                        >
                            {isloading ? 'Entrando...' : (
                                <>
                                    Entrar
                                    <LogIn size={18} />
                                </>
                            )}
                        </button>
                    </div>

                    <div className="text-center" style={{ marginTop: "auto" }}>
                        <p className="text-xs">Não possui uma conta? <strong><Link href="/signin">Cadastre-se</Link></strong></p>
                        <Link href="/forgotpassword"> <strong><p className="text-xs">Esqueci minha senha </p></strong></Link>
                    </div>
                </div>

                <Toaster />
            </div>
        </>
    );
}


