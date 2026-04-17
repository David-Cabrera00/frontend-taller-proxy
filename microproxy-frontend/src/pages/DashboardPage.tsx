import { useEffect, useState } from "react";
import { api } from "../api/client";
import { MetricCard } from "../components/MetricCard";
import type { ApiResponse, ServiceSummary } from "../types";

export default function DashboardPage() {
  const [summary, setSummary] = useState<ServiceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState("");

  const loadSummary = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<ApiResponse<ServiceSummary[]>>("/metrics/summary");
      setSummary(response.data.data);
    } catch (err) {
      setError("No se pudieron cargar las métricas del backend.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const simulateLoad = async () => {
    try {
      setSimulating(true);
      setError("");

      await api.post("/metrics/simulate-load");
      await loadSummary();
    } catch (err) {
      setError("No se pudo ejecutar la simulación de carga.");
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard de Monitoreo</h1>
          <p>Resumen general de los microservicios monitoreados por proxy.</p>
        </div>

        <button className="primary-button" onClick={simulateLoad} disabled={simulating}>
          {simulating ? "Simulando..." : "Simular carga"}
        </button>
      </div>

      {error && <div className="alert error-alert">{error}</div>}

      {loading ? (
        <div className="loading-box">Cargando métricas...</div>
      ) : summary.length === 0 ? (
        <div className="empty-box">
          Aún no hay datos. Presiona <strong>Simular carga</strong> para generar actividad.
        </div>
      ) : (
        <>
          <div className="summary-grid">
            {summary.map((item) => (
              <div key={item.serviceId} className="service-panel">
                <h2>{item.serviceId}</h2>

                <div className="cards-grid">
                  <MetricCard
                    title="Llamadas totales"
                    value={item.totalCalls}
                    subtitle="Total de solicitudes registradas"
                  />
                  <MetricCard
                    title="Exitosas"
                    value={item.successCalls}
                    subtitle={`Tasa de éxito: ${item.successRate}%`}
                  />
                  <MetricCard
                    title="Errores"
                    value={item.errorCalls}
                    subtitle={`Tasa de error: ${item.errorRate}%`}
                  />
                  <MetricCard
                    title="Tiempo promedio"
                    value={`${item.averageResponseTimeMs} ms`}
                    subtitle="Tiempo medio de respuesta"
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}