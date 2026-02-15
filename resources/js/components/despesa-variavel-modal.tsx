import { useState, useEffect, useMemo } from "react";
import { format, parse, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Spinner } from "@/components/ui/spinner";
import CurrencyInput from "@/components/currency-input";

export interface DespesaFormData {
    descricao: string;
    categoria: string;
    valor: string;
    data: string;
    forma: string;
    balanco: string;
    parcelas: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: DespesaFormData) => void;
    initialData?: DespesaFormData;
    onDelete?: () => void;
    categorias?: string[];
    formas?: string[];
    loading?: boolean;
}

const CATEGORIAS_DEFAULT = ["Casa", "Assinaturas", "Transporte", "Farmácia e Saúde", "Mercado", "Alimentação", "Entretenimento", "Shopping", "Utilidades", "Outros"];
const FORMAS_DEFAULT = ["Pix", "Boleto", "Dinheiro", "Cartão de Débito", "Cartão de Crédito Itaú", "Cartão de Crédito Nubank", "Cartão de Crédito Nubank PJ"];
const PARCELAS = ["1x", "2x", "3x", "4x", "5x", "6x", "7x", "8x", "9x", "10x", "11x", "12x"];

const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const empty: DespesaFormData = { descricao: "", categoria: "", valor: "", data: "", forma: "", balanco: "", parcelas: "1" };

const inputCls = "w-full h-9 px-3 rounded-md border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-400 bg-white";

const toDate = (s: string): Date | undefined => {
    if (!s) return undefined;
    const d = parse(s, "dd/MM/yyyy", new Date());
    return isValid(d) ? d : undefined;
};
const toStr = (d: Date | undefined): string => d ? format(d, "dd/MM/yyyy") : "";

function generateBalancoOptions(): { label: string; value: string }[] {
    const now = new Date();
    const options: { label: string; value: string }[] = [];
    for (let offset = -3; offset <= 8; offset++) {
        const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = d.getFullYear();
        options.push({ label: `${MESES[d.getMonth()]} ${yyyy}`, value: `${mm}/${yyyy}` });
    }
    return options;
}

