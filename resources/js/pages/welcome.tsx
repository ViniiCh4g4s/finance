import { type ReactNode, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { logout } from "@/routes";
import { Gem, TrendingUp, Home, Briefcase, BarChart3, Wrench, GraduationCap, CreditCard, ShoppingCart, HeartPulse, Car, Hammer, Gamepad2, TrendingDown, UtensilsCrossed, ShoppingBag, Banknote, FileText, Zap } from "lucide-react";
import DespesaVariavelModal, { type DespesaFormData } from "@/components/despesa-variavel-modal";
import GanhoModal, { type GanhoFormData } from "@/components/ganho-modal";
import DespesaFixaModal, { type DespesaFixaFormData } from "@/components/despesa-fixa-modal";
import DividaModal, { type DividaFormData } from "@/components/divida-modal";
import InvestimentoModal, { type InvestimentoFormData } from "@/components/investimento-modal";

/* ── TYPES ─────────────────────────────────────────────────────────────────── */

interface BalancoMensal { mes: string; receita: number; despesa: number }
interface Ganho { id: number; descricao: string; fonte: string; data: string; valor: number; balanco: string }
interface DespesaFixa { id: number; descricao: string; categoria: string; valor: number; vencimento: string; status: string; dataPgto: string; forma: string; balanco: string }
interface DespesaVariavel { id: number; descricao: string; categoria: string; valor: number; data: string; balanco: string; forma: string }
interface Divida { id: number; descricao: string; destino: string; valor: number; vencimento: string; status: string; balanco: string }
interface Investimento { id: number; produto: string; empresa: string; valor: number; quantidade: number; valorTotal: number; tipoAtivo: string; provento: number; frequencia: string; balanco: string }
interface Meta { id: number; nome: string; icon: ReactNode; percent: number; valor: number; investido: number; faltante: number }
interface FonteRenda { nome: string; icon: ReactNode; percent: number; metaAnual: number; receitaAnual: number }
interface Categoria { nome: string; icon: ReactNode; pct: number; lim: number | null; desp: number }
interface FormaPagamento { nome: string; icon: ReactNode; pct: number; lim: number; desp: number }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Column<T = any> {
    key: string;
    label: string;
    align?: "right";
    render?: (row: T) => ReactNode;
}
interface FooterItem { label: string; value: string | number }

/* ── HELPERS ───────────────────────────────────────────────────────────────── */

const MONTHS = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"] as const;
const FULL = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"] as const;
const fmt = (v: number): string => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const toFull = (a: string): string => FULL[MONTHS.indexOf(a as typeof MONTHS[number])] || a;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const byMonth = <T extends Record<string, any>>(d: T[], f: keyof T, a: string): T[] => d.filter(r => r[f] === toFull(a));
let nid = 50;

const balMensal: BalancoMensal[] = [
    {mes:"Janeiro",receita:3000,despesa:1223.19},{mes:"Fevereiro",receita:3000,despesa:765.37},
    {mes:"Março",receita:3000,despesa:765.37},{mes:"Abril",receita:3000,despesa:2906.41},
    {mes:"Maio",receita:3000,despesa:1100},{mes:"Junho",receita:3000,despesa:890.5},
    {mes:"Julho",receita:3000,despesa:1450},{mes:"Agosto",receita:3000,despesa:980},
    {mes:"Setembro",receita:3000,despesa:1200},{mes:"Outubro",receita:3000,despesa:1050},
    {mes:"Novembro",receita:3000,despesa:1300},{mes:"Dezembro",receita:3000,despesa:2100},
];
const dataGanhos: Ganho[] = [
    {id:1,descricao:"Salário",fonte:"Trabalho",data:"05/01/2025",valor:2800,balanco:"Janeiro"},
    {id:2,descricao:"Manutenção Preventiva",fonte:"Manutenções",data:"03/01/2025",valor:200,balanco:"Janeiro"},
    {id:3,descricao:"Salário",fonte:"Trabalho",data:"05/02/2025",valor:2800,balanco:"Fevereiro"},
    {id:4,descricao:"Freelance",fonte:"Trabalho",data:"15/03/2025",valor:500,balanco:"Março"},
    {id:5,descricao:"Salário",fonte:"Trabalho",data:"05/03/2025",valor:2800,balanco:"Março"},
    {id:6,descricao:"Salário",fonte:"Trabalho",data:"05/04/2025",valor:2800,balanco:"Abril"},
    {id:7,descricao:"Dividendos KNRI11",fonte:"Investimentos",data:"15/04/2025",valor:1,balanco:"Abril"},
];
const dataFixas: DespesaFixa[] = [
    {id:1,descricao:"Luz",categoria:"Casa",valor:158,vencimento:"07/01/2025",status:"Pago",dataPgto:"05/01/2025",forma:"Pix",balanco:"Janeiro"},
    {id:2,descricao:"Internet",categoria:"Casa",valor:161.29,vencimento:"10/01/2025",status:"Pago",dataPgto:"08/01/2025",forma:"Pix",balanco:"Janeiro"},
    {id:3,descricao:"Luz",categoria:"Casa",valor:170,vencimento:"07/02/2025",status:"Pago",dataPgto:"05/02/2025",forma:"Pix",balanco:"Fevereiro"},
    {id:4,descricao:"Internet",categoria:"Casa",valor:161.29,vencimento:"10/02/2025",status:"Pago",dataPgto:"08/02/2025",forma:"Pix",balanco:"Fevereiro"},
    {id:5,descricao:"Luz",categoria:"Casa",valor:164.62,vencimento:"07/06/2025",status:"Pago",dataPgto:"05/06/2025",forma:"Pix",balanco:"Junho"},
    {id:6,descricao:"Internet",categoria:"Casa",valor:161.29,vencimento:"10/06/2025",status:"Pago",dataPgto:"05/06/2025",forma:"Pix",balanco:"Junho"},
];
const initVar: DespesaVariavel[] = [
    {id:1,descricao:"iCloud 2TB",categoria:"Assinaturas",valor:55,data:"28/01/2025",balanco:"Janeiro",forma:""},
    {id:2,descricao:"Moises",categoria:"Assinaturas",valor:9.9,data:"14/01/2025",balanco:"Janeiro",forma:""},
    {id:3,descricao:"Ração",categoria:"Casa",valor:164.62,data:"07/01/2025",balanco:"Janeiro",forma:""},
    {id:4,descricao:"Uber",categoria:"Transporte",valor:45,data:"12/02/2025",balanco:"Fevereiro",forma:"Cartão de Crédito Nubank"},
    {id:5,descricao:"Farmácia",categoria:"Farmácia e Saúde",valor:89.9,data:"20/03/2025",balanco:"Março",forma:"Pix"},
    {id:6,descricao:"Supermercado",categoria:"Mercado",valor:320,data:"10/04/2025",balanco:"Abril",forma:"Cartão de Débito"},
];
const dataDividas: Divida[] = [
    {id:1,descricao:"Cartão Tenda",destino:"Tenda Atacado",valor:400,vencimento:"11/06/2025",status:"Pendente",balanco:"Janeiro"},
    {id:2,descricao:"Ativos S.A",destino:"Banco do Brasil",valor:90.95,vencimento:"28/05/2025",status:"Pendente",balanco:"Janeiro"},
];
const dataInvest: Investimento[] = [
    {id:1,produto:"ITSA4",empresa:"Itaúsa",valor:11.07,quantidade:1,valorTotal:11.07,tipoAtivo:"Ação Brasileira",provento:0.05,frequencia:"Trimestral",balanco:"Janeiro"},
    {id:2,produto:"KNRI11",empresa:"Kinea Renda Im.",valor:146.36,quantidade:1,valorTotal:146.36,tipoAtivo:"Fundo Imobiliário",provento:1,frequencia:"Mensal",balanco:"Janeiro"},
];
const dataMetas: Meta[] = [
    {id:1,nome:"Casamento",icon:<Gem className="size-5 text-zinc-700"/>,percent:17,valor:15000,investido:2541.04,faltante:12458.96},
    {id:2,nome:"Investimentos",icon:<TrendingUp className="size-5 text-zinc-700"/>,percent:40,valor:3000,investido:1196.45,faltante:1803.55},
    {id:3,nome:"Imóvel",icon:<Home className="size-5 text-zinc-700"/>,percent:68,valor:9500,investido:6497.52,faltante:3002.48},
];
const dataFontes: FonteRenda[] = [
    {nome:"Trabalho",icon:<Briefcase className="size-5 text-zinc-700"/>,percent:87,metaAnual:42000,receitaAnual:36521.94},
    {nome:"Investimentos",icon:<BarChart3 className="size-5 text-zinc-700"/>,percent:62,metaAnual:5000,receitaAnual:3100},
    {nome:"Manutenções",icon:<Wrench className="size-5 text-zinc-700"/>,percent:71,metaAnual:5000,receitaAnual:3535},
];
const dataCategs: Categoria[] = [
    {nome:"Casa",icon:<Home className="size-4 text-zinc-600"/>,pct:43,lim:10000,desp:4295.42},{nome:"Profissional",icon:<Briefcase className="size-4 text-zinc-600"/>,pct:110,lim:1000,desp:1101.48},
    {nome:"Educação",icon:<GraduationCap className="size-4 text-zinc-600"/>,pct:25,lim:1000,desp:253.5},{nome:"Assinaturas",icon:<CreditCard className="size-4 text-zinc-600"/>,pct:136,lim:1000,desp:1358.95},
    {nome:"Mercado",icon:<ShoppingCart className="size-4 text-zinc-600"/>,pct:14,lim:1500,desp:209.91},{nome:"Farmácia e Saúde",icon:<HeartPulse className="size-4 text-zinc-600"/>,pct:272,lim:200,desp:544.86},
    {nome:"Transporte",icon:<Car className="size-4 text-zinc-600"/>,pct:0,lim:null,desp:516.37},{nome:"Utilidades",icon:<Hammer className="size-4 text-zinc-600"/>,pct:0,lim:null,desp:2350.48},
    {nome:"Entretenimento",icon:<Gamepad2 className="size-4 text-zinc-600"/>,pct:0,lim:null,desp:2186.25},{nome:"Juros e Taxas",icon:<TrendingDown className="size-4 text-zinc-600"/>,pct:0,lim:null,desp:1001.23},
    {nome:"Alimentação",icon:<UtensilsCrossed className="size-4 text-zinc-600"/>,pct:0,lim:null,desp:1482.23},{nome:"Shopping",icon:<ShoppingBag className="size-4 text-zinc-600"/>,pct:0,lim:null,desp:1486.45},
];
const dataFormas: FormaPagamento[] = [
    {nome:"Dinheiro",icon:<Banknote className="size-4 text-zinc-600"/>,pct:70,lim:1000,desp:700},{nome:"Boleto",icon:<FileText className="size-4 text-zinc-600"/>,pct:32,lim:4000,desp:1263.31},
    {nome:"Pix",icon:<Zap className="size-4 text-zinc-600"/>,pct:28,lim:7000,desp:1985.23},{nome:"Cartão de Débito",icon:<CreditCard className="size-4 text-zinc-600"/>,pct:33,lim:1500,desp:499.56},
    {nome:"Cartão de Crédito Itaú",icon:<CreditCard className="size-4 text-zinc-600"/>,pct:167,lim:5000,desp:8345.92},
    {nome:"Cartão de Crédito Nubank",icon:<CreditCard className="size-4 text-zinc-600"/>,pct:65,lim:2000,desp:1294.68},
    {nome:"Cartão de Crédito Nubank PJ",icon:<CreditCard className="size-4 text-zinc-600"/>,pct:96,lim:3000,desp:2878.22},
];

/* ── UI ───────────────────────────────────────────────────────────────────── */

const CP = ({p,size=48,sw=4}: {p: number; size?: number; sw?: number}) => {
    const r=(size-sw)/2,c=2*Math.PI*r,mn=Math.min(p,100),o=c-(mn/100)*c;
    const cl=p>100?"#ef4444":p>75?"#f59e0b":"#18181b";
    return (<svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e4e4e7" strokeWidth={sw}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={cl} strokeWidth={sw} strokeDasharray={c} strokeDashoffset={o} strokeLinecap="round" style={{transition:"stroke-dashoffset .6s ease"}}/>
    </svg>);
};

const LP = ({p}: {p: number}) => {
    const cl=p>90?"#ef4444":p>60?"#f59e0b":"#18181b";
    return (<div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{width:`${Math.min(p,100)}%`,backgroundColor:cl}}/>
    </div>);
};

