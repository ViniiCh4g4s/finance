import { useRef } from "react";

interface Props {
    value: string;
    onChange: (raw: string) => void;
    placeholder?: string;
    className?: string;
}

function toRaw(formatted: string): string {
    const digits = formatted.replace(/\D/g, "");
    if (!digits) return "";
    const cents = parseInt(digits, 10);
    return (cents / 100).toFixed(2);
}

function toDisplay(raw: string): string {
    if (!raw) return "";
    const n = parseFloat(raw);
    if (isNaN(n)) return "";
    return n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function CurrencyInput({ value, onChange, placeholder, className }: Props) {
    const ref = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = toRaw(e.target.value);
        onChange(raw);
    };

    return (
        <input
            ref={ref}
            inputMode="numeric"
            placeholder={placeholder ?? "0,00"}
            value={toDisplay(value)}
            onChange={handleChange}
            className={className}
        />
    );
}
