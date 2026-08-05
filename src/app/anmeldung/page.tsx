"use client";

import styles from "../styles/anmeldung-styles/container.module.css";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  fetchCurrentUser,
  login,
  register
} from "@/lib/api/auth";

type FormMode = "login" | "register";

type LoginForm = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type LoginErrors = Partial<LoginForm>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export default function Anmeldung() {
  const router = useRouter();
  const [mode, setMode] = useState<FormMode>("login");
  const [form, setForm] = useState<LoginForm>({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCurrentUser()
      .then((user) => {
        if (user) router.replace("/overview");
      })
      .catch(() => {});
  }, [router]);

  const resetMessages = (): void => {
    setErrors({});
    setGeneralError("");
  };

  const switchMode = (nextMode: FormMode): void => {
    setMode(nextMode);
    resetMessages();
    setForm({
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
  };

  const validate = (): LoginErrors => {
    const nextErrors: LoginErrors = {};

    if (form.username.trim().length < 2) {
      nextErrors.username = "Bitte gib mindestens 2 Zeichen ein.";
    }

    if (mode === "register" && !EMAIL_PATTERN.test(normalizeEmail(form.email))) {
      nextErrors.email = "Bitte gib eine gültige E-Mail-Adresse ein.";
    }

    if (!form.password) {
      nextErrors.password = "Bitte gib dein Passwort ein.";
    }

    if (mode === "register" && form.password.length < 4) {
      nextErrors.password = "Das Passwort braucht mindestens 4 Zeichen.";
    }

    if (mode === "register" && form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Die Passwörter stimmen nicht überein.";
    }

    return nextErrors;
  };

  const handleLogin = async (): Promise<void> => {
    const usernameValue = form.username.trim();
    await login(usernameValue, form.password);
    router.push("/overview");
  };

  const handleRegister = async (): Promise<void> => {
    const usernameValue = form.username.trim();
    const emailValue = normalizeEmail(form.email);
    await register(usernameValue, emailValue, form.password);
    router.push("/overview");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await handleLogin();
      } else {
        await handleRegister();
      }
    } catch (error) {
      setGeneralError(
        error instanceof Error
          ? error.message
          : "Die Daten konnten nicht gespeichert werden."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = mode === "login" ? "Anmeldung" : "Registrierung";

  return (
    <main className={styles.page}>
      <section className={styles.panel} aria-labelledby="login-title">
        <div className={styles.intro}>
          <p className={styles.eyebrow}>Die kleinen Einsteins</p>
          <h1 id="login-title" className={styles.title}>
            {title}
          </h1>
          <p className={styles.subtitle}>
            {mode === "login"
              ? "Melde dich an und arbeite weiter an deinen Vokabeln."
              : "Erstelle einen neuen Benutzer und starte direkt im Karteikasten."}
          </p>
        </div>

        <div className={styles.modeSwitch} aria-label="Anmeldeart">
          <button
            className={`${styles.switchButton} ${mode === "login" ? styles.activeSwitch : ""}`}
            type="button"
            onClick={() => switchMode("login")}
          >
            Anmelden
          </button>
          <button
            className={`${styles.switchButton} ${mode === "register" ? styles.activeSwitch : ""}`}
            type="button"
            onClick={() => switchMode("register")}
          >
            Registrieren
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-username">
              Benutzername
            </label>
            <input
              className={styles.input}
              id="login-username"
              type="text"
              autoComplete="username"
              value={form.username}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, username: event.target.value }))
              }
              aria-invalid={errors.username ? "true" : "false"}
              aria-describedby={errors.username ? "login-username-error" : undefined}
            />
            {errors.username && (
              <p className={styles.error} id="login-username-error">
                {errors.username}
              </p>
            )}
          </div>

          {mode === "register" && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="login-email">
                E-Mail
              </label>
              <input
                className={styles.input}
                id="login-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, email: event.target.value }))
                }
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "login-email-error" : undefined}
              />
              {errors.email && (
                <p className={styles.error} id="login-email-error">
                  {errors.email}
                </p>
              )}
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-password">
              Passwort
            </label>
            <input
              className={styles.input}
              id="login-password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={form.password}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, password: event.target.value }))
              }
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "login-password-error" : undefined}
            />
            {errors.password && (
              <p className={styles.error} id="login-password-error">
                {errors.password}
              </p>
            )}
          </div>

          {mode === "register" && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="login-confirm-password">
                Passwort bestätigen
              </label>
              <input
                className={styles.input}
                id="login-confirm-password"
                type="password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    confirmPassword: event.target.value
                  }))
                }
                aria-invalid={errors.confirmPassword ? "true" : "false"}
                aria-describedby={
                  errors.confirmPassword ? "login-confirm-password-error" : undefined
                }
              />
              {errors.confirmPassword && (
                <p className={styles.error} id="login-confirm-password-error">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {mode === "login" && (
            <p className={styles.demoHint}>
              Demo-Nutzer: Test, Passwort 1234
            </p>
          )}

          {generalError && (
            <p className={styles.error} role="alert">
              {generalError}
            </p>
          )}

          <button className={styles.submit} type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Wird gespeichert..."
              : mode === "login"
                ? "Anmelden"
                : "Registrieren"}
          </button>
        </form>
      </section>
    </main>
  );
}
