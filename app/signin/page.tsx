"use client"

import { SetUser } from "@/lib/repos/user";
import Link from "next/link";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function SignIn() {


    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [cpf, setCpf] = useState('')
    const [dtnasc, setDtnasc] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpassword, setConfirmPassword] = useState('')
    const [isloading, setLoading] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCreate();
        }
    };

    async function handleCreate() {

        setLoading(true)

        let toastId: string | null = null

        try {
            toastId = toast.loading("Cadastrando usuário...");

            if (!nome.trim() || !email.trim() || !cpf.trim() || !dtnasc || !password.trim() || !confirmpassword.trim()) {

                throw new Error("Todos os campos são de preenchimento obrigatório.")
            }

            if (nome.trim().split(" ").length <= 1) {

                throw new Error("Nome completo inválido.")
            }

            if (!email.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {

                throw new Error("Email inválido.");
            }

            const dtnascDate = new Date(dtnasc);

            const today = new Date();
            const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
            const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

            if (dtnascDate < minDate || dtnascDate > maxDate) {
                throw new Error("Data de nascimento inválida (deve estar entre mínimo: 18 anos e máximo: 120 anos).");
            }

            const regex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

            if (!regex.test(password)) {
                throw new Error(
                    "A senha deve ter no mínimo 8 caracteres, incluindo 1 letra maiúscula e 1 símbolo."
                );
            }

            if (password !== confirmpassword) {
                throw new Error("As senhas não coincidem.");
            }

            const user = await SetUser(
                {
                    nome,
                    realm: "[morador]",
                    email,
                    cpf,
                    dtnasc,
                    password
                }
            )

            if (!user) {

                throw new Error("Houve um erro ao criar usuário.")
            }

            toast.success("Usuário criado com sucesso!", {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
                duration: 2000,
            });

            setNome("")
            setEmail("")
            setCpf("")
            setDtnasc("")
            setPassword("")
            setConfirmPassword("")
            
            window.location.replace("/login");

        } catch (err: any) {
            toast.error(err.message, {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
                duration: 2000,
            });

        } finally {
            setLoading(false);

            if (toastId) {

                toast.dismiss(toastId);
            }
        }


    }

    return (
        <>
            {/* <img src="/leftbg.svg" style={{ position: "absolute", height: "100vh", left: 0 }}></img>
            <img src="/rightbg.svg" style={{ position: "absolute", height: "100vh", right: 0 }}></img> */}

            <div className="flex flex-col items-center h-screen py-5 px-3">

                <div
                    className="w-[50vw] my-auto flex flex-col h-[90vh] rounded-md px-[10vh] py-[3vh] justify-center items-center bg-[var(--background)]"
                    style={{
                        filter: "drop-shadow(-6px 4px 6.8px rgba(0, 0, 0, 0.25))"
                    }}
                >

                    <div className="flex flex-col gap-1 w-full items-center justify-around">

                        <div className="flex flex-col text-center justify-center items-center mb-5">
                            <img src="/logo.svg" />
                            <p className="text-sm">Tecnologia e proteção para sua casa, em um só lugar.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="nome">
                                    Nome Completo
                                </label>
                                <input
                                    id="nome"
                                    type="text"
                                    placeholder="Jhon Doe"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="mb-3 text-sm px-4 py-2 border rounded w-full"
                                    required={true}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="example@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mb-3 text-sm px-4 py-2 border rounded w-full"
                                    required={true}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="cpf">
                                    CPF
                                </label>
                                <input
                                    id="cpf"
                                    type="text"
                                    placeholder="999.999.999-99"
                                    value={cpf}
                                    onChange={async (e) => {
                                        let value = e.target.value.replace(/\D/g, ''); // só números

                                        if (value.length <= 11) {
                                            // CPF: 000.000.000-00
                                            value = value
                                                .replace(/(\d{3})(\d)/, "$1.$2")
                                                .replace(/(\d{3})(\d)/, "$1.$2")
                                                .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                                        }

                                        await setCpf(value);
                                    }}
                                    maxLength={14}
                                    className="mb-5 px-4 text-sm py-2 border rounded w-full"
                                    required={true}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="dtnasc">
                                    Data Nascimento
                                </label>
                                <input
                                    id="dtnasc"
                                    type="date"
                                    value={dtnasc}
                                    onChange={(e) => setDtnasc(e.target.value)}
                                    className="mb-5 px-4 text-sm py-2 border rounded w-full"
                                    required={true}
                                    onKeyDown={handleKeyDown}
                                    min={new Date(new Date().setFullYear(new Date().getFullYear() - 120))
                                        .toISOString()
                                        .split('T')[0]}
                                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                                        .toISOString()
                                        .split('T')[0]}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="dtnasc">
                                    Senha
                                </label>
                                <input
                                    id="password"
                                    placeholder="********"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mb-5 px-4 text-sm py-2 border rounded w-full"
                                    required={true}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="dtnasc">
                                    Confirmar Senha
                                </label>
                                <input
                                    id="confirmpassword"
                                    placeholder="********"
                                    type="password"
                                    value={confirmpassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="mb-5 px-4 text-sm py-2 border rounded w-full"
                                    required={true}
                                    onKeyDown={handleKeyDown}
                                    onPaste={(e) => e.preventDefault()}
                                    onDrop={(e) => e.preventDefault()}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleCreate}
                            disabled={isloading}
                            className="text-sm w-30 px-4 py-2 cursor-pointer text-center justify-center rounded bg-[var(--primary)] text-white hover:opacity-80 flex items-center gap-2 disabled:opacity-50"
                        >
                            {isloading ? 'Cadastrando...' : (
                                <>
                                    Cadastrar
                                </>
                            )}
                        </button>
                    </div>
                    <p className="text-xs" style={{ marginTop: "auto" }}>Já tem uma conta? <strong><Link href="/login">Acesse</Link></strong></p>
                </div>
            </div >
        </>
    )
}