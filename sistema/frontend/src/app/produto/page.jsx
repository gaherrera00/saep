"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "../../components/RequireAuth";

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

  // Formata YYYY-MM-DD para DD/MM/YYYY
  function formatarDataBR(data) {
    if (!data) return "-";
    const d = String(data).slice(0, 10);
    const [ano, mes, dia] = d.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  async function carregarProdutos() {
    setLoadingTable(true);

    try {
      const res = await fetch("http://localhost:3001/api/produtos");
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
      const res = await fetch("http://localhost:3001/api/produtos", {
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
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl mb-4">Novo Produto</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 border p-4 rounded-md mb-10">
          <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome" className="border p-2 rounded" />
          <input value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descrição" className="border p-2 rounded" />
          <input value={unidadeMedida} onChange={e => setUnidadeMedida(e.target.value)} placeholder="Unidade de Medida" className="border p-2 rounded" />
          <input value={estoqueMinimo} onChange={e => setEstoqueMinimo(e.target.value)} placeholder="Estoque mínimo" className="border p-2 rounded" />
          <input value={estoqueAtual} onChange={e => setEstoqueAtual(e.target.value)} placeholder="Estoque atual" className="border p-2 rounded" />
          <input value={dataValidade} onChange={e => setDataValidade(e.target.value)} type="date" className="border p-2 rounded" />

          <button type="submit" disabled={loadingForm} className="px-4 py-2 rounded bg-blue-600 text-white">
            {loadingForm ? "Salvando..." : "Salvar"}
          </button>
        </form>

        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

        {loadingTable ? (
          <p>Carregando...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-zinc-100">
                  <th className="px-3 py-2 border">ID</th>
                  <th className="px-3 py-2 border">Nome</th>
                  <th className="px-3 py-2 border">Descrição</th>
                  <th className="px-3 py-2 border">Unidade</th>
                  <th className="px-3 py-2 border">Estoque</th>
                  <th className="px-3 py-2 border">Mínimo</th>
                  <th className="px-3 py-2 border">Validade</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((p) => (
                  <tr key={p.idProduto || p.id}>
                    <td className="px-3 py-2 border">{p.idProduto || p.id}</td>
                    <td className="px-3 py-2 border">{p.nome}</td>
                    <td className="px-3 py-2 border">{p.descricao}</td>
                    <td className="px-3 py-2 border">{p.unidadeMedida}</td>
                    <td className="px-3 py-2 border">{p.estoqueAtual}</td>
                    <td className="px-3 py-2 border">{p.estoqueMinimo}</td>
                    <td className="px-3 py-2 border">{formatarDataBR(p.dataValidade)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