type BadgeVariant = "default" | "success" | "danger" | "warning";
const B = ({children,v="default"}: {children: ReactNode; v?: BadgeVariant}) => {
    const s: Record<BadgeVariant, string> = {default:"bg-zinc-100 text-zinc-600",success:"bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",danger:"bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10",warning:"bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20"};
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${s[v]}`}>{children}</span>;
};

const SB = ({s}: {s: string}) => s==="Pago"?<B v="success">● Pago</B>:<B v="danger">● Pendente</B>;

const Tabs = ({tabs,active,onChange}: {tabs: readonly string[]; active: string; onChange: (tab: string) => void}) => (
    <div className="flex items-center gap-1 overflow-x-auto pb-1" style={{scrollbarWidth:"none"}}>
        {tabs.map(t=><button key={t} onClick={()=>onChange(t)} className={`whitespace-nowrap px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${active===t?"bg-zinc-900 text-white shadow-sm":"text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"}`}>{t}</button>)}
    </div>
);
const MT = ({a,o}: {a: string; o: (tab: string) => void}) => <Tabs tabs={MONTHS} active={a} onChange={o}/>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Tbl = ({cols,data,footer,onRowClick}: {cols: Column[]; data: Record<string, any>[]; footer?: FooterItem[]; onRowClick?: (row: Record<string, any>) => void}) => (
    <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead><tr className="border-b border-zinc-100 bg-zinc-50/70">
                    {cols.map(c=><th key={c.key} className={`px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider ${c.align==="right"?"text-right":""}`}>{c.label}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-zinc-50">
                {data.length===0?<tr><td colSpan={cols.length} className="px-4 py-10 text-center text-sm text-zinc-400">Nenhum registro neste mês</td></tr>
                    :data.map((row,i)=><tr key={row.id||i} onClick={()=>onRowClick?.(row)} className={`hover:bg-zinc-50/60 transition-colors ${onRowClick?"cursor-pointer":""}`}>
                        {cols.map(c=><td key={c.key} className={`px-4 py-3 ${c.align==="right"?"text-right":""}`}>{c.render?c.render(row):row[c.key]}</td>)}
                    </tr>)}
                </tbody>
            </table>
        </div>
        {footer&&<div className="border-t border-zinc-100 px-4 py-2.5 flex flex-wrap gap-6 text-xs text-zinc-400 bg-zinc-50/40">
            {footer.map((f,i)=><span key={i}><span className="uppercase tracking-wider">{f.label}</span>{" "}<span className="text-zinc-700 font-semibold">{f.value}</span></span>)}
        </div>}
    </div>
);

const SH = ({title,onAdd}: {title: string; onAdd?: () => void}) => (
    <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">{title}</h2>
        {onAdd&&<button onClick={onAdd} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-700 transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg> Novo
        </button>}
    </div>
);

/* ── APP ──────────────────────────────────────────────────────────────────── */

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({length: 5}, (_, i) => currentYear - 2 + i);

export default function FinancasDashboard() {
    const { auth } = usePage().props;
    const [ano, setAno] = useState(currentYear);
    const [ganhos, setGanhos] = useState(dataGanhos);
    const [fixas, setFixas] = useState(dataFixas);
    const [variaveis, setVariaveis] = useState(initVar);
    const [dividas, setDividas] = useState(dataDividas);
    const [investimentos, setInvestimentos] = useState(dataInvest);
    const [qTab, setQTab] = useState("1º Quadrimestre");
    const [gM,setGM]=useState("Jan");
    const [fM,setFM]=useState("Jan");
    const [vM,setVM]=useState("Jan");
    const [dM,setDM]=useState("Jan");
    const [iM,setIM]=useState("Jan");
    const [modal,setModal]=useState(false);
    const [modalGanho,setModalGanho]=useState(false);
    const [modalFixa,setModalFixa]=useState(false);
    const [modalDivida,setModalDivida]=useState(false);
    const [modalInvest,setModalInvest]=useState(false);
    const [editingDV,setEditingDV]=useState<DespesaVariavel|null>(null);
    const [editingGanho,setEditingGanho]=useState<Ganho|null>(null);
    const [editingFixa,setEditingFixa]=useState<DespesaFixa|null>(null);
    const [editingDivida,setEditingDivida]=useState<Divida|null>(null);
    const [editingInvest,setEditingInvest]=useState<Investimento|null>(null);

    const closeAll=()=>{setModal(false);setModalGanho(false);setModalFixa(false);setModalDivida(false);setModalInvest(false);setEditingDV(null);setEditingGanho(null);setEditingFixa(null);setEditingDivida(null);setEditingInvest(null);};

    const submitDV=(data: DespesaFormData)=>{
        if(editingDV){
            setVariaveis(p=>p.map(r=>r.id===editingDV.id?{...r,descricao:data.descricao,categoria:data.categoria,valor:parseFloat(data.valor),data:data.data,forma:data.forma}:r));
        } else {
            setVariaveis(p=>[...p,{id:nid++,descricao:data.descricao,categoria:data.categoria,valor:parseFloat(data.valor),data:data.data,balanco:toFull(vM),forma:data.forma}]);
        }
        closeAll();
    };
    const submitGanho=(data: GanhoFormData)=>{
        if(editingGanho){
            setGanhos(p=>p.map(r=>r.id===editingGanho.id?{...r,descricao:data.descricao,fonte:data.fonte,data:data.data,valor:parseFloat(data.valor)}:r));
        } else {
            setGanhos(p=>[...p,{id:nid++,descricao:data.descricao,fonte:data.fonte,data:data.data,valor:parseFloat(data.valor),balanco:toFull(gM)}]);
        }
        closeAll();
    };
    const submitFixa=(data: DespesaFixaFormData)=>{
        if(editingFixa){
            setFixas(p=>p.map(r=>r.id===editingFixa.id?{...r,descricao:data.descricao,categoria:data.categoria,valor:parseFloat(data.valor),vencimento:data.vencimento,status:data.status,dataPgto:data.dataPgto,forma:data.forma}:r));
        } else {
            setFixas(p=>[...p,{id:nid++,descricao:data.descricao,categoria:data.categoria,valor:parseFloat(data.valor),vencimento:data.vencimento,status:data.status,dataPgto:data.dataPgto,forma:data.forma,balanco:toFull(fM)}]);
        }
        closeAll();
    };
    const submitDivida=(data: DividaFormData)=>{
        if(editingDivida){
            setDividas(p=>p.map(r=>r.id===editingDivida.id?{...r,descricao:data.descricao,destino:data.destino,valor:parseFloat(data.valor),vencimento:data.vencimento,status:data.status}:r));
        } else {
            setDividas(p=>[...p,{id:nid++,descricao:data.descricao,destino:data.destino,valor:parseFloat(data.valor),vencimento:data.vencimento,status:data.status,balanco:toFull(dM)}]);
        }
        closeAll();
    };
    const submitInvest=(data: InvestimentoFormData)=>{
        const val=parseFloat(data.valor),qty=parseInt(data.quantidade);
        if(editingInvest){
            setInvestimentos(p=>p.map(r=>r.id===editingInvest.id?{...r,produto:data.produto,empresa:data.empresa,valor:val,quantidade:qty,valorTotal:val*qty,tipoAtivo:data.tipoAtivo,provento:parseFloat(data.provento||"0"),frequencia:data.frequencia}:r));
        } else {
            setInvestimentos(p=>[...p,{id:nid++,produto:data.produto,empresa:data.empresa,valor:val,quantidade:qty,valorTotal:val*qty,tipoAtivo:data.tipoAtivo,provento:parseFloat(data.provento||"0"),frequencia:data.frequencia,balanco:toFull(iM)}]);
        }
        closeAll();
    };

    const deleteDV=()=>{if(editingDV){setVariaveis(p=>p.filter(r=>r.id!==editingDV.id));closeAll();}};
    const deleteGanho=()=>{if(editingGanho){setGanhos(p=>p.filter(r=>r.id!==editingGanho.id));closeAll();}};
    const deleteFixa=()=>{if(editingFixa){setFixas(p=>p.filter(r=>r.id!==editingFixa.id));closeAll();}};
    const deleteDivida=()=>{if(editingDivida){setDividas(p=>p.filter(r=>r.id!==editingDivida.id));closeAll();}};
    const deleteInvest=()=>{if(editingInvest){setInvestimentos(p=>p.filter(r=>r.id!==editingInvest.id));closeAll();}};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openEditGanho=(row: Record<string,any>)=>{const r=row as Ganho;setEditingGanho(r);setModalGanho(true);};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openEditFixa=(row: Record<string,any>)=>{const r=row as DespesaFixa;setEditingFixa(r);setModalFixa(true);};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openEditDV=(row: Record<string,any>)=>{const r=row as DespesaVariavel;setEditingDV(r);setModal(true);};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openEditDivida=(row: Record<string,any>)=>{const r=row as Divida;setEditingDivida(r);setModalDivida(true);};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openEditInvest=(row: Record<string,any>)=>{const r=row as Investimento;setEditingInvest(r);setModalInvest(true);};

    const qTabs=["1º Quadrimestre","2º Quadrimestre","3º Quadrimestre"];
    const vis=balMensal.slice(qTabs.indexOf(qTab)*4,qTabs.indexOf(qTab)*4+4);
    const gF=byMonth(ganhos,"balanco",gM);
    const fF=byMonth(fixas,"balanco",fM);
    const vF=byMonth(variaveis,"balanco",vM);
    const dF=byMonth(dividas,"balanco",dM);
    const iF=byMonth(investimentos,"balanco",iM);
    const tR=balMensal.reduce((s,m)=>s+m.receita,0);
    const tD=balMensal.reduce((s,m)=>s+m.despesa,0);
    const tB=tR-tD;

    return (
        <div className="min-h-screen bg-zinc-50/50" style={{fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif"}}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>

            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-zinc-200/80">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-sm font-bold">F</div>
                        <div><h1 className="text-lg font-bold text-zinc-900 tracking-tight leading-tight">Finanças</h1><p className="text-xs text-zinc-400">Controle financeiro · {ano}</p></div>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="hidden md:flex items-center gap-5">
                            <div className="text-right"><p className="text-[11px] text-zinc-400 uppercase tracking-wider">Receita</p><p className="text-sm font-bold text-emerald-600">{fmt(tR)}</p></div>
                            <div className="text-right"><p className="text-[11px] text-zinc-400 uppercase tracking-wider">Despesa</p><p className="text-sm font-bold text-red-500">{fmt(tD)}</p></div>
                            <div className="h-8 w-px bg-zinc-200"/>
                            <div className="text-right"><p className="text-[11px] text-zinc-400 uppercase tracking-wider">Balanço</p><p className={`text-sm font-bold ${tB>=0?"text-emerald-600":"text-red-600"}`}>{fmt(tB)}</p></div>
                        </div>
                        <div className="h-8 w-px bg-zinc-200 hidden md:block"/>
                        <select value={ano} onChange={e=>setAno(Number(e.target.value))} className="h-8 px-2 pr-7 rounded-md border border-zinc-200 text-sm font-medium text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-400 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_6px_center]">
                            {yearOptions.map(y=><option key={y} value={y}>{y}</option>)}
                        </select>
                        {auth.user && <>
                            <div className="h-8 w-px bg-zinc-200"/>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-zinc-700">{auth.user.name}</span>
                                <Link href={logout()} method="post" as="button" className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors">Sair</Link>
                            </div>
                        </>}
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">

                {/* BALANÇO MENSAL */}
                <section><SH title="Balanço Mensal"/><Tabs tabs={qTabs} active={qTab} onChange={setQTab}/>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        {vis.map(m=>{const p=Math.round((m.despesa/m.receita)*100),b=m.receita-m.despesa;return(
                            <div key={m.mes} className="rounded-xl border border-zinc-200 bg-white p-5 hover:shadow-md hover:border-zinc-300 transition-all">
                                <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-zinc-900">{m.mes}</h3><span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-md ${p>90?"bg-red-50 text-red-600":"bg-zinc-100 text-zinc-600"}`}>{p}%</span></div>
                                <div className="space-y-1.5 mb-4">
                                    <div className="flex justify-between text-sm"><span className="text-emerald-600 font-medium">Receita</span><span className="text-zinc-700 font-mono">{fmt(m.receita)}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-red-500 font-medium">Despesa</span><span className="text-zinc-700 font-mono">{fmt(m.despesa)}</span></div>
                                </div>
                                <LP p={p}/>
                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-zinc-100"><span className="text-xs text-zinc-400">Balanço</span><span className={`text-sm font-bold font-mono ${b>=0?"text-emerald-600":"text-red-600"}`}>{fmt(b)}</span></div>
                            </div>);})}
                    </div>
                </section>

                {/* GANHOS */}
                <section><SH title="Ganhos" onAdd={()=>{setEditingGanho(null);setModalGanho(true);}}/><MT a={gM} o={setGM}/>
                    <div className="mt-3"><Tbl cols={[
                        {key:"descricao",label:"Descrição",render:r=><span className="font-medium text-zinc-900">{r.descricao}</span>},
                        {key:"fonte",label:"Fonte de Renda",render:r=><B>{r.fonte}</B>},
                        {key:"data",label:"Data",render:r=><span className="text-zinc-500">{r.data}</span>},
                        {key:"valor",label:"Valor",align:"right",render:r=><span className="font-mono font-semibold text-emerald-600">{fmt(r.valor)}</span>},
                        {key:"balanco",label:"Balanço",render:r=><span className="text-zinc-400">{r.balanco}</span>},
                    ]} data={gF} footer={[{label:"Contagem",value:gF.length},{label:"Soma",value:fmt(gF.reduce((s,g)=>s+g.valor,0))}]} onRowClick={openEditGanho}/></div>
                </section>

                {/* DESPESAS FIXAS */}
                <section><SH title="Despesas Fixas" onAdd={()=>{setEditingFixa(null);setModalFixa(true);}}/><MT a={fM} o={setFM}/>
                    <div className="mt-3"><Tbl cols={[
                        {key:"descricao",label:"Descrição",render:r=><span className="font-medium text-zinc-900">{r.descricao}</span>},
                        {key:"categoria",label:"Categoria",render:r=><B>{r.categoria}</B>},
                        {key:"valor",label:"Valor",align:"right",render:r=><span className="font-mono">{fmt(r.valor)}</span>},
                        {key:"vencimento",label:"Vencimento",render:r=><span className="text-zinc-500">{r.vencimento}</span>},
                        {key:"status",label:"Status",render:r=><SB s={r.status}/>},
                        {key:"dataPgto",label:"Data Pgto",render:r=><span className="text-zinc-500">{r.dataPgto}</span>},
                        {key:"forma",label:"Forma",render:r=>r.forma?<B>{r.forma}</B>:<span className="text-zinc-300">—</span>},
                    ]} data={fF} footer={[{label:"Contagem",value:fF.length},{label:"Soma",value:fmt(fF.reduce((s,d)=>s+d.valor,0))},{label:"Concluídos",value:`${fF.length>0?Math.round((fF.filter(d=>d.status==="Pago").length/fF.length)*100):0}%`}]} onRowClick={openEditFixa}/></div>
                </section>

                {/* DESPESAS VARIÁVEIS */}
                <section><SH title="Despesas Variáveis" onAdd={()=>{setEditingDV(null);setModal(true);}}/><MT a={vM} o={setVM}/>
                    <div className="mt-3"><Tbl cols={[
                        {key:"descricao",label:"Descrição",render:r=><span className="font-medium text-zinc-900">{r.descricao}</span>},
                        {key:"categoria",label:"Categoria",render:r=><B>{r.categoria}</B>},
                        {key:"valor",label:"Valor",align:"right",render:r=><span className="font-mono">{fmt(r.valor)}</span>},
                        {key:"data",label:"Data",render:r=><span className="text-zinc-500">{r.data}</span>},
                        {key:"balanco",label:"Balanço",render:r=><span className="text-zinc-400">{r.balanco}</span>},
                        {key:"forma",label:"Forma de Pagamento",render:r=>r.forma?<B>{r.forma}</B>:<span className="text-zinc-300">—</span>},
                    ]} data={vF} footer={[{label:"Contagem",value:vF.length},{label:"Soma",value:fmt(vF.reduce((s,d)=>s+d.valor,0))}]} onRowClick={openEditDV}/></div>
                </section>

                {/* DÍVIDAS */}
                <section><SH title="Dívidas" onAdd={()=>{setEditingDivida(null);setModalDivida(true);}}/><MT a={dM} o={setDM}/>
                    <div className="mt-3"><Tbl cols={[
                        {key:"descricao",label:"Descrição",render:r=><span className="font-medium text-zinc-900">{r.descricao}</span>},
                        {key:"destino",label:"Destino",render:r=><B>{r.destino}</B>},
                        {key:"valor",label:"Valor",align:"right",render:r=><span className="font-mono">{fmt(r.valor)}</span>},
                        {key:"vencimento",label:"Vencimento",render:r=><span className="text-zinc-500">{r.vencimento}</span>},
                        {key:"status",label:"Status",render:r=><SB s={r.status}/>},
                        {key:"balanco",label:"Balanço",render:r=><span className="text-zinc-400">{r.balanco}</span>},
                    ]} data={dF} footer={[{label:"Contagem",value:dF.length},{label:"Soma",value:fmt(dF.reduce((s,d)=>s+d.valor,0))},{label:"Concluídos",value:`${dF.length>0?Math.round((dF.filter(d=>d.status==="Pago").length/dF.length)*100):0}%`}]} onRowClick={openEditDivida}/></div>
                </section>

                {/* INVESTIMENTOS */}
                <section><SH title="Investimentos" onAdd={()=>{setEditingInvest(null);setModalInvest(true);}}/><MT a={iM} o={setIM}/>
                    <div className="mt-3"><Tbl cols={[
                        {key:"produto",label:"Produto",render:r=><span className="font-mono font-semibold text-zinc-900">{r.produto}</span>},
                        {key:"empresa",label:"Empresa",render:r=><span className="text-zinc-600">{r.empresa}</span>},
                        {key:"valor",label:"Valor",align:"right",render:r=><span className="font-mono">{fmt(r.valor)}</span>},
                        {key:"quantidade",label:"Qtd",align:"right"},
                        {key:"valorTotal",label:"Total",align:"right",render:r=><span className="font-mono font-semibold">{fmt(r.valorTotal)}</span>},
                        {key:"tipoAtivo",label:"Tipo",render:r=><B v={r.tipoAtivo.includes("Fundo")?"warning":"success"}>{r.tipoAtivo}</B>},
                        {key:"provento",label:"Provento",align:"right",render:r=><span className="font-mono text-emerald-600">{fmt(r.provento)}</span>},
                        {key:"frequencia",label:"Frequência",render:r=><B>{r.frequencia}</B>},
                    ]} data={iF} footer={[{label:"Contagem",value:iF.length},{label:"Média",value:fmt(iF.length>0?iF.reduce((s,x)=>s+x.valor,0)/iF.length:0)},{label:"Soma Total",value:fmt(iF.reduce((s,x)=>s+x.valorTotal,0))}]} onRowClick={openEditInvest}/></div>
                </section>

                {/* METAS FINANCEIRAS */}
                <section><SH title="Metas Financeiras"/>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dataMetas.map(m=><div key={m.id} className="rounded-xl border border-zinc-200 bg-white p-6 hover:shadow-md hover:border-zinc-300 transition-all">
                            <div className="flex items-center gap-4 mb-5">
                                <div className="relative"><CP p={m.percent} size={56} sw={4}/><span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-zinc-700">{m.percent}%</span></div>
                                <h3 className="font-semibold text-zinc-900 flex items-center gap-2">{m.icon}{m.nome}</h3>
                            </div>
                            <div className="space-y-2.5">
                                <div className="flex justify-between text-sm"><span className="text-zinc-400">Valor</span><span className="font-mono font-semibold text-zinc-900">{fmt(m.valor)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-zinc-400">Investido</span><span className="font-mono text-emerald-600">{fmt(m.investido)}</span></div>
                                <div className="h-px bg-zinc-100"/><div className="flex justify-between text-sm"><span className="text-zinc-400">Faltante</span><span className="font-mono text-amber-600">{fmt(m.faltante)}</span></div>
                            </div>
                        </div>)}
                    </div>
                </section>

                {/* FONTES DE RENDA */}
                <section><SH title="Fontes de Renda"/>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dataFontes.map(f=><div key={f.nome} className="rounded-xl border border-zinc-200 bg-white p-6 hover:shadow-md hover:border-zinc-300 transition-all">
                            <div className="flex items-center gap-4 mb-5">
                                <div className="relative"><CP p={f.percent} size={56} sw={4}/><span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-zinc-700">{f.percent}%</span></div>
                                <h3 className="font-semibold text-zinc-900 flex items-center gap-2">{f.icon}{f.nome}</h3>
                            </div>
                            <div className="space-y-2.5">
                                <div className="flex justify-between text-sm"><span className="text-zinc-400">Meta Anual</span><span className="font-mono font-semibold text-zinc-900">{fmt(f.metaAnual)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-emerald-600 font-medium">Receita Anual</span><span className="font-mono text-emerald-600">{fmt(f.receitaAnual)}</span></div>
                            </div>
                        </div>)}
                    </div>
                </section>

                {/* CATEGORIAS */}
                <section><SH title="Categorias"/>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {dataCategs.map(c=><div key={c.nome} className="rounded-xl border border-zinc-200 bg-white p-5 hover:shadow-md hover:border-zinc-300 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="relative"><CP p={c.pct} size={40} sw={3}/><span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-zinc-500">{c.pct>0?`${c.pct}%`:"—"}</span></div>
                                <h3 className="font-semibold text-zinc-900 text-sm flex items-center gap-1.5">{c.icon}{c.nome}</h3>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs"><span className="text-zinc-400">Limite Anual</span><span className="font-mono text-zinc-600">{c.lim?fmt(c.lim):"—"}</span></div>
                                <div className="flex justify-between text-xs"><span className="text-red-500">Despesa Anual</span><span className="font-mono text-red-500">{fmt(c.desp)}</span></div>
                            </div>
                        </div>)}
                    </div>
                </section>

                {/* FORMAS DE PAGAMENTO */}
                <section><SH title="Formas de Pagamento"/>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {dataFormas.map(f=><div key={f.nome} className="rounded-xl border border-zinc-200 bg-white p-5 hover:shadow-md hover:border-zinc-300 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="relative"><CP p={f.pct} size={40} sw={3}/><span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-zinc-500">{f.pct}%</span></div>
                                <h3 className="font-semibold text-zinc-900 text-sm flex items-center gap-1.5">{f.icon}{f.nome}</h3>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs"><span className="text-zinc-400">Limite Anual</span><span className="font-mono text-zinc-600">{fmt(f.lim)}</span></div>
                                <div className="flex justify-between text-xs"><span className="text-red-500">Despesa Anual</span><span className="font-mono text-red-500">{fmt(f.desp)}</span></div>
                            </div>
                        </div>)}
                    </div>
                </section>
            </div>

            <DespesaVariavelModal open={modal} onClose={closeAll} onSubmit={submitDV}
                initialData={editingDV?{descricao:editingDV.descricao,categoria:editingDV.categoria,valor:String(editingDV.valor),data:editingDV.data,forma:editingDV.forma}:undefined}
                onDelete={editingDV?deleteDV:undefined}/>
            <GanhoModal open={modalGanho} onClose={closeAll} onSubmit={submitGanho}
                initialData={editingGanho?{descricao:editingGanho.descricao,fonte:editingGanho.fonte,data:editingGanho.data,valor:String(editingGanho.valor)}:undefined}
                onDelete={editingGanho?deleteGanho:undefined}/>
            <DespesaFixaModal open={modalFixa} onClose={closeAll} onSubmit={submitFixa}
                initialData={editingFixa?{descricao:editingFixa.descricao,categoria:editingFixa.categoria,valor:String(editingFixa.valor),vencimento:editingFixa.vencimento,status:editingFixa.status,dataPgto:editingFixa.dataPgto,forma:editingFixa.forma}:undefined}
                onDelete={editingFixa?deleteFixa:undefined}/>
            <DividaModal open={modalDivida} onClose={closeAll} onSubmit={submitDivida}
                initialData={editingDivida?{descricao:editingDivida.descricao,destino:editingDivida.destino,valor:String(editingDivida.valor),vencimento:editingDivida.vencimento,status:editingDivida.status}:undefined}
                onDelete={editingDivida?deleteDivida:undefined}/>
            <InvestimentoModal open={modalInvest} onClose={closeAll} onSubmit={submitInvest}
                initialData={editingInvest?{produto:editingInvest.produto,empresa:editingInvest.empresa,valor:String(editingInvest.valor),quantidade:String(editingInvest.quantidade),tipoAtivo:editingInvest.tipoAtivo,provento:String(editingInvest.provento),frequencia:editingInvest.frequencia}:undefined}
                onDelete={editingInvest?deleteInvest:undefined}/>
        </div>
    );
}
