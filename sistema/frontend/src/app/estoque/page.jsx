"use client";
import React, { useEffect, useState } from 'react';
import CardProduto from '../../components/CardProduto';
import { API_BASE_URL, formatarDataBR } from "@/lib/utils";

export default function Estoque() {
  const [produtos, setProdutos] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [acao, setAcao] = useState(null); // entrada, saida, editar, excluir
  const [quantidade, setQuantidade] = useState("");
  const [editForm, setEditForm] = useState({ nome: '', descricao: '', estoqueMinimo: '' });

  async function fetchProdutos() {
    setLoading(true);
    setMensagem("");
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`${API_BASE_URL}/api/produtos${q}`);
      const json = await res.json();
      if (json.sucesso) {
        const ajustados = json.dados.map(p => ({
          ...p,
          dataValidadeBR: formatarDataBR(p.dataValidade)
        }));
        setProdutos(ajustados);
      } else {
        console.error('Erro ao buscar produtos', json);
        setMensagem(json.mensagem || json.erro || 'Não foi possível carregar os produtos.');
      }
    } catch (err) {
      console.error(err);
      setMensagem('Erro de comunicação com o servidor.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProdutos();
  }, []);

  function abrirMovimentacao(produto, tipo) {
    setSelectedProduto(produto);
    setAcao(tipo);
    setQuantidade("");
    setMensagem("");
  }

  function abrirEdicao(produto) {
    setSelectedProduto(produto);
    setAcao('editar');
    setEditForm({
      nome: produto.nome || '',
      descricao: produto.descricao || '',
      estoqueMinimo: String(produto.estoqueMinimo ?? produto.estoque_minimo ?? ''),
    });
    setMensagem("");
  }

  function abrirExclusao(produto) {
    setSelectedProduto(produto);
    setAcao('excluir');
    setMensagem("");
  }

  function fecharDialogo() {
    setSelectedProduto(null);
    setAcao(null);
    setQuantidade("");
    setEditForm({ nome: '', descricao: '', estoqueMinimo: '' });
  }

  async function realizarMovimentacao(idProduto, tipo, quantidade) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/produtos/${idProduto}/movimentacoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ tipo, quantidade })
      });
      const json = await res.json();
      if (res.ok) {
        if (json.dados && json.dados.alerta) {
          setMensagem(json.dados.mensagem_alerta || 'Produto abaixo do estoque mínimo');
        } else {
          setMensagem('Movimentação registrada com sucesso.');
        }
        fetchProdutos();
      } else {
        setMensagem(json.mensagem || json.erro || 'Erro na movimentação');
        if (res.status === 401) {
          localStorage.removeItem('token');
        }
      }
    } catch (err) {
      console.error(err);
      setMensagem('Erro ao comunicar com o servidor');
    }
  }

  async function salvarMovimentacao(e) {
    e.preventDefault();
    if (!selectedProduto || !acao) return;
    const qtd = parseInt(quantidade);
    if (isNaN(qtd) || qtd <= 0) {
      setMensagem('Informe uma quantidade válida.');
      return;
    }
    await realizarMovimentacao(selectedProduto.idProduto || selectedProduto.id || selectedProduto.ID, acao, qtd);
    fecharDialogo();
  }

  async function salvarEdicao(e) {
    e.preventDefault();
    if (!selectedProduto) return;
    const id = selectedProduto.idProduto || selectedProduto.id || selectedProduto.ID;

    try {
      const token = localStorage.getItem('token');
      const body = {
        nome: editForm.nome,
        descricao: editForm.descricao,
        estoqueMinimo: editForm.estoqueMinimo ? parseInt(editForm.estoqueMinimo) : undefined
      };

      const res = await fetch(`${API_BASE_URL}/api/produtos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body)
      });

      const json = await res.json();
      if (res.ok) {
        setMensagem(json.mensagem || 'Produto atualizado com sucesso');
        fetchProdutos();
      } else {
        setMensagem(json.mensagem || json.erro || 'Erro ao atualizar produto');
        if (res.status === 401) localStorage.removeItem('token');
      }
    } catch (err) {
      console.error(err);
      setMensagem('Erro ao comunicar com o servidor');
    } finally {
      fecharDialogo();
    }
  }

  async function confirmarExclusao() {
    if (!selectedProduto) return;
    const id = selectedProduto.idProduto || selectedProduto.id || selectedProduto.ID;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/produtos/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const json = await res.json();
      if (res.ok) {
        setMensagem(json.mensagem || 'Produto excluído');
        fetchProdutos();
      } else {
        setMensagem(json.mensagem || json.erro || 'Erro ao excluir produto');
        if (res.status === 401) localStorage.removeItem('token');
      }
    } catch (err) {
      console.error(err);
      setMensagem('Erro ao comunicar com o servidor');
    } finally {
      fecharDialogo();
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-600 font-semibold">Estoque</p>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-3xl font-semibold">Visão geral dos produtos</h2>
          <span className="text-sm text-zinc-500">Total listado: {produtos.length}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1 flex gap-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome ou descrição"
            className="border p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={e => { if (e.key === 'Enter') fetchProdutos(); }}
          />
          <button onClick={fetchProdutos} className="px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700">Buscar</button>
          <button onClick={() => { setSearch(''); fetchProdutos(); }} className="px-4 py-3 rounded-xl border">Limpar</button>
        </div>
      </div>

      {mensagem && <p className="text-sm text-blue-800 bg-blue-50 border border-blue-100 rounded-xl p-3">{mensagem}</p>}

      {loading ? <p>Carregando...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {produtos.map(p => (
            <CardProduto
              key={p.id || p.id_produto || p.ID}
              produto={p}
              onEntrada={() => abrirMovimentacao(p, 'entrada')}
              onSaida={() => abrirMovimentacao(p, 'saida')}
              onEdit={() => abrirEdicao(p)}
              onDelete={() => abrirExclusao(p)}
            />
          ))}
          {!produtos.length && <p className="text-zinc-500">Nenhum produto encontrado.</p>}
        </div>
      )}

      {selectedProduto && acao && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-600 font-semibold">{acao}</p>
                <h3 className="text-xl font-semibold">{selectedProduto.nome}</h3>
              </div>
              <button onClick={fecharDialogo} className="text-sm text-zinc-500 hover:text-zinc-800">Fechar</button>
            </div>

            {acao === 'entrada' || acao === 'saida' ? (
              <form className="space-y-3" onSubmit={salvarMovimentacao}>
                <label className="space-y-1 text-sm font-medium text-zinc-800">
                  <span>Quantidade</span>
                  <input
                    type="number"
                    min="1"
                    value={quantidade}
                    onChange={e => setQuantidade(e.target.value)}
                    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </label>
                <p className="text-xs text-zinc-500">Estoque atual: {selectedProduto.estoqueAtual} • Mínimo: {selectedProduto.estoqueMinimo}</p>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={fecharDialogo} className="px-4 py-2 rounded-xl border">Cancelar</button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">Confirmar</button>
                </div>
              </form>
            ) : null}

            {acao === 'editar' ? (
              <form className="space-y-3" onSubmit={salvarEdicao}>
                <div className="grid grid-cols-1 gap-3">
                  <label className="space-y-1 text-sm font-medium text-zinc-800">
                    <span>Nome</span>
                    <input
                      value={editForm.nome}
                      onChange={e => setEditForm({ ...editForm, nome: e.target.value })}
                      className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </label>
                  <label className="space-y-1 text-sm font-medium text-zinc-800">
                    <span>Descrição</span>
                    <textarea
                      value={editForm.descricao}
                      onChange={e => setEditForm({ ...editForm, descricao: e.target.value })}
                      className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </label>
                  <label className="space-y-1 text-sm font-medium text-zinc-800">
                    <span>Estoque mínimo</span>
                    <input
                      type="number"
                      min="0"
                      value={editForm.estoqueMinimo}
                      onChange={e => setEditForm({ ...editForm, estoqueMinimo: e.target.value })}
                      className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={fecharDialogo} className="px-4 py-2 rounded-xl border">Cancelar</button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">Salvar</button>
                </div>
              </form>
            ) : null}

            {acao === 'excluir' ? (
              <div className="space-y-3">
                <p className="text-sm text-zinc-600">Deseja realmente excluir o produto <strong>{selectedProduto.nome}</strong>? Esta ação não pode ser desfeita.</p>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={fecharDialogo} className="px-4 py-2 rounded-xl border">Cancelar</button>
                  <button type="button" onClick={confirmarExclusao} className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700">Excluir</button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
