import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase!.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase!.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setSignupDone(true);
    }

    setLoading(false);
  }

  if (signupDone) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-paper">
        <div className="w-full max-w-sm space-y-3 text-center">
          <h1 className="font-display text-2xl font-medium text-ink">Check your email</h1>
          <p className="text-sm text-ink-soft">
            We sent a confirmation link to <strong>{email}</strong>. Click it, then come back to log in.
          </p>
          <button
            type="button"
            onClick={() => { setMode("login"); setSignupDone(false); }}
            className="text-xs font-medium text-brass hover:underline"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-paper">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 font-display text-2xl font-medium text-ink">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>
        <p className="mb-6 text-sm text-ink-soft">
          {mode === "login"
            ? "Sign in to your student agent."
            : "Sign up to get started."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-ink-soft">Email</span>
            <input
              type="email"
              className="input w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-ink-soft">Password</span>
            <input
              type="password"
              className="input w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={6}
            />
          </label>

          {error && <p className="text-xs text-rust">{error}</p>}

          <button type="submit" disabled={loading} className="btn-brass w-full">
            {loading ? "…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-ink-soft">
          {mode === "login" ? "No account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
            className="font-medium text-brass hover:underline"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
