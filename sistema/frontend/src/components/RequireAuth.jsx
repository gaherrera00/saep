"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from "@/lib/utils";

export default function RequireAuth({ children }){
  const [ready, setReady] = useState(false);
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
    if (!token) {
      router.replace('/login');
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/perfil`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          localStorage.removeItem('token');
          router.replace('/login');
          return;
        }
        setReady(true);
      } catch (err) {
        router.replace('/login');
      }
    })();
  }, [router]);

  if (!ready) return null;
  return children;
}
