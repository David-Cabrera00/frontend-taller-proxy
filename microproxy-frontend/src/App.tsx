import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>Microproxy</h2>
        <p>Panel de monitoreo</p>
      </aside>

      <main className="main-content">
        <DashboardPage />
      </main>
    </div>
  );
}
