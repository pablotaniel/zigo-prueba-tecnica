import React from 'react';
import { Order } from '../types/order';

interface Props {
  order?: Order;
  customerId: string;
  onSubmit: (values: any) => void;
  isSubmitting: boolean;
}

export const OrderLineForm: React.FC<Props> = ({ order, customerId, onSubmit, isSubmitting }) => {
  // TODO: @tanstack/react-form + zod + selector de productos con validación de stock

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      customerId,
      items: [
        {
          productId: formData.get('productId') as string,
          quantity: Number(formData.get('quantity')),
        },
      ],
      notes: formData.get('notes') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
      <h3>{order ? 'Agregar productos a la orden' : 'Nueva orden'}</h3>
      <div style={{ marginBottom: 12 }}>
        <label>Producto (ID):</label>
        <br />
        <input name="productId" type="text" style={{ width: '100%' }} placeholder="p0000000-..." />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Cantidad:</label>
        <br />
        <input name="quantity" type="number" min={1} defaultValue={1} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Observaciones:</label>
        <br />
        <textarea name="notes" rows={3} style={{ width: '100%' }} />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar orden'}
      </button>
    </form>
  );
};
