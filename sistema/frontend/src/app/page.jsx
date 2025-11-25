import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Sistema de Gestão de Estoque</h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">Controle de produtos, entradas e saídas com autenticação segura.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link href="/estoque" className="rounded-2xl border p-6 hover:shadow-md transition bg-white dark:bg-zinc-900">
            <h3 className="text-lg font-semibold">Gestão de Estoque</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Realize entradas e saídas de produtos.</p>
          </Link>
          <Link href="/produto" className="rounded-2xl border p-6 hover:shadow-md transition bg-white dark:bg-zinc-900">
            <h3 className="text-lg font-semibold">Cadastro de Produto</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Registre novos produtos no sistema.</p>
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-4">
          <Link href="/login" className="px-5 py-2 rounded bg-blue-600 text-white">Fazer Login</Link>
          <Link href="/dashboard" className="px-5 py-2 rounded border">Acessar Dashboard</Link>
        </div>
      </section>
    </div>
  );
}
