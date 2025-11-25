"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RequireAuth({ children }){
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }
    (async () => {
      try {
        const res = await fetch('http://localhost:3001/api/auth/perfil', {
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
