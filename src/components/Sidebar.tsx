import { NavLink } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { supabaseReady } from "../lib/supabase";

const navItems = [
  { to: "/", label: "Workspace" },
  { to: "/colleges", label: "Colleges" },
  { to: "/profile", label: "Student Profile" },
];

export default function Sidebar() {
  const fullName = useAppStore((s) => s.profile.fullName);
  const signOut = useAppStore((s) => s.signOut);
  const user = useAppStore((s) => s.user);

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col bg-ink text-paper">
      <div className="px-6 py-7">
        <h1 className="font-display text-2xl font-medium tracking-tight">
          Ad<span className="text-brass">mit</span>.
        </h1>
        <p className="mt-1 text-xs text-paper/50">Application Workspace</p>
      </div>

      <div className="mx-6 mb-6 rounded-md border border-paper/10 bg-paper/5 px-3 py-2.5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-paper/40">
          Active student
        </p>
        <p className="mt-0.5 truncate font-display text-sm text-paper">
          {fullName || "No student yet"}
        </p>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `block border-l-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "border-brass bg-paper/[0.06] text-paper"
                  : "border-transparent text-paper/60 hover:text-paper"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {supabaseReady && user && (
        <div className="px-6 pb-4">
          <button
            type="button"
            onClick={signOut}
            className="text-[11px] text-paper/40 hover:text-paper/70"
          >
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
}