function balancoFromDate(dateStr: string): string {
    const d = parse(dateStr, "dd/MM/yyyy", new Date());
    if (!isValid(d)) return "";
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${mm}/${d.getFullYear()}`;
}

function balancoLabel(value: string): string {
    if (!value) return "";
    const [mm, yyyy] = value.split("/");
    const idx = parseInt(mm, 10) - 1;
    if (idx < 0 || idx > 11) return value;
    return `${MESES[idx]} ${yyyy}`;
}

export default function DespesaVariavelModal({ open, onClose, onSubmit, initialData, onDelete, categorias, formas, loading }: Props) {
    const [form, setForm] = useState<DespesaFormData>(empty);
    const sf = (k: keyof DespesaFormData, v: string) => setForm(p => ({ ...p, [k]: v }));
    const editing = !!initialData;
    const [popData, setPopData] = useState(false);

    const balancoOptions = useMemo(() => generateBalancoOptions(), []);
    const balancoLabels = useMemo(() => balancoOptions.map(o => o.label), [balancoOptions]);

    const isCredito = form.forma.toLowerCase().includes("crédito");

    useEffect(() => {
        if (open) {
            const init = initialData ?? empty;
            setForm({ ...init, parcelas: init.parcelas || "1" });
        }
    }, [open]);

    // Auto-set balanço when data changes (only if balanço is empty or matches previous auto-set)
    useEffect(() => {
        if (form.data && !editing) {
            const auto = balancoFromDate(form.data);
            if (auto && !form.balanco) {
                sf("balanco", auto);
            }
        }
    }, [form.data]);

    // Reset parcelas when forma changes away from crédito
    useEffect(() => {
        if (!isCredito) {
            sf("parcelas", "1");
        }
    }, [form.forma]);

    const handleClose = () => { if (loading) return; setForm(empty); onClose(); };

    const handleSubmit = () => {
        if (!form.descricao || !form.valor || !form.balanco) return;
        onSubmit(form);
    };

    if (!open) return null;

    const selectedBalancoLabel = balancoLabel(form.balanco);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ animation: "fi .15s ease" }}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative bg-white rounded-xl shadow-2xl border border-zinc-200 w-full max-w-lg mx-4" style={{ animation: "si .2s ease" }}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
                    <h3 className="text-base font-semibold text-zinc-900">{editing ? "Editar Despesa Variável" : "Nova Despesa Variável"}</h3>
                    <button onClick={handleClose} disabled={loading} className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors disabled:opacity-50">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                </div>
                <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} className="px-6 py-5 space-y-4">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-zinc-700">Descrição</label>
                        <input placeholder="Ex: Uber, Farmácia..." value={form.descricao} onChange={e => sf("descricao", e.target.value)} className={inputCls} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-zinc-700">Categoria</label>
                            <Combobox items={categorias ?? CATEGORIAS_DEFAULT} value={form.categoria || null} onValueChange={val => sf("categoria", val ?? "")}>
                                <ComboboxInput placeholder="Selecione..." className="w-full" />
                                <ComboboxContent>
                                    <ComboboxEmpty>Nenhum item encontrado.</ComboboxEmpty>
                                    <ComboboxList>
                                        {item => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-zinc-700">Valor (R$)</label>
                            <CurrencyInput value={form.valor} onChange={v => sf("valor", v)} className={inputCls} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-zinc-700">Data</label>
                            <Popover open={popData} onOpenChange={setPopData}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" data-empty={!form.data} className="w-full h-9 justify-between text-left font-normal text-sm data-[empty=true]:text-muted-foreground">
                                        {form.data || <span>dd/mm/aaaa</span>}
                                        <ChevronDownIcon className="size-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={toDate(form.data)}
                                        onSelect={d => { sf("data", toStr(d)); setPopData(false); }}
                                        defaultMonth={toDate(form.data)}
                                        locale={ptBR}
                                        captionLayout="dropdown"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-zinc-700">Forma de Pagamento</label>
                            <Combobox items={formas ?? FORMAS_DEFAULT} value={form.forma || null} onValueChange={val => sf("forma", val ?? "")}>
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
                    <div className={`grid gap-3 ${isCredito && !editing ? "grid-cols-2" : "grid-cols-1"}`}>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-zinc-700">Balanço (mês)</label>
                            <Combobox items={balancoLabels} value={selectedBalancoLabel || null} onValueChange={val => {
                                const opt = balancoOptions.find(o => o.label === val);
                                sf("balanco", opt?.value ?? "");
                            }}>
                                <ComboboxInput placeholder="Selecione o mês..." className="w-full" />
                                <ComboboxContent>
                                    <ComboboxEmpty>Nenhum mês encontrado.</ComboboxEmpty>
                                    <ComboboxList>
                                        {item => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </div>
                        {isCredito && !editing && (
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-zinc-700">Parcelas</label>
                                <Combobox items={PARCELAS} value={`${form.parcelas}x`} onValueChange={val => sf("parcelas", val ? val.replace("x", "") : "1")}>
                                    <ComboboxInput placeholder="1x" className="w-full" />
                                    <ComboboxContent>
                                        <ComboboxEmpty>Nenhum item encontrado.</ComboboxEmpty>
                                        <ComboboxList>
                                            {item => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                            </div>
                        )}
                    </div>
                    <div className="pt-1 flex gap-3">
                        {editing && onDelete && (
                            <button type="button" onClick={onDelete} disabled={loading} className="h-10 px-4 rounded-md border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 active:bg-red-100 transition-colors disabled:opacity-50">
                                Excluir
                            </button>
                        )}
                        <button type="submit" disabled={loading} className="flex-1 h-10 rounded-md bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 active:bg-zinc-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                            {loading ? <><Spinner className="size-4" />{editing ? " Salvando..." : " Adicionando..."}</> : editing ? "Salvar" : "Adicionar Despesa"}
                        </button>
                    </div>
                </form>
            </div>
            <style>{`@keyframes fi{from{opacity:0}to{opacity:1}}@keyframes si{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
        </div>
    );
}
