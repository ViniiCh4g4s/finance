import { useState } from "react";

export interface DespesaFormData {
    descricao: string;
    categoria: string;
    valor: string;
    data: string;
    forma: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: DespesaFormData) => void;
}

const CATEGORIAS = ["Casa","Assinaturas","Transporte","Farmácia e Saúde","Mercado","Alimentação","Entretenimento","Shopping","Utilidades","Outros"] as const;
const FORMAS = ["Pix","Boleto","Dinheiro","Cartão de Débito","Cartão de Crédito Itaú","Cartão de Crédito Nubank","Cartão de Crédito Nubank PJ"] as const;

const empty: DespesaFormData = { descricao: "", categoria: "", valor: "", data: "", forma: "" };

const inputCls = "w-full h-9 px-3 rounded-md border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-400 bg-white";

export default function DespesaVariavelModal({ open, onClose, onSubmit }: Props) {
    const [form, setForm] = useState<DespesaFormData>(empty);
    const sf = (k: keyof DespesaFormData, v: string) => setForm(p => ({ ...p, [k]: v }));

    const handleClose = () => {
        setForm(empty);
        onClose();
    };

    const handleSubmit = () => {
        if (!form.descricao || !form.valor) return;
        onSubmit(form);
        setForm(empty);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ animation: "fi .15s ease" }}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative bg-white rounded-xl shadow-2xl border border-zinc-200 w-full max-w-lg mx-4" style={{ animation: "si .2s ease" }}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
                    <h3 className="text-base font-semibold text-zinc-900">Nova Despesa Variável</h3>
                    <button onClick={handleClose} className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="px-6 py-5 space-y-4">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-zinc-700">Descrição</label>
                        <input placeholder="Ex: Uber, Farmácia..." value={form.descricao} onChange={e => sf("descricao", e.target.value)} className={inputCls} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-zinc-700">Categoria</label>
                            <select value={form.categoria} onChange={e => sf("categoria", e.target.value)} className={inputCls}>
                                <option value="">Selecione...</option>
                                {CATEGORIAS.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-zinc-700">Valor (R$)</label>
                            <input type="number" step="0.01" placeholder="0,00" value={form.valor} onChange={e => sf("valor", e.target.value)} className={inputCls} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-zinc-700">Data</label>
                            <input placeholder="dd/mm/aaaa" value={form.data} onChange={e => sf("data", e.target.value)} className={inputCls} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-zinc-700">Forma de Pagamento</label>
                            <select value={form.forma} onChange={e => sf("forma", e.target.value)} className={inputCls}>
                                <option value="">Selecione...</option>
                                {FORMAS.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="pt-1">
                        <button onClick={handleSubmit} className="w-full h-10 rounded-md bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 active:bg-zinc-700 transition-colors">
                            Adicionar Despesa
                        </button>
                    </div>
                </div>
            </div>
            <style>{`@keyframes fi{from{opacity:0}to{opacity:1}}@keyframes si{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
        </div>
    );
}
