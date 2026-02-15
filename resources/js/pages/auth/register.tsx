import { Form, Head, Link } from '@inertiajs/react';
import { Check, ArrowRight } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login, home } from '@/routes';
import { store } from '@/routes/register';

const perks = [
    "Acesso completo por 30 dias",
    "Registros ilimitados de receitas e despesas",
    "Controle de parcelas e assinaturas",
    "Metas financeiras com progresso visual",
    "Carteira de investimentos e proventos",
    "Sem cartão de crédito necessário",
];

export default function Register() {
    return (
        <>
            <Head title="Criar conta" />
            <div className="min-h-svh flex" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

                {/* Left — Benefits panel */}
                <div className="hidden lg:flex lg:w-[45%] bg-zinc-900 text-white flex-col justify-between p-12">
                    <div>
                        <Link href={home().url} className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white text-sm font-bold">F</div>
                            <span className="text-lg font-bold tracking-tight">Finanças</span>
                        </Link>
                    </div>

                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
                            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
                            30 dias grátis
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight leading-snug mb-4">
                            Comece a controlar<br />suas finanças hoje.
                        </h2>
                        <p className="text-zinc-400 leading-relaxed mb-10 max-w-sm">
                            Crie sua conta em segundos e tenha acesso completo a todas as ferramentas — sem compromisso.
                        </p>
                        <ul className="space-y-3">
                            {perks.map(p => (
                                <li key={p} className="flex items-center gap-3 text-sm text-zinc-300">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-emerald-400" />
                                    </div>
                                    {p}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <blockquote className="border-l-2 border-zinc-700 pl-4">
                        <p className="text-sm text-zinc-400 italic">"Finalmente parei de perder dinheiro sem saber onde."</p>
                        <p className="text-xs text-zinc-500 mt-2">— Ana P., usuária desde 2025</p>
                    </blockquote>
                </div>

                {/* Right — Form */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-zinc-50/50">
                    <div className="w-full max-w-md">
                        {/* Mobile logo */}
                        <div className="lg:hidden flex items-center gap-2.5 mb-10">
                            <Link href={home().url} className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-sm font-bold">F</div>
                                <span className="text-lg font-bold text-zinc-900 tracking-tight">Finanças</span>
                            </Link>
                        </div>

                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Crie sua conta</h1>
                            <p className="mt-2 text-sm text-zinc-500">Preencha os dados abaixo para começar</p>
                        </div>

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password', 'password_confirmation']}
                            disableWhileProcessing
                            className="flex flex-col gap-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-5">
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="name">Nome</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="name"
                                                name="name"
                                                placeholder="Nome completo"
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label htmlFor="email">E-mail</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                tabIndex={2}
                                                autoComplete="email"
                                                name="email"
                                                placeholder="email@exemplo.com"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="grid gap-1.5">
                                                <Label htmlFor="password">Senha</Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    required
                                                    tabIndex={3}
                                                    autoComplete="new-password"
                                                    name="password"
                                                    placeholder="Mín. 8 caracteres"
                                                />
                                                <InputError message={errors.password} />
                                            </div>
                                            <div className="grid gap-1.5">
                                                <Label htmlFor="password_confirmation">Confirmar</Label>
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    required
                                                    tabIndex={4}
                                                    autoComplete="new-password"
                                                    name="password_confirmation"
                                                    placeholder="Repita a senha"
                                                />
                                                <InputError message={errors.password_confirmation} />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-11 mt-1"
                                            tabIndex={5}
                                            data-test="register-user-button"
                                        >
                                            {processing ? <Spinner /> : (
                                                <span className="flex items-center gap-2">
                                                    Criar conta grátis
                                                    <ArrowRight className="w-4 h-4" />
                                                </span>
                                            )}
                                        </Button>
                                    </div>

                                    {/* Mobile perks */}
                                    <div className="lg:hidden flex flex-wrap gap-x-4 gap-y-1 justify-center mt-1">
                                        {["30 dias grátis", "Sem cartão", "Cancele a qualquer hora"].map(t => (
                                            <span key={t} className="flex items-center gap-1 text-xs text-zinc-400">
                                                <Check className="w-3 h-3 text-emerald-500" /> {t}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="text-center text-sm text-zinc-500 mt-2">
                                        Já tem uma conta?{' '}
                                        <TextLink href={login()} tabIndex={6}>
                                            Entrar
                                        </TextLink>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}
