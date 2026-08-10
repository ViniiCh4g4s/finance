interface Row {
    descricao: string;
    categoria: string;
    valor: number;
    data: string;
    forma: string;
}

interface Props {
    rows: Row[];
    mesIndex: number;
    ano: number;
}

const fmt = (v: number): string => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const somaPor = (rows: Row[], key: "categoria" | "forma"): [string, number][] => {
    const map = new Map<string, number>();
    for (const r of rows) {
        const k = r[key] || "—";
        map.set(k, (map.get(k) ?? 0) + r.valor);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
};

const Tile = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
    <div className="px-5 py-4">
        <p className="text-[11px] text-zinc-400 uppercase tracking-wider">{label}</p>
        <p className="text-xl font-semibold text-zinc-900 mt-1">{value}</p>
        {hint && <p className="text-xs text-zinc-400 mt-0.5 truncate">{hint}</p>}
    </div>
);

const Barras = ({ titulo, itens, total }: { titulo: string; itens: [string, number][]; total: number }) => {
    const max = itens.length > 0 ? itens[0][1] : 0;
    return (
        <div className="px-5 py-4">
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">{titulo}</h4>
            <div className="space-y-3">
                {itens.map(([nome, valor]) => (
                    <div key={nome} className="group">
                        <div className="flex items-baseline justify-between gap-3 mb-1">
                            <span className="text-sm text-zinc-700 truncate">{nome}</span>
                            <span className="text-sm text-zinc-900 font-mono whitespace-nowrap">
                                {fmt(valor)} <span className="text-xs text-zinc-400">· {total > 0 ? Math.round((valor / total) * 100) : 0}%</span>
                            </span>
                        </div>
                        <div
                            className="h-[10px] bg-zinc-900 rounded-r-[4px] group-hover:bg-zinc-700 transition-colors"
                            style={{ width: `${max > 0 ? Math.max((valor / max) * 100, 1.5) : 0}%` }}
                        />
                    </div>
                ))}
                {itens.length === 0 && <p className="text-sm text-zinc-400">Sem dados</p>}
            </div>
        </div>
    );
};

export default function DespesasVariaveisStats({ rows, mesIndex, ano }: Props) {
    const total = rows.reduce((s, r) => s + r.valor, 0);
    const media = rows.length > 0 ? total / rows.length : 0;
    const maior = rows.reduce<Row | null>((m, r) => (m === null || r.valor > m.valor ? r : m), null);

    const porCategoria = somaPor(rows, "categoria");
    const porForma = somaPor(rows, "forma");

    const diasNoMes = new Date(ano, mesIndex + 1, 0).getDate();
    const porDia = new Array<number>(diasNoMes).fill(0);
    for (const r of rows) {
        const dia = parseInt(r.data.slice(0, 2), 10);
        if (dia >= 1 && dia <= diasNoMes) porDia[dia - 1] += r.valor;
    }
    const maxDia = Math.max(...porDia, 0);
    const diaPico = maxDia > 0 ? porDia.indexOf(maxDia) : -1;

    if (rows.length === 0) {
        return (
            <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white shadow-sm">
                <p className="px-4 py-10 text-center text-sm text-zinc-400">Nenhum registro neste mês</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white shadow-sm">
            {/* KPIs do mês */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-zinc-100 border-b border-zinc-100">
                <Tile label="Total no mês" value={fmt(total)} />
                <Tile label="Registros" value={String(rows.length)} />
                <Tile label="Média por registro" value={fmt(media)} />
                <Tile label="Maior gasto" value={fmt(maior?.valor ?? 0)} hint={maior?.descricao} />
            </div>

            {/* Rankings por categoria e forma */}
            <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-zinc-100 border-b border-zinc-100">
                <Barras titulo="Gastos por categoria" itens={porCategoria} total={total} />
                <Barras titulo="Gastos por forma de pagamento" itens={porForma} total={total} />
            </div>

            {/* Gastos por dia do mês */}
            <div className="px-5 py-4">
                <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">Gastos por dia</h4>
                <div className="flex items-end gap-[2px] h-32 border-b border-zinc-200">
                    {porDia.map((valor, i) => (
                        <div key={i} className="relative flex-1 h-full flex flex-col items-center justify-end group">
                            {i === diaPico && (
                                <span className="text-[10px] text-zinc-500 mb-0.5 whitespace-nowrap">{fmt(valor)}</span>
                            )}
                            {valor > 0 && (
                                <div
                                    className="w-full bg-zinc-900 rounded-t-[4px] group-hover:bg-zinc-700 transition-colors"
                                    style={{ height: `${Math.max((valor / maxDia) * 100, 3)}%` }}
                                />
                            )}
                            <div className="pointer-events-none absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-zinc-900 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap z-10 shadow-lg">
                                {String(i + 1).padStart(2, "0")}/{String(mesIndex + 1).padStart(2, "0")} — {fmt(valor)}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-[2px] mt-1">
                    {porDia.map((_, i) => (
                        <span key={i} className="flex-1 text-center text-[10px] text-zinc-400">
                            {(i + 1) % 5 === 0 || i === 0 ? i + 1 : ""}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
