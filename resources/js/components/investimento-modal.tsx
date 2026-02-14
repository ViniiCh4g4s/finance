import { useState, useEffect } from "react";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export interface InvestimentoFormData {
    produto: string;
    empresa: string;
    valor: string;
    quantidade: string;
    tipoAtivo: string;
    provento: string;
    frequencia: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: InvestimentoFormData) => void;
    initialData?: InvestimentoFormData;
    onDelete?: () => void;
}

const TIPOS = ["Ação Brasileira", "Ação Internacional", "Fundo Imobiliário", "ETF", "Renda Fixa", "Criptomoeda", "Outros"];
const FREQUENCIAS = ["Mensal", "Trimestral", "Semestral", "Anual"];

const empty: InvestimentoFormData = { produto: "", empresa: "", valor: "", quantidade: "", tipoAtivo: "", provento: "", frequencia: "" };

const inputCls = "w-full h-9 px-3 rounded-md border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-400 bg-white";

export default function InvestimentoModal({ open, onClose, onSubmit, initialData, onDelete }: Props) {
    const [form, setForm] = useState<InvestimentoFormData>(empty);
    const sf = (k: keyof InvestimentoFormData, v: string) => setForm(p => ({ ...p, [k]: v }));
    const editing = !!initialData;

    useEffect(() => {
        if (open) setForm(initialData ?? empty);
    }, [open]);

    const handleClose = () => { setForm(empty); onClose(); };

    const handleSubmit = () => {
        if (!form.produto || !form.valor || !form.quantidade) return;
        onSubmit(form);
        setForm(empty);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ animation: "fi .15s ease" }}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative bg-white rounded-xl shadow-2xl border border-zinc-200 w-full max-w-lg mx-4" style={{ animation: "si .2s ease" }}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
                    <h3 className="text-base font-semibold text-zinc-900">{editing ? "Editar Investimento" : "Novo Investimento"}</h3>
                    <button onClick={handleClose} className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="px-6 py-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-zinc-700">Produto (Ticker)</label>
                            <input placeholder="Ex: ITSA4, KNRI11..." value={form.produto} onChange={e => sf("produto", e.target.value)} className={inputCls} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-zinc-700">Empresa</label>
                            <input placeholder="Ex: Itaúsa..." value={form.empresa} onChange={e => sf("empresa", e.target.value)} className={inputCls} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-zinc-700">Valor Unitário (R$)</label>
                            <input type="number" step="0.01" placeholder="0,00" value={form.valor} onChange={e => sf("valor", e.target.value)} className={inputCls} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-zinc-700">Quantidade</label>
                            <input type="number" step="1" placeholder="0" value={form.quantidade} onChange={e => sf("quantidade", e.target.value)} className={inputCls} />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-zinc-700">Tipo de Ativo</label>
                        <Combobox items={TIPOS} value={form.tipoAtivo || null} onValueChange={val => sf("tipoAtivo", val ?? "")}>
                            <ComboboxInput placeholder="Selecione..." className="w-full" />
                            <ComboboxContent>
                                <ComboboxEmpty>Nenhum item encontrado.</ComboboxEmpty>
                                <ComboboxList>
                                    {item => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-zinc-700">Provento (R$)</label>
                            <input type="number" step="0.01" placeholder="0,00" value={form.provento} onChange={e => sf("provento", e.target.value)} className={inputCls} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-zinc-700">Frequência</label>
                            <Combobox items={FREQUENCIAS} value={form.frequencia || null} onValueChange={val => sf("frequencia", val ?? "")}>
                                <ComboboxInput placeholder="Selecione..." className="w-full" />
                                <ComboboxContent>
                                    <ComboboxEmpty>Nenhum item encontrado.</ComboboxEmpty>
                                    <ComboboxList>
                                        {item => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </div>
                    </div>
                    <div className={`pt-1 flex gap-3 ${editing ? "" : "flex-col"}`}>
                        {editing && onDelete && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button className="h-10 px-4 rounded-md border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 active:bg-red-100 transition-colors">
                                        Excluir
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Excluir registro?</AlertDialogTitle>
                                        <AlertDialogDescription>Essa ação não pode ser desfeita. O registro será removido permanentemente.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={onDelete}>Excluir</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                        <button onClick={handleSubmit} className="flex-1 h-10 rounded-md bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 active:bg-zinc-700 transition-colors">
                            {editing ? "Salvar" : "Adicionar Investimento"}
                        </button>
                    </div>
                </div>
            </div>
            <style>{`@keyframes fi{from{opacity:0}to{opacity:1}}@keyframes si{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
        </div>
    );
}
