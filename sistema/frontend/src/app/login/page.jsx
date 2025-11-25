"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:3001/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, senha }),
            });

            const data = await res.json();

            console.log("DADOS:", email, senha);

            if (!data.sucesso) {
                alert(data.mensagem || data.erro || "Erro no login");
                return;
            }

            localStorage.setItem("token", data.dados.token);

            if (data.dados.usuario) {
                localStorage.setItem("usuario_nome", data.dados.usuario.nome);
            }

            router.push("/estoque");
        } catch (error) {
            console.error(error);
            alert("Erro ao tentar fazer login");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl">
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        name="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring"
                    />

                    <input
                        name="senha"
                        type="password"
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        placeholder="Senha"
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring"
                    />

                    <button
                        type="submit"
                        className="w-full p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}
