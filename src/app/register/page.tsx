"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Check,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  UserRound,
  HeartHandshake,
  Phone,
  Briefcase,
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import {
  nameError,
  emailError,
  passwordError,
  phoneError,
  cinError,
  companyError,
} from "@/lib/validation";

const STEPS = [
  { key: "role", label: "Votre rôle", subtitle: "Comment comptez-vous utiliser DarEstate ?" },
  { key: "compte", label: "Votre compte", subtitle: "Créez vos identifiants de connexion." },
  { key: "profil", label: "Complétez votre profil", subtitle: "Finalisez vos informations pour la plateforme." },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

type FieldKey = "name" | "email" | "password" | "confirm" | "phone" | "company" | "cin";

type FieldErrors = Partial<Record<FieldKey, string>>;

function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={step.key} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                done && "bg-gold text-ink",
                active && "bg-gold/20 text-gold ring-2 ring-gold/40",
                !done && !active && "bg-muted text-muted-foreground"
              )}
            >
              {done ? <Check className="size-4" /> : index + 1}
            </span>
            <span
              className={cn(
                "hidden text-xs font-medium sm:block",
                active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
            {index < STEPS.length - 1 && (
              <span className="h-px flex-1 bg-border" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-destructive">
      <CircleAlert className="size-3.5 shrink-0" />
      {message}
    </p>
  );
}

function PasswordChecklist({ password }: { password: string }) {
  const checks = [
    { label: "8 caractères minimum", ok: password.length >= 8 },
    { label: "Une majuscule", ok: /[A-Z]/.test(password) },
    { label: "Une minuscule", ok: /[a-z]/.test(password) },
    { label: "Au moins un chiffre", ok: /\d/.test(password) },
  ];
  return (
    <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
      {checks.map((c) => (
        <li
          key={c.label}
          className={cn(
            "flex items-center gap-1.5 text-xs",
            c.ok ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
          )}
        >
          <Check className={cn("size-3.5 shrink-0", c.ok ? "" : "opacity-30")} />
          {c.label}
        </li>
      ))}
    </ul>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [step, setStep] = useState<StepKey>("role");
  const stepIndex = STEPS.findIndex((s) => s.key === step);
  const [role, setRole] = useState<UserRole>(UserRole.BUYER);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    cin: "",
    password: "",
    confirm: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isProfessional = role === UserRole.SELLER || role === UserRole.AGENT;

  const updateField = (key: FieldKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const back = () => {
    setError(null);
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) setStep(STEPS[prevIndex].key);
  };

  const selectRole = (value: UserRole) => {
    setRole(value);
    setStep("compte");
  };

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const errors: FieldErrors = {};
    const nameErr = nameError(form.name);
    if (nameErr) errors.name = nameErr;
    const emailErr = emailError(form.email);
    if (emailErr) errors.email = emailErr;
    const pwdErr = passwordError(form.password);
    if (pwdErr) errors.password = pwdErr;
    if (form.password !== form.confirm)
      errors.confirm = "Les mots de passe ne correspondent pas.";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    next();
  };

  const validateProfile = (): FieldErrors => {
    const errors: FieldErrors = {};
    const phoneErr = phoneError(form.phone);
    if (phoneErr) errors.phone = phoneErr;
    if (isProfessional) {
      const companyErr = companyError(form.company);
      if (companyErr) errors.company = companyErr;
      const cinErr = cinError(form.cin);
      if (cinErr) errors.cin = cinErr;
    }
    return errors;
  };

  const next = () => {
    setStep(STEPS[stepIndex + 1].key);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const errors = validateProfile();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role,
        phone: form.phone,
        companyName: isProfessional ? form.company : undefined,
        cin: isProfessional ? form.cin : undefined,
      });
      setLoading(false);
      if (isProfessional) {
        router.push("/seller");
      } else {
        router.push("/buyer");
      }
    } catch (err) {
      setLoading(false);
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue. Merci de réessayer."
      );
    }
  };

  const roles = [
    {
      value: UserRole.BUYER,
      label: "Je cherche un bien",
      icon: HeartHandshake,
    },
    {
      value: UserRole.SELLER,
      label: "Je vends un bien",
      icon: UserRound,
    },
  ];

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-16 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
      {/* Left brand panel */}
      <div className="mb-10 hidden max-w-md lg:block">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary">
            <Building2 className="size-6 text-gold" />
          </span>
          <span className="font-display text-3xl font-semibold">
            Dar<span className="text-gold">Estate</span>
          </span>
        </div>
        <h1 className="mt-8 font-display text-4xl font-semibold leading-tight">
          Rejoignez la marketplace immobilière de confiance au Maroc.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Créez votre compte en quelques étapes pour acheter, vendre ou
          investir en toute sérénité.
        </p>
        <ul className="mt-8 space-y-3">
          {[
            "Biens et propriétaires vérifiés",
            "Identité et agences contrôlées avant mise en ligne",
            "Visites organisées et accompagnées",
            "Aucun frais caché",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm">
              <ShieldCheck className="size-4 text-gold" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Right form */}
      <div className="w-full max-w-md">
        <div className="mb-6 text-center lg:hidden">
          <span className="font-display text-2xl font-semibold">
            Dar<span className="text-gold">Estate</span>
          </span>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-sm">
          <StepIndicator current={stepIndex} />

          <div className="mt-6">
            <h2 className="font-display text-2xl font-semibold">
              {STEPS[stepIndex].label}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {STEPS[stepIndex].subtitle}
            </p>
          </div>

          {/* STEP 1 — Role */}
          {step === "role" && (
            <div className="mt-6">
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => selectRole(r.value)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border px-3 py-5 text-sm font-medium transition-all",
                        role === r.value
                          ? "border-gold bg-gold/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-gold/40"
                      )}
                    >
                      <Icon className={cn("size-6", role === r.value && "text-gold")} />
                      {r.label}
                      <span className="text-xs font-normal text-muted-foreground">
                        {r.value === UserRole.BUYER
                          ? "Parcourir, visiter, négocier"
                          : "Publier, vendre, gérer"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2 — Account */}
          {step === "compte" && (
            <form onSubmit={handleAccountSubmit} className="mt-6 space-y-4">
              {error && (
                <Alert variant="destructive">{error}</Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  required
                  placeholder="Ex : Fatima Zahra Alaoui"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="h-11"
                  aria-invalid={!!fieldErrors.name}
                />
                <FieldError message={fieldErrors.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="vous@email.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="h-11"
                  aria-invalid={!!fieldErrors.email}
                />
                <FieldError message={fieldErrors.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="8 caractères minimum"
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    className="h-11 pr-10"
                    aria-invalid={!!fieldErrors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Masquer" : "Afficher"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <PasswordChecklist password={form.password} />
                <FieldError message={fieldErrors.password} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirmer le mot de passe</Label>
                <Input
                  id="confirm"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Répétez le mot de passe"
                  value={form.confirm}
                  onChange={(e) => updateField("confirm", e.target.value)}
                  className="h-11"
                  aria-invalid={!!fieldErrors.confirm}
                />
                <FieldError message={fieldErrors.confirm} />
              </div>

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="ghost" onClick={back}>
                  <ArrowLeft className="mr-2 size-4" /> Retour
                </Button>
                <Button type="submit" className="flex-1 rounded-full py-6">
                  Continuer <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3 — Profile */}
          {step === "profil" && (
            <form onSubmit={handleFinalSubmit} className="mt-6 space-y-4">
              {error && <Alert variant="destructive">{error}</Alert>}

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    required
                    type="tel"
                    placeholder="+212 6 XX XX XX XX"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="h-11 pl-9"
                    aria-invalid={!!fieldErrors.phone}
                  />
                </div>
                <FieldError message={fieldErrors.phone} />
              </div>

              {isProfessional && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="company">Nom de l&apos;agence / entreprise</Label>
                    <div className="relative">
                      <Briefcase className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="company"
                        placeholder="Ex : Agence Atlas Immobilier"
                        value={form.company}
                        onChange={(e) => updateField("company", e.target.value)}
                        className="h-11 pl-9"
                        aria-invalid={!!fieldErrors.company}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ce nom sera affiché publiquement sur vos annonces.
                    </p>
                    <FieldError message={fieldErrors.company} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cin">Numéro de CIN</Label>
                    <div className="relative">
                      <CreditCard className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="cin"
                        placeholder="Ex : AB123456"
                        value={form.cin}
                        onChange={(e) => updateField("cin", e.target.value)}
                        className="h-11 pl-9"
                        aria-invalid={!!fieldErrors.cin}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Utilisé pour la vérification d&apos;identité avant la mise
                      en ligne de vos annonces.
                    </p>
                    <FieldError message={fieldErrors.cin} />
                  </div>
                </>
              )}

              <div className="rounded-xl border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
                En créant votre compte, vous acceptez nos{" "}
                <Link href="/legal/terms" className="font-medium text-gold hover:underline">
                  conditions générales
                </Link>{" "}
                et notre{" "}
                <Link href="/legal/privacy" className="font-medium text-gold hover:underline">
                  politique de confidentialité
                </Link>
                .
              </div>

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="ghost" onClick={back}>
                  <ArrowLeft className="mr-2 size-4" /> Retour
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-full py-6"
                >
                  {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Créer mon compte
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Déjà inscrit ?{" "}
            <Link href="/login" className="font-medium text-gold hover:underline">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}