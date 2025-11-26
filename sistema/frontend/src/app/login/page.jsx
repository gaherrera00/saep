"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { API_BASE_URL } from "@/lib/utils";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErro("");
        setCarregando(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, senha }),
            });

            const data = await res.json();

            if (!data.sucesso) {
                setErro(data.mensagem || data.erro || "Erro no login");
                return;
            }

            // salva o token em cookie e localStorage para o middleware e para os fetches client-side
            document.cookie = `token=${data.dados.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
            localStorage.setItem("token", data.dados.token);

            if (data.dados.usuario) {
                localStorage.setItem("usuario_nome", data.dados.usuario.nome);
            }
            const redirect = searchParams.get("redirect");
            const destino = redirect && redirect.startsWith("/") ? redirect : "/";
            router.push(destino);
        } catch (error) {
            console.error(error);
            setErro("Não foi possível conectar. Verifique sua conexão e tente novamente.");
        }
        finally {
            setCarregando(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-zinc-100">
                <div className="mb-6 text-center space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-blue-600 font-semibold">Acesso ao sistema</p>
                    <h1 className="text-3xl font-bold">Faça login</h1>
                    <p className="text-sm text-zinc-500">Use suas credenciais para acessar o painel de estoque.</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <label className="space-y-1 text-sm font-medium text-zinc-800">
                        <span className="block">Email</span>
                        <input
                            name="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoComplete="email"
                            required
                        />
                    </label>

                    <label className="space-y-1 text-sm font-medium text-zinc-800">
                        <span className="block">Senha</span>
                        <input
                            name="senha"
                            type="password"
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                            placeholder="••••••••"
                            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoComplete="current-password"
                            required
                        />
                    </label>

                    {erro && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3" role="alert">
                            {erro}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={carregando}
                        className="w-full p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {carregando ? "Entrando..." : "Entrar"}
                    </button>
                    <p className="text-xs text-center text-zinc-500">Dica: admin@produtos.com / 123456</p>
                </form>
            </div>
        </div>
    );
}
