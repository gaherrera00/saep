"use client";
import React, { useEffect, useState } from 'react';
import CardProduto from '../../components/CardProduto';

export default function Estoque() {
  const [produtos, setProdutos] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Formata YYYY-MM-DD para DD/MM/YYYY
  function formatarDataBR(data) {
    if (!data) return "-";
    const d = String(data).slice(0, 10);
    const [ano, mes, dia] = d.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  async function fetchProdutos() {
    setLoading(true);
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`http://localhost:3001/api/produtos${q}`);
      const json = await res.json();
      if (json.sucesso) {
        const ajustados = json.dados.map(p => ({
          ...p,
          dataValidadeBR: formatarDataBR(p.dataValidade)
        }));
        setProdutos(ajustados);
      } else {
        console.error('Erro ao buscar produtos', json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProdutos();
  }, []);

  function handleEntrada(produto) {
    const qtd = prompt(`Quantidade de entrada para ${produto.nome}:`);
    if (!qtd) return;
    realizarMovimentacao(produto.idProduto || produto.id || produto.ID, 'entrada', qtd);
  }

  function handleSaida(produto) {
    const qtd = prompt(`Quantidade de saída para ${produto.nome}:`);
    if (!qtd) return;
    realizarMovimentacao(produto.idProduto || produto.id || produto.ID, 'saida', qtd);
  }

  async function handleEdit(produto) {
    const id = produto.idProduto || produto.id || produto.ID;
    const novoNome = prompt('Nome do produto:', produto.nome || '');
    if (novoNome === null) return; // cancelado
    const novaDescricao = prompt('Descrição:', produto.descricao || produto.descricao || '');
    if (novaDescricao === null) return;
    const novoEstoqueMin = prompt('Estoque mínimo (número):', String(produto.estoqueMinimo ?? produto.estoque_minimo ?? 0));
    if (novoEstoqueMin === null) return;

    try {
      const token = localStorage.getItem('token');
      const body = {
        nome: novoNome,
        descricao: novaDescricao,
        estoque_minimo: parseInt(novoEstoqueMin)
      };

      const res = await fetch(`http://localhost:3001/api/produtos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body)
      });

      const json = await res.json();
      if (res.ok) {
        alert(json.mensagem || 'Produto atualizado com sucesso');
        fetchProdutos();
      } else {
        alert(json.mensagem || json.erro || 'Erro ao atualizar produto');
        if (res.status === 401) localStorage.removeItem('token');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao comunicar com o servidor');
    }
  }

  async function handleDelete(produto) {
    const id = produto.idProduto || produto.id || produto.ID;
    if (!confirm(`Confirma exclusão do produto "${produto.nome}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/produtos/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const json = await res.json();
      if (res.ok) {
        alert(json.mensagem || 'Produto excluído');
        fetchProdutos();
      } else {
        alert(json.mensagem || json.erro || 'Erro ao excluir produto');
        if (res.status === 401) localStorage.removeItem('token');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao comunicar com o servidor');
    }
  }

  async function realizarMovimentacao(idProduto, tipo, quantidade) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/produtos/${idProduto}/movimentacoes`, {
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
          alert(json.dados.mensagem_alerta || 'Produto abaixo do estoque mínimo');
        }
        fetchProdutos();
      } else {
        alert(json.mensagem || json.erro || 'Erro na movimentação');
        if (res.status === 401) {
          localStorage.removeItem('token');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao comunicar com o servidor');
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Gestão de Estoque</h2>

      <div className="mb-4 flex gap-2">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome" className="border p-2 rounded" />
        <button onClick={fetchProdutos} className="px-3 py-2 rounded bg-blue-600 text-white">Buscar</button>
        <button onClick={() => { setSearch(''); fetchProdutos(); }} className="px-3 py-2 rounded border">Limpar</button>
      </div>

      {loading ? <p>Carregando...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {produtos.map(p => (
            <CardProduto
              key={p.id || p.id_produto || p.ID}
              produto={p}
              onEntrada={handleEntrada}
              onSaida={handleSaida}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
