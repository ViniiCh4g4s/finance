import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import IconPicker from "@/components/icon-picker";

export interface MetaFormData {
    nome: string;
    icone: string;
    valor: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: MetaFormData) => void;
    initialData?: MetaFormData;
    onDelete?: () => void;
    loading?: boolean;
}

const empty: MetaFormData = { nome: "", icone: "Gem", valor: "" };

const inputCls = "w-full h-9 px-3 rounded-md border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-400 bg-white";

export default function MetaModal({ open, onClose, onSubmit, initialData, onDelete, loading }: Props) {
    const [form, setForm] = useState<MetaFormData>(empty);
    const sf = (k: keyof MetaFormData, v: string) => setForm(p => ({ ...p, [k]: v }));
    const editing = !!initialData;

    useEffect(() => {
        if (open) setForm(initialData ?? empty);
    }, [open]);

    const handleClose = () => { if (loading) return; setForm(empty); onClose(); };

    const handleSubmit = () => {
        if (!form.nome || !form.valor) return;
        onSubmit(form);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ animation: "fi .15s ease" }}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative bg-white rounded-xl shadow-2xl border border-zinc-200 w-full max-w-lg mx-4" style={{ animation: "si .2s ease" }}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
                    <h3 className="text-base font-semibold text-zinc-900">{editing ? "Editar Meta" : "Nova Meta"}</h3>
                    <button onClick={handleClose} disabled={loading} className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors disabled:opacity-50">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="px-6 py-5 space-y-4">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-zinc-700">Nome</label>
                        <div className="flex gap-2">
                            <IconPicker value={form.icone} onChange={v => sf("icone", v)} disabled={loading} />
                            <input placeholder="Ex: Casamento, Imóvel..." value={form.nome} onChange={e => sf("nome", e.target.value)} className={inputCls} />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-zinc-700">Valor da Meta (R$)</label>
                        <input type="number" step="0.01" placeholder="0,00" value={form.valor} onChange={e => sf("valor", e.target.value)} className={inputCls} />
                    </div>
                    <div className="pt-1 flex gap-3">
                        {editing && onDelete && (
                            <button onClick={onDelete} disabled={loading} className="h-10 px-4 rounded-md border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 active:bg-red-100 transition-colors disabled:opacity-50">
                                Excluir
                            </button>
                        )}
                        <button onClick={handleSubmit} disabled={loading} className="flex-1 h-10 rounded-md bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 active:bg-zinc-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                            {loading ? <><Spinner className="size-4" />{editing ? " Salvando..." : " Adicionando..."}</> : editing ? "Salvar" : "Adicionar Meta"}
                        </button>
                    </div>
                </div>
            </div>
            <style>{`@keyframes fi{from{opacity:0}to{opacity:1}}@keyframes si{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
        </div>
    );
}
