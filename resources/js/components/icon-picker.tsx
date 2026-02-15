import { useState, useMemo } from "react";
import { icons, type LucideIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const allNames = Object.keys(icons) as (keyof typeof icons)[];

interface Props {
    value: string;
    onChange: (name: string) => void;
    disabled?: boolean;
}

export function IconPreview({ name, className }: { name: string; className?: string }) {
    const Icon = icons[name as keyof typeof icons] as LucideIcon | undefined;
    if (!Icon) return <span className={className ?? "size-5 text-zinc-400"}>?</span>;
    return <Icon className={className ?? "size-5 text-zinc-700"} />;
}

export default function IconPicker({ value, onChange, disabled }: Props) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        if (!search) return allNames.slice(0, 80);
        const q = search.toLowerCase();
        return allNames.filter(n => n.toLowerCase().includes(q)).slice(0, 80);
    }, [search]);

    const select = (name: string) => {
        onChange(name);
        setOpen(false);
        setSearch("");
    };

    return (
        <Popover open={open} onOpenChange={o => { setOpen(o); if (!o) setSearch(""); }}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    className="flex items-center justify-center size-9 rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors disabled:opacity-50 shrink-0"
                >
                    <IconPreview name={value} className="size-4 text-zinc-700" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="start" side="bottom">
                <div className="p-2 border-b border-zinc-100">
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar ícone..."
                        className="w-full h-8 px-2.5 rounded-md border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-400 bg-white"
                        autoFocus
                    />
                </div>
                <div className="p-2 grid grid-cols-8 gap-1 max-h-52 overflow-y-auto">
                    {filtered.length === 0 && (
                        <p className="col-span-8 text-center text-xs text-zinc-400 py-4">Nenhum ícone encontrado</p>
                    )}
                    {filtered.map(name => {
                        const Icon = icons[name] as LucideIcon;
                        return (
                            <button
                                key={name}
                                type="button"
                                onClick={() => select(name)}
                                title={name}
                                className={`flex items-center justify-center size-7 rounded-md transition-colors ${value === name ? "bg-zinc-900 text-white" : "hover:bg-zinc-100 text-zinc-600"}`}
                            >
                                <Icon className="size-3.5" />
                            </button>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}
