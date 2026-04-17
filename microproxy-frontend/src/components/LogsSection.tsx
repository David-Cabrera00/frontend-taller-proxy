import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { ApiResponse, AuditLog, PageResponse } from "../types";

const PAGE_SIZE = 10;

export function LogsSection() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [service, setService] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadLogs = async (targetPage = page, selectedService = service, selectedStatus = status) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      params.append("page", String(targetPage));
      params.append("size", String(PAGE_SIZE));

      if (selectedService) {
        params.append("service", selectedService);
      }

      if (selectedStatus) {
        params.append("status", selectedStatus);
      }

      const response = await api.get<ApiResponse<PageResponse<AuditLog>>>(
        `/metrics/logs?${params.toString()}`
      );

      const pageData = response.data.data;
      setLogs(pageData.content);
      setPage(pageData.page);
      setTotalPages(pageData.totalPages);
    } catch (err) {
      setError("No se pudieron cargar los logs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs(0, service, status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilters = async () => {
    await loadLogs(0, service, status);
  };

  const handlePreviousPage = async () => {
    if (page > 0) {
      await loadLogs(page - 1, service, status);
    }
  };

  const handleNextPage = async () => {
    if (page < totalPages - 1) {
      await loadLogs(page + 1, service, status);
    }
  };

  return (
    <section className="panel">
      <div className="section-header">
        <div>
          <h2>Logs de Auditoría</h2>
          <p>Registro de llamadas ejecutadas por los microservicios.</p>
        </div>

        <button className="secondary-button" onClick={() => loadLogs(0, service, status)}>
          Recargar
        </button>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label htmlFor="service">Servicio</label>
          <select
            id="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="inventory">Inventory</option>
            <option value="orders">Orders</option>
            <option value="payments">Payments</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status">Estado</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="ERROR">ERROR</option>
          </select>
        </div>

        <div className="filter-actions">
          <button className="primary-button" onClick={handleApplyFilters}>
            Aplicar filtros
          </button>
        </div>
      </div>

      {error && <div className="alert error-alert">{error}</div>}

      {loading ? (
        <div className="loading-box">Cargando logs...</div>
      ) : logs.length === 0 ? (
        <div className="empty-box">No hay logs para los filtros seleccionados.</div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Servicio</th>
                  <th>Operación</th>
                  <th>Duración</th>
                  <th>Estado</th>
                  <th>Request ID</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.requestId}>
                    <td>{formatDate(log.timestamp)}</td>
                    <td className="capitalize-cell">{log.serviceId}</td>
                    <td>{log.operation}</td>
                    <td>{log.durationMs} ms</td>
                    <td>
                      <span
                        className={
                          log.status === "SUCCESS" ? "status-badge success" : "status-badge error"
                        }
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="request-id-cell">{log.requestId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-bar">
            <button
              className="secondary-button"
              onClick={handlePreviousPage}
              disabled={page === 0}
            >
              Anterior
            </button>

            <span>
              Página <strong>{totalPages === 0 ? 0 : page + 1}</strong> de{" "}
              <strong>{totalPages}</strong>
            </span>

            <button
              className="secondary-button"
              onClick={handleNextPage}
              disabled={page >= totalPages - 1 || totalPages === 0}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </section>
  );
}

function formatDate(timestamp: string) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleString("es-CO");
}