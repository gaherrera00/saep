"use client";
import React from 'react';

export default function CardProduto({ produto, onEntrada, onSaida, onEdit, onDelete }) {
  const abaixoMinimo = (produto.estoqueAtual ?? produto.estoque_atual ?? 0) < (produto.estoqueMinimo ?? produto.estoque_minimo ?? 0);

  // usa dataValidadeBR se existir, senão '-' 
  const validadeTexto = produto.dataValidadeBR || produto.dataValidade || '-';

  const estoqueAtual = produto.estoqueAtual ?? produto.estoque_atual ?? 0;
  const estoqueMinimo = produto.estoqueMinimo ?? produto.estoque_minimo ?? 0;

  return (
    <div className={`border p-4 rounded-md ${abaixoMinimo ? 'bg-red-50 border-red-300' : 'bg-white'}`}>
      <h3 className="font-semibold">{produto.nome}</h3>
      <p className="text-sm text-zinc-600">{produto.descricao}</p>
      <div className="mt-2 text-sm flex gap-4">
        <div>Estoque: <strong>{estoqueAtual}</strong></div>
        <div>Mínimo: <strong>{estoqueMinimo}</strong></div>
        <div>Validade: <strong>{validadeTexto}</strong></div>
      </div>
      {abaixoMinimo && <div className="mt-2 text-xs text-red-600">⚠ Produto abaixo do estoque mínimo</div>}
      <div className="mt-3 flex gap-2 flex-wrap">
        <button onClick={() => onEntrada && onEntrada(produto)} className="px-3 py-1 rounded bg-green-600 text-white">Entrada</button>
        <button onClick={() => onSaida && onSaida(produto)} className="px-3 py-1 rounded bg-red-600 text-white">Saída</button>
        <button onClick={() => onEdit && onEdit(produto)} className="px-3 py-1 rounded bg-yellow-500 text-white">Editar</button>
        <button onClick={() => onDelete && onDelete(produto)} className="px-3 py-1 rounded bg-gray-300 text-black">Excluir</button>
      </div>
    </div>
  );
}
