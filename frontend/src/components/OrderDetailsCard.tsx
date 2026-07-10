import React from 'react';
import { Order } from '../types/order';

interface Props {
  order: Order;
}

export const OrderDetailsCard: React.FC<Props> = ({ order }) => {
  const items = order.items ?? [];

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
      }}
    >
      <h2>Orden #{order.id}</h2>

      <p>
        <strong>Cliente:</strong> {order.customerId}
      </p>

      <p>
        <strong>Estado:</strong> {order.status}
      </p>

      <h3>Productos en la orden</h3>

      {items.length === 0 ? (
        <p>No hay productos en la orden.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.productId}>
              {item.productName ?? item.productId} × {item.quantity} — $
              {item.unitPrice}
            </li>
          ))}
        </ul>
      )}

      <p>
        <strong>Total: ${order.total ?? 0}</strong>
      </p>
    </div>
  );
};