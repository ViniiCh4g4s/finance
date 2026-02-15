import { Link } from '@inertiajs/react';
import type { AuthLayoutProps } from '@/types';
import { home } from '@/routes';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-zinc-50/50 p-6 md:p-10" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex items-center gap-2.5 font-medium"
                        >
                            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-sm font-bold">
                                F
                            </div>
                            <span className="text-lg font-bold text-zinc-900 tracking-tight">Finanças</span>
                        </Link>

                        <div className="space-y-2 text-center mt-2">
                            <h1 className="text-xl font-semibold text-zinc-900">{title}</h1>
                            <p className="text-center text-sm text-zinc-500">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
