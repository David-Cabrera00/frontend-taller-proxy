import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>Centro de monitoreo</h2>
        <p>Control operativo de inventario, pedidos y pagos</p>
      </aside>

      <main className="main-content">
        <DashboardPage />
      </main>
    </div>
  );
}
