import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Toast from "./components/Toast";
import Workspace from "./pages/Workspace";
import StudentProfile from "./pages/StudentProfile";
import CollegesPage from "./pages/CollegesPage";
import AuthPage from "./pages/AuthPage";
import { useAppStore } from "./store/useAppStore";
import { supabase, supabaseReady } from "./lib/supabase";

function App() {
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const isLoading = useAppStore((s) => s.isLoading);
  const initializeFromSupabase = useAppStore((s) => s.initializeFromSupabase);

  useEffect(() => {
    if (!supabaseReady || !supabase) return;
    const client = supabase;

    client.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, [setUser]);

  useEffect(() => {
    initializeFromSupabase();
  }, [user, initializeFromSupabase]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-paper">
        <p className="text-sm text-ink-soft">Loading…</p>
      </div>
    );
  }

  if (supabaseReady && !user) {
    return <AuthPage />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-paper">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Workspace />} />
          <Route path="/colleges" element={<CollegesPage />} />
          <Route path="/profile" element={<StudentProfile />} />
        </Routes>
      </main>
      <Toast />
    </div>
  );
}

export default App;
