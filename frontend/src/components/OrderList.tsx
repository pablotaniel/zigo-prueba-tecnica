import React, { useState } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  fetchOrder,
  fetchOrders,
  updateOrder,
} from '../api/orders';

import {
  Order,
  OrderStatus,
  UpdateOrderPayload,
} from '../types/order';

interface Props {
  onBack: () => void;
}

interface UpdateStatusData {
  orderId: string;
  status: OrderStatus;
}

const OrdersList: React.FC<Props> = ({ onBack }) => {
  const queryClient = useQueryClient();

  const [errorMessage, setErrorMessage] = useState('');
  const [updatingOrderId, setUpdatingOrderId] =
    useState<string | null>(null);

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: UpdateStatusData) => {
      const completeOrder = await fetchOrder(orderId);

      const payload: UpdateOrderPayload = {
        customer_id: completeOrder.customer_id,
        status,
        notes: completeOrder.notes || undefined,
        items: completeOrder.items.map((item) => ({
          product_id: item.product_id,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
        })),
      };

      return updateOrder(orderId, payload);
    },

    onMutate: ({ orderId }) => {
      setUpdatingOrderId(orderId);
      setErrorMessage('');
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['orders'],
      });

      setUpdatingOrderId(null);
    },

    onError: (error: any) => {
      setUpdatingOrderId(null);

      setErrorMessage(
        error.response?.data?.error ||
          error.message ||
          'Error al cambiar el estado de la orden'
      );
    },
  });

  const handleStatusChange = (
    order: Order,
    newStatus: OrderStatus
  ) => {
    if (newStatus === order.status) {
      return;
    }

    updateStatusMutation.mutate({
      orderId: order.id,
      status: newStatus,
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-success';

      case 'CANCELLED':
        return 'bg-danger';

      default:
        return 'bg-warning text-dark';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmada';

      case 'CANCELLED':
        return 'Cancelada';

      default:
        return 'Borrador';
    }
  };

  const formatDate = (date?: string) => {
    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleString('es-GT', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  return (
    <div className="container-fluid bg-light min-vh-100">

      <nav className="navbar navbar-dark bg-primary shadow">
        <div className="container-fluid">

          <span className="navbar-brand fw-bold">
            <i className="fas fa-clipboard-list me-2"></i>
            Lista de órdenes
          </span>

          <button
            type="button"
            className="btn btn-outline-light"
            onClick={onBack}
          >
            <i className="fas fa-arrow-left me-2"></i>
            Regresar
          </button>

        </div>
      </nav>

      <div className="container py-4">

        {errorMessage && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            <i className="fas fa-circle-exclamation me-2"></i>

            {errorMessage}

            <button
              type="button"
              className="btn-close"
              onClick={() => setErrorMessage('')}
            ></button>
          </div>
        )}

        <div className="card shadow-sm">

          <div className="card-header d-flex justify-content-between align-items-center">

            <span className="fw-bold">
              <i className="fas fa-list me-2"></i>
              Órdenes registradas
            </span>

            <span className="badge bg-primary">
              {orders.length} órdenes
            </span>

          </div>

          <div className="card-body">

            {isLoading && (
              <div className="text-center py-5">

                <div className="spinner-border text-primary"></div>

                <p className="text-muted mt-3 mb-0">
                  Cargando órdenes...
                </p>

              </div>
            )}

            {isError && (
              <div className="alert alert-danger mb-0">
                No se pudieron cargar las órdenes.
              </div>
            )}

            {!isLoading &&
              !isError &&
              orders.length === 0 && (
                <div className="text-center text-muted py-5">

                  <i className="fas fa-file-invoice fa-3x mb-3"></i>

                  <p className="mb-0">
                    No hay órdenes registradas.
                  </p>

                </div>
              )}

            {!isLoading &&
              !isError &&
              orders.length > 0 && (
                <div className="table-responsive">

                  <table className="table table-hover align-middle">

                    <thead className="table-light">
                      <tr>
                        <th>Orden</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th className="text-end">
                          Total
                        </th>
                        <th>Estado actual</th>
                        <th style={{ minWidth: '180px' }}>
                          Cambiar estado
                        </th>
                      </tr>
                    </thead>

                    <tbody>

                      {orders.map((order) => {
                        const isUpdating =
                          updatingOrderId === order.id;

                        return (
                          <tr key={order.id}>

                            <td>
                              <div className="fw-bold">
                                <i className="fas fa-file-invoice text-primary me-2"></i>

                                {order.id.slice(0, 8)}
                              </div>

                              <div className="small text-muted">
                                {order.id}
                              </div>
                            </td>

                            <td>
                              <div className="fw-semibold">
                                {order.customer_name ||
                                  'Cliente'}
                              </div>

                              <div className="small text-muted">
                                {order.customer_id}
                              </div>
                            </td>

                            <td>
                              {formatDate(
                                order.created_at
                              )}
                            </td>

                            <td className="text-end fw-bold">
                              Q{' '}
                              {Number(
                                order.total
                              ).toFixed(2)}
                            </td>

                            <td>
                              <span
                                className={`badge ${getStatusBadge(
                                  order.status
                                )}`}
                              >
                                {getStatusText(
                                  order.status
                                )}
                              </span>
                            </td>

                            <td>
                              <div className="d-flex align-items-center gap-2">

                                <select
                                  className="form-select form-select-sm"
                                  value={order.status}
                                  onChange={(event) =>
                                    handleStatusChange(
                                      order,
                                      event.target
                                        .value as OrderStatus
                                    )
                                  }
                                  disabled={isUpdating}
                                >
                                  <option value="DRAFT">
                                    Borrador
                                  </option>

                                  <option value="CONFIRMED">
                                    Confirmada
                                  </option>

                                  <option value="CANCELLED">
                                    Cancelada
                                  </option>
                                </select>

                                {isUpdating && (
                                  <span
                                    className="spinner-border spinner-border-sm text-primary"
                                    role="status"
                                  ></span>
                                )}

                              </div>
                            </td>

                          </tr>
                        );
                      })}

                    </tbody>

                  </table>

                </div>
              )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default OrdersList;

