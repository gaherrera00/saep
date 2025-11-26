"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from "@/lib/utils";

export default function Header() {
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  function getCookie(name) {
    if (typeof document === "undefined") return null;
    const value = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))?.split("=")[1];
    return value || null;
  }

  useEffect(() => {
    const token = localStorage.getItem('token') || getCookie('token');
    if (!token) return;

    // buscar perfil
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/perfil`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          // token inválido
          localStorage.removeItem('token');
          setUsuario(null);
          return;
        }
        const json = await res.json();
        if (json.sucesso) setUsuario(json.dados);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario_nome');
    document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
    setUsuario(null);
    router.push('/login');
  }

  return (
    <header className="w-full bg-white shadow-sm p-4 flex items-center justify-between">
      <nav className="flex items-center gap-4">
        <Link href="/">Home</Link>
        <Link href="/produto">Cadastro de Produto</Link>
        <Link href="/estoque">Gestão de Estoque</Link>
      </nav>

      <div>
        {usuario ? (
          <div className="flex items-center gap-3">
            <span>Olá, <strong>{usuario.nome}</strong></span>
            <button onClick={handleLogout} className="px-3 py-1 rounded bg-red-600 text-white">Logout</button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-3 py-1 rounded bg-blue-600 text-white">Login</Link>
          </div>
        )}
      </div>
    </header>
  );
}
