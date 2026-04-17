import { useState } from "react";
import { api } from "../api/client";
import type { ApiResponse } from "../types";

export function OperationsSection() {
  const [inventoryProductId, setInventoryProductId] = useState("P-100");
  const [inventoryQuantity, setInventoryQuantity] = useState(1);

  const [orderCustomer, setOrderCustomer] = useState("David");
  const [orderTotal, setOrderTotal] = useState(100);
  const [orderId, setOrderId] = useState("");

  const [paymentAmount, setPaymentAmount] = useState(120);
  const [paymentId, setPaymentId] = useState("");

  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState("");

  const runAction = async (
    actionKey: string,
    request: () => Promise<any>
  ) => {
    try {
      setLoadingAction(actionKey);
      setError("");
      const response = await request();
      setResult(response.data);
    } catch (err: any) {
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Ocurrió un error al ejecutar la operación.";
      setError(backendMessage);
      console.error(err);
    } finally {
      setLoadingAction("");
    }
  };

  return (
    <section className="panel">
      <div className="section-header">
        <div>
          <h2>Operaciones de Microservicios</h2>
          <p>Ejecuta acciones reales sobre inventory, orders y payments.</p>
        </div>
      </div>

      {error && <div className="alert error-alert">{error}</div>}

      <div className="operations-grid">
        <div className="operation-card">
          <h3>Inventory</h3>

          <div className="form-group">
            <label>Product ID</label>
            <input
              value={inventoryProductId}
              onChange={(e) => setInventoryProductId(e.target.value)}
              placeholder="P-100"
            />
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              min="1"
              value={inventoryQuantity}
              onChange={(e) => setInventoryQuantity(Number(e.target.value))}
            />
          </div>

          <div className="button-group">
            <button
              className="primary-button"
              disabled={loadingAction === "inventory-check"}
              onClick={() =>
                runAction("inventory-check", () =>
                  api.post<ApiResponse>("/services/inventory/checkStock", {
                    productId: inventoryProductId,
                  })
                )
              }
            >
              {loadingAction === "inventory-check" ? "Consultando..." : "Check Stock"}
            </button>

            <button
              className="secondary-button"
              disabled={loadingAction === "inventory-add"}
              onClick={() =>
                runAction("inventory-add", () =>
                  api.post<ApiResponse>("/services/inventory/addStock", {
                    productId: inventoryProductId,
                    quantity: inventoryQuantity,
                  })
                )
              }
            >
              {loadingAction === "inventory-add" ? "Agregando..." : "Add Stock"}
            </button>

            <button
              className="secondary-button"
              disabled={loadingAction === "inventory-remove"}
              onClick={() =>
                runAction("inventory-remove", () =>
                  api.post<ApiResponse>("/services/inventory/removeStock", {
                    productId: inventoryProductId,
                    quantity: inventoryQuantity,
                  })
                )
              }
            >
              {loadingAction === "inventory-remove" ? "Quitando..." : "Remove Stock"}
            </button>
          </div>
        </div>

        <div className="operation-card">
          <h3>Orders</h3>

          <div className="form-group">
            <label>Customer</label>
            <input
              value={orderCustomer}
              onChange={(e) => setOrderCustomer(e.target.value)}
              placeholder="David"
            />
          </div>

          <div className="form-group">
            <label>Total</label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={orderTotal}
              onChange={(e) => setOrderTotal(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Order ID</label>
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="ORD-XXXXXXXX"
            />
          </div>

          <div className="button-group">
            <button
              className="primary-button"
              disabled={loadingAction === "order-create"}
              onClick={() =>
                runAction("order-create", async () => {
                  const response = await api.post<ApiResponse>("/services/orders/createOrder", {
                    customer: orderCustomer,
                    total: orderTotal,
                  });

                  const createdOrderId = response.data?.data?.order?.orderId;
                  if (createdOrderId) {
                    setOrderId(createdOrderId);
                  }

                  return response;
                })
              }
            >
              {loadingAction === "order-create" ? "Creando..." : "Create Order"}
            </button>

            <button
              className="secondary-button"
              disabled={loadingAction === "order-get"}
              onClick={() =>
                runAction("order-get", () =>
                  api.post<ApiResponse>("/services/orders/getOrder", {
                    orderId,
                  })
                )
              }
            >
              {loadingAction === "order-get" ? "Consultando..." : "Get Order"}
            </button>

            <button
              className="secondary-button"
              disabled={loadingAction === "order-cancel"}
              onClick={() =>
                runAction("order-cancel", () =>
                  api.post<ApiResponse>("/services/orders/cancelOrder", {
                    orderId,
                  })
                )
              }
            >
              {loadingAction === "order-cancel" ? "Cancelando..." : "Cancel Order"}
            </button>
          </div>
        </div>

        <div className="operation-card">
          <h3>Payments</h3>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Payment ID</label>
            <input
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              placeholder="PAY-XXXXXXXX"
            />
          </div>

          <div className="button-group">
            <button
              className="primary-button"
              disabled={loadingAction === "payment-charge"}
              onClick={() =>
                runAction("payment-charge", async () => {
                  const response = await api.post<ApiResponse>("/services/payments/charge", {
                    amount: paymentAmount,
                  });

                  const createdPaymentId = response.data?.data?.payment?.paymentId;
                  if (createdPaymentId) {
                    setPaymentId(createdPaymentId);
                  }

                  return response;
                })
              }
            >
              {loadingAction === "payment-charge" ? "Cobrando..." : "Charge"}
            </button>

            <button
              className="secondary-button"
              disabled={loadingAction === "payment-status"}
              onClick={() =>
                runAction("payment-status", () =>
                  api.post<ApiResponse>("/services/payments/status", {
                    paymentId,
                  })
                )
              }
            >
              {loadingAction === "payment-status" ? "Consultando..." : "Status"}
            </button>

            <button
              className="secondary-button"
              disabled={loadingAction === "payment-refund"}
              onClick={() =>
                runAction("payment-refund", () =>
                  api.post<ApiResponse>("/services/payments/refund", {
                    paymentId,
                  })
                )
              }
            >
              {loadingAction === "payment-refund" ? "Reembolsando..." : "Refund"}
            </button>
          </div>
        </div>
      </div>

      <div className="result-panel">
        <h3>Resultado de la operación</h3>

        {result ? (
          <pre>{JSON.stringify(result, null, 2)}</pre>
        ) : (
          <div className="empty-box">
            Aquí se mostrará la respuesta del backend cuando ejecutes una operación.
          </div>
        )}
      </div>
    </section>
  );
}