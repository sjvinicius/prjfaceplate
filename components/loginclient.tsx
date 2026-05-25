'use client'

import { LogIn } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginClient({
  expired,
  redirect,
}: {
  expired?: string;
  redirect?: string;
}) {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [pwd, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (expired) {
      toast.error("Sessão expirada, faça login novamente.", {
        style: {
          borderRadius: "10px",
          background: "#DEAF21",
          color: "#FFF",
        },
        duration: 2000,
      });
    }
  }, [expired]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    setLoading(true);

    let toastId: string | null = null;

    try {
      toastId = toast.loading("Entrando...");

      if (!email || !pwd) {
        throw new Error("Preencha corretamente os campos.");
      }

      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pwd }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro de autenticação.');
      }

      const redirectTo = redirect || "/vehicles";

      router.push(redirectTo);

    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
          duration: 2000,
        });
      } else {
        toast.error("Erro inesperado", {
          duration: 2000,
        });
      }

    } finally {
      setLoading(false);

      if (toastId) {
        toast.dismiss(toastId);
      }
    }
  };

  return (
    <div className="flex flex-col items-center h-screen py-5 px-3">

      <div
        className="w-[60vh] my-auto flex flex-col h-[90vh] rounded-md px-[10vh] py-[3vh] justify-center items-center bg-[var(--background)]"
        style={{
          filter: "drop-shadow(-6px 4px 6.8px rgba(0, 0, 0, 0.25))"
        }}
      >

        <div className="flex flex-col gap-1 w-full items-center justify-center">

          <div className="flex flex-col text-center justify-center items-center mb-5">
            <Image width={150} height={150} src="/logo.svg" alt="logo faceplate" />
            <p className="text-sm">
              Tecnologia e proteção para sua casa, em um só lugar.
            </p>
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
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="text-sm w-30 px-4 py-2 cursor-pointer text-center justify-center rounded bg-[var(--primary)] text-white hover:opacity-80 flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Entrando...' : (
              <>
                Entrar
                <LogIn size={18} />
              </>
            )}
          </button>
        </div>

        <div className="text-center" style={{ marginTop: "auto" }}>
          <p className="text-xs">
            Não possui uma conta?{" "}
            <strong>
              <Link href="/signin"
                className="ml-1 text-[var(--primary)] font-semibold hover:underline"
              >
                Cadastre-se
              </Link>
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}