const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "10minutemail.com",
  "guerrillamail.com",
  "sharklasers.com",
  "grr.la",
  "yopmail.com",
  "trashmail.com",
  "temp-mail.org",
  "tempmail.com",
  "throwawaymail.com",
  "getnada.com",
  "maildrop.cc",
  "dispostable.com",
  "mailnesia.com",
  "33mail.com",
  "emailondeck.com",
  "inboxbear.com",
  "mytemp.email",
  "fakeinbox.com",
  "spam4.me",
  "tmail.ws",
  "maileater.com",
  "burnermail.io",
]);

const RESERVED_DOMAINS = new Set([
  "example.com",
  "example.org",
  "example.net",
  "test.com",
  "mail.com",
]);

const FAKE_EMAIL_LOCAL_PARTS = ["test", "fake", "faux", "toto", "asdf", "qwerty", "teste", "bonjour", "admin", "xxx"];

const FAKE_NAME_PATTERNS = ["test", "fake", "faux", "toto", "inconnu", "asdf", "qwerty", "allllllll"];

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export function isValidEmail(email: string): boolean {
  const value = email.trim();
  if (!EMAIL_REGEX.test(value)) return false;
  const domain = value.split("@")[1].toLowerCase();
  if (DISPOSABLE_DOMAINS.has(domain) || RESERVED_DOMAINS.has(domain)) return false;
  const tld = domain.split(".").pop() ?? "";
  if (["test", "invalid", "localhost", "local"].includes(tld)) return false;
  const local = value.split("@")[0].toLowerCase();
  if (FAKE_EMAIL_LOCAL_PARTS.some((p) => local.includes(p))) return false;
  return true;
}

export function emailError(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return "L'adresse email est obligatoire.";
  if (!EMAIL_REGEX.test(trimmed)) return "Adresse email invalide.";
  const domain = trimmed.split("@")[1].toLowerCase();
  if (DISPOSABLE_DOMAINS.has(domain))
    return "Les adresses email jetables ne sont pas autorisées.";
  if (RESERVED_DOMAINS.has(domain))
    return "Cette adresse email ne peut pas être utilisée.";
  const local = trimmed.split("@")[0].toLowerCase();
  if (FAKE_EMAIL_LOCAL_PARTS.some((p) => local.includes(p)))
    return "Merci de renseigner une adresse email réelle.";
  return null;
}

export function normalizePhone(phone: string): string {
  return phone.replace(/[\s.\-()]/g, "");
}

export function isValidMoroccanPhone(phone: string): boolean {
  let value = normalizePhone(phone);
  if (/^\+?212/.test(value)) {
    value = value.replace(/^\+?212/, "");
  }
  if (value.length === 10 && value.startsWith("0")) {
    value = value.slice(1);
  }
  if (value.length !== 9) return false;
  if (!/^\d{9}$/.test(value)) return false;
  return ["5", "6", "7"].includes(value[0]);
}

export function phoneError(phone: string): string | null {
  const value = normalizePhone(phone);
  if (!value) return "Le numéro de téléphone est obligatoire.";
  if (!isValidMoroccanPhone(phone))
    return "Numéro marocain invalide — formats acceptés : 06 XX XX XX XX, 07 XX XX XX XX, +212 6 XX XX XX XX.";
  return null;
}

export function isValidName(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length < 5) return false;
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 2) return false;
  const lower = trimmed.toLowerCase();
  if (FAKE_NAME_PATTERNS.some((p) => lower.includes(p))) return false;
  if (/([a-zà-ÿ])\1{3,}/i.test(trimmed)) return false;
  return words.every((w) => w.length >= 2 && /^[\p{L}][\p{L}'’-]+$/u.test(w));
}

export function nameError(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return "Le nom complet est obligatoire.";
  if (!isValidName(trimmed))
    return "Merci de saisir un nom et un prénom réels (lettres uniquement).";
  return null;
}

export function isValidPassword(password: string): boolean {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/\d/.test(password)) return false;
  return true;
}

export function passwordError(password: string): string | null {
  if (!password) return "Le mot de passe est obligatoire.";
  if (password.length < 8)
    return "Le mot de passe doit contenir au moins 8 caractères.";
  if (!/[A-Z]/.test(password))
    return "Le mot de passe doit contenir au moins une majuscule.";
  if (!/[a-z]/.test(password))
    return "Le mot de passe doit contenir au moins une minuscule.";
  if (!/\d/.test(password))
    return "Le mot de passe doit contenir au moins un chiffre.";
  return null;
}

const CIN_REGEX = /^[A-Za-z]{1,2}\d{4,7}$/;

export function isValidCin(cin: string): boolean {
  return CIN_REGEX.test(cin.trim().toUpperCase());
}

export function cinError(cin: string): string | null {
  const value = cin.trim();
  if (!value) return "Le numéro de pièce d'identité est obligatoire.";
  if (!CIN_REGEX.test(value.toUpperCase()))
    return "Numéro de CIN invalide (exemple : AB123456).";
  return null;
}

export function companyError(company: string): string | null {
  const value = company.trim();
  if (!value) return "Le nom de l'agence ou de l'entreprise est obligatoire.";
  if (value.length < 3) return "Nom d'agence trop court (3 caractères minimum).";
  return null;
}