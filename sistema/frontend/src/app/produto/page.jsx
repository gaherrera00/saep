"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "../../components/RequireAuth";
import { API_BASE_URL, formatarDataBR } from "@/lib/utils";

export default function ProdutoDashboard() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [unidadeMedida, setUnidadeMedida] = useState("");
  const [estoqueMinimo, setEstoqueMinimo] = useState("");
  const [estoqueAtual, setEstoqueAtual] = useState("");
  const [dataValidade, setDataValidade] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);

  const [produtos, setProdutos] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);

  const router = useRouter();

  async function carregarProdutos() {
    setLoadingTable(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/produtos`);
      const json = await res.json();
      if (json.sucesso) setProdutos(json.dados || []);
    } finally {
      setLoadingTable(false);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  // Envia criação de produto
  async function handleSubmit(e) {
    e.preventDefault();
    setLoadingForm(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/produtos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          nome,
          descricao,
          unidadeMedida,
          estoqueMinimo: parseInt(estoqueMinimo),
          estoqueAtual: parseInt(estoqueAtual),
          dataValidade: dataValidade || null,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        // limpa form
        setNome("");
        setDescricao("");
        setUnidadeMedida("");
        setEstoqueMinimo("");
        setEstoqueAtual("");
        setDataValidade("");

        // atualiza tabela sem recarregar página
        carregarProdutos();
      } else {
        alert(json.mensagem || json.erro || "Erro ao criar produto");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com servidor");
    } finally {
      setLoadingForm(false);
    }
  }

  return (
    <RequireAuth>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-600 font-semibold">Produtos</p>
          <h2 className="text-3xl font-semibold">Cadastrar novo item</h2>
          <p className="text-sm text-zinc-500">Preencha os campos abaixo para manter o estoque sempre atualizado.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-5 rounded-2xl bg-white shadow-sm">
          <label className="space-y-1 text-sm font-medium text-zinc-800">
            <span>Nome</span>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Arroz 1kg" className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </label>
          <label className="space-y-1 text-sm font-medium text-zinc-800">
            <span>Unidade de medida</span>
            <input value={unidadeMedida} onChange={e => setUnidadeMedida(e.target.value)} placeholder="Pacote, caixa..." className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </label>
          <label className="space-y-1 text-sm font-medium text-zinc-800 md:col-span-2">
            <span>Descrição</span>
            <textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Detalhes do produto" className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
          </label>
          <label className="space-y-1 text-sm font-medium text-zinc-800">
            <span>Estoque mínimo</span>
            <input value={estoqueMinimo} onChange={e => setEstoqueMinimo(e.target.value)} placeholder="0" type="number" min="0" className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </label>
          <label className="space-y-1 text-sm font-medium text-zinc-800">
            <span>Estoque inicial</span>
            <input value={estoqueAtual} onChange={e => setEstoqueAtual(e.target.value)} placeholder="0" type="number" min="0" className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </label>
          <label className="space-y-1 text-sm font-medium text-zinc-800">
            <span>Validade</span>
            <input value={dataValidade} onChange={e => setDataValidade(e.target.value)} type="date" className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </label>

          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={loadingForm} className="px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
              {loadingForm ? "Salvando..." : "Salvar produto"}
            </button>
          </div>
        </form>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Produtos cadastrados</h2>
          {loadingTable ? (
            <p>Carregando...</p>
          ) : (
            <div className="overflow-x-auto border rounded-2xl bg-white shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="bg-zinc-50 text-left">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Descrição</th>
                    <th className="px-4 py-3">Unidade</th>
                    <th className="px-4 py-3">Estoque</th>
                    <th className="px-4 py-3">Mínimo</th>
                    <th className="px-4 py-3">Validade</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((p) => (
                    <tr key={p.idProduto || p.id} className="border-t">
                      <td className="px-4 py-3">{p.idProduto || p.id}</td>
                      <td className="px-4 py-3 font-medium">{p.nome}</td>
                      <td className="px-4 py-3 text-zinc-600">{p.descricao}</td>
                      <td className="px-4 py-3">{p.unidadeMedida || '-'}</td>
                      <td className="px-4 py-3">{p.estoqueAtual}</td>
                      <td className="px-4 py-3">{p.estoqueMinimo}</td>
                      <td className="px-4 py-3">{formatarDataBR(p.dataValidade)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
