import { Head, Link } from "@inertiajs/react";
import { ArrowRight, Check, TrendingUp, Target, Wallet, CreditCard, PieChart, ShieldCheck } from "lucide-react";
import { login, register } from "@/routes";

/* ── Mini dashboard mockup ──────────────────────────────────────────────── */

function DashboardPreview() {
    const bars = [
        { label: "Jan", r: 62, d: 45 }, { label: "Fev", r: 58, d: 52 },
        { label: "Mar", r: 71, d: 38 }, { label: "Abr", r: 65, d: 60 },
        { label: "Mai", r: 80, d: 42 }, { label: "Jun", r: 73, d: 55 },
    ];
    return (
        <div className="rounded-2xl border border-zinc-200/60 bg-white shadow-2xl shadow-zinc-900/[0.08] overflow-hidden">
            {/* Fake header */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-zinc-100">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 text-[11px] text-zinc-400 font-medium">Finanças — Balanço Mensal</span>
            </div>
            <div className="p-5">
                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3">
                        <div className="text-[10px] text-emerald-600 font-medium mb-1">Receitas</div>
                        <div className="text-base font-bold text-emerald-700 font-mono">R$ 8.420</div>
                    </div>
                    <div className="rounded-lg bg-red-50 border border-red-100 p-3">
                        <div className="text-[10px] text-red-500 font-medium mb-1">Despesas</div>
                        <div className="text-base font-bold text-red-600 font-mono">R$ 5.230</div>
                    </div>
                    <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-3">
                        <div className="text-[10px] text-zinc-500 font-medium mb-1">Saldo</div>
                        <div className="text-base font-bold text-zinc-900 font-mono">R$ 3.190</div>
                    </div>
                </div>
                {/* Chart bars */}
                <div className="flex items-end gap-2 h-28">
                    {bars.map(b => (
                        <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full flex gap-0.5">
                                <div className="flex-1 rounded-t bg-emerald-400/80" style={{ height: `${b.r}px` }} />
                                <div className="flex-1 rounded-t bg-red-300/70" style={{ height: `${b.d}px` }} />
                            </div>
                            <span className="text-[9px] text-zinc-400">{b.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ── Circular progress (for goals) ──────────────────────────────────────── */

function Ring({ pct, color, size = 48, stroke = 4 }: { pct: number; color: string; size?: number; stroke?: number }) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    return (
        <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-zinc-100" />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} strokeLinecap="round" />
        </svg>
    );
}

/* ── Main ───────────────────────────────────────────────────────────────── */

export default function Welcome() {
    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
            <Head title="Controle Financeiro Pessoal" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-zinc-200/80">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-sm font-bold">F</div>
                        <span className="text-lg font-bold text-zinc-900 tracking-tight">Finanças</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={login().url} className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors px-3 py-2">
                            Entrar
                        </Link>
                        <Link href={register().url} className="inline-flex items-center h-9 px-4 rounded-md text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-colors">
                            Começar agora
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── HERO ───────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden">
                {/* Background accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-emerald-50/60 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-10 lg:pt-28 lg:pb-16">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold mb-6">
                                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
                                30 dias grátis — sem compromisso
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight leading-[1.08]">
                                Seu dinheiro,
                                <br />
                                suas regras.
                            </h1>
                            <p className="mt-5 text-lg text-zinc-500 leading-relaxed max-w-lg">
                                Chega de planilhas bagunçadas. Controle ganhos, despesas,
                                parcelas, investimentos e metas — tudo num só lugar,
                                do jeito que faz sentido pra você.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row items-start gap-3">
                                <Link href={register().url} className="group inline-flex items-center gap-2 h-12 px-7 rounded-lg text-sm font-semibold bg-zinc-900 text-white hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/20">
                                    Criar conta grátis
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                                <Link href={login().url} className="inline-flex items-center h-12 px-7 rounded-lg text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">
                                    Já tenho conta
                                </Link>
                            </div>
                            <div className="mt-6 flex items-center gap-5 text-xs text-zinc-400">
                                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> Sem cartão de crédito</span>
                                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> Cancele quando quiser</span>
                            </div>
                        </div>

                        {/* Right — Dashboard preview */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-br from-emerald-100/40 via-transparent to-zinc-100/40 rounded-3xl blur-2xl pointer-events-none" />
                            <div className="relative">
                                <DashboardPreview />
                                {/* Floating meta card */}
                                <div className="absolute -bottom-6 -left-4 sm:-left-8 rounded-xl border border-zinc-200/80 bg-white shadow-lg p-3 flex items-center gap-3">
                                    <Ring pct={72} color="#10b981" />
                                    <div>
                                        <div className="text-[11px] text-zinc-400 font-medium">Reserva de Emergência</div>
                                        <div className="text-sm font-bold text-zinc-900">72% concluída</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── NUMBERS ────────────────────────────────────────────────── */}
            <section className="border-y border-zinc-100 bg-zinc-50/50">
                <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
                    {[
                        { n: "100%", sub: "Gratuito por 30 dias" },
                        { n: "6", sub: "Módulos financeiros" },
                        { n: "2FA", sub: "Autenticação segura" },
                        { n: "∞", sub: "Registros ilimitados" },
                    ].map(s => (
                        <div key={s.sub}>
                            <div className="text-3xl font-extrabold text-zinc-900">{s.n}</div>
                            <div className="mt-1 text-sm text-zinc-500">{s.sub}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FEATURES ───────────────────────────────────────────────── */}
            <section className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
                <div className="text-center mb-16">
                    <p className="text-sm font-semibold text-emerald-600 mb-2">Funcionalidades</p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
                        Pare de adivinhar,<br className="hidden sm:block" /> comece a controlar
                    </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-200 rounded-2xl overflow-hidden border border-zinc-200">
                    {[
                        { icon: TrendingUp, title: "Balanço Mensal", desc: "Gráfico de receitas vs despesas mês a mês. Visualize em segundos se está no positivo ou no vermelho.", accent: "bg-emerald-100 text-emerald-700" },
                        { icon: CreditCard, title: "Parcelas Automáticas", desc: "Comprou em 10x? O sistema divide e distribui nos meses certos. Cada parcela vira um registro independente.", accent: "bg-blue-100 text-blue-700" },
                        { icon: Target, title: "Metas com Progresso", desc: "Reserva de emergência, viagem, carro novo — defina o valor e acompanhe quanto já investiu e quanto falta.", accent: "bg-amber-100 text-amber-700" },
                        { icon: Wallet, title: "Investimentos", desc: "Registre ações, FIIs, renda fixa. Controle preço médio, proventos recebidos e frequência de aportes.", accent: "bg-violet-100 text-violet-700" },
                        { icon: PieChart, title: "Categorias Inteligentes", desc: "Crie categorias e formas de pagamento personalizadas com limites anuais e ícones. Veja onde concentra seus gastos.", accent: "bg-rose-100 text-rose-700" },
                        { icon: ShieldCheck, title: "Privacidade Total", desc: "Seus dados não são compartilhados. Login seguro com 2FA. Cada usuário acessa apenas suas próprias finanças.", accent: "bg-zinc-100 text-zinc-700" },
                    ].map(f => (
                        <div key={f.title} className="bg-white p-7 hover:bg-zinc-50/50 transition-colors">
                            <div className={`w-10 h-10 rounded-lg ${f.accent} flex items-center justify-center mb-4`}>
                                <f.icon className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-zinc-900 mb-2">{f.title}</h3>
                            <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── PRICING ────────────────────────────────────────────────── */}
            <section className="bg-zinc-50/80 border-y border-zinc-100">
                <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
                    <div className="text-center mb-16">
                        <p className="text-sm font-semibold text-emerald-600 mb-2">Planos</p>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
                            Simples e transparente
                        </h2>
                        <p className="mt-3 text-zinc-500">Comece grátis. Depois, escolha o que faz sentido pra você.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {/* Free */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-8">
                            <div className="text-sm font-semibold text-zinc-900 mb-1">Gratuito</div>
                            <div className="text-zinc-500 text-xs mb-6">Para experimentar sem pressa</div>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-extrabold text-zinc-900">R$ 0</span>
                                <span className="text-zinc-400 text-sm">/mês</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {["30 dias de acesso completo", "Todos os módulos inclusos", "Registros ilimitados", "Exportação de dados"].map(t => (
                                    <li key={t} className="flex items-start gap-2 text-sm text-zinc-600">
                                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> {t}
                                    </li>
                                ))}
                            </ul>
                            <Link href={register().url} className="block w-full h-11 rounded-lg border border-zinc-200 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center justify-center">
                                Começar grátis
                            </Link>
                        </div>

                        {/* Pro */}
                        <div className="rounded-2xl border-2 border-zinc-900 bg-white p-8 relative">
                            <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-zinc-900 text-white text-[11px] font-semibold">
                                Mais popular
                            </div>
                            <div className="text-sm font-semibold text-zinc-900 mb-1">Pro</div>
                            <div className="text-zinc-500 text-xs mb-6">Para quem leva a sério</div>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-extrabold text-zinc-900">R$ 12</span>
                                <span className="text-zinc-400 text-sm">/mês</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {["Tudo do plano Gratuito", "Acesso vitalício", "Painel administrativo", "Suporte prioritário", "Novas funcionalidades primeiro"].map(t => (
                                    <li key={t} className="flex items-start gap-2 text-sm text-zinc-600">
                                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> {t}
                                    </li>
                                ))}
                            </ul>
                            <Link href={register().url} className="block w-full h-11 rounded-lg bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center">
                                Começar com 30 dias grátis
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIAL / SOCIAL PROOF ─────────────────────────────── */}
            <section className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="inline-flex -space-x-2 mb-6">
                        {["bg-emerald-400", "bg-blue-400", "bg-amber-400", "bg-rose-400", "bg-violet-400"].map((bg, i) => (
                            <div key={i} className={`w-9 h-9 rounded-full ${bg} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                                {["M", "A", "R", "J", "C"][i]}
                            </div>
                        ))}
                    </div>
                    <blockquote className="text-xl sm:text-2xl font-semibold text-zinc-900 leading-snug">
                        "Eu vivia perdido com planilhas que nunca batiam. Aqui eu cadastro e pronto — sei exatamente quanto sobra no mês."
                    </blockquote>
                    <p className="mt-4 text-sm text-zinc-400">Marcos R. — usuário desde 2025</p>
                </div>
            </section>

            {/* ── CTA FINAL ──────────────────────────────────────────────── */}
            <section className="max-w-6xl mx-auto px-6 pb-20">
                <div className="relative rounded-2xl bg-zinc-900 px-8 py-16 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.12),transparent_60%)]" />
                    <div className="relative">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            O melhor momento pra<br />organizar suas finanças é agora.
                        </h2>
                        <p className="mt-4 text-zinc-400 max-w-md mx-auto">
                            30 dias grátis. Sem cartão. Sem pegadinhas.
                        </p>
                        <Link href={register().url} className="mt-8 group inline-flex items-center gap-2 h-12 px-8 rounded-lg text-sm font-semibold bg-white text-zinc-900 hover:bg-zinc-100 transition-colors">
                            Criar minha conta
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ─────────────────────────────────────────────────── */}
            <footer className="border-t border-zinc-200 py-8">
                <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-white text-[10px] font-bold">F</div>
                        <span className="text-sm font-semibold text-zinc-900">Finanças</span>
                    </div>
                    <span className="text-sm text-zinc-400">&copy; {new Date().getFullYear()} Todos os direitos reservados.</span>
                </div>
            </footer>
        </div>
    );
}
