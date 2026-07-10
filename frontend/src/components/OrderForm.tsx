
import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  CreateOrderPayload,
  Order,
  OrderItemPayload,
} from '../types/order';

import { fetchProducts } from '../api/orders';
import { fetchCustomers } from '../api/customers';

interface Props {
  order?: Order;
  onSubmit: (values: CreateOrderPayload) => void;
  isSubmitting: boolean;
  onBack: () => void;
}

const OrderLineForm: React.FC<Props> = ({
  order,
  onSubmit,
  isSubmitting,
  onBack,
}) => {
  const [customerId, setCustomerId] = useState(
    order?.customer_id || ''
  );

  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState(
    order?.notes || ''
  );

  const [items, setItems] = useState<
    OrderItemPayload[]
  >(
    order?.items.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: Number(item.unit_price),
    })) || []
  );

  const [errorMessage, setErrorMessage] =
    useState('');

  const {
    data: customers = [],
    isLoading: isLoadingCustomers,
    isError: isCustomersError,
  } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });

  const {
    data: products = [],
    isLoading: isLoadingProducts,
    isError: isProductsError,
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const selectedProduct = products.find(
    (product) => product.id === productId
  );

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      return (
        sum +
        Number(item.quantity) *
          Number(item.unit_price)
      );
    }, 0);
  }, [items]);

  const handleAddProduct = () => {
    setErrorMessage('');

    if (!selectedProduct) {
      setErrorMessage(
        'Debe seleccionar un producto'
      );
      return;
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setErrorMessage(
        'La cantidad debe ser mayor que cero'
      );
      return;
    }

    if (quantity > selectedProduct.stock) {
      setErrorMessage(
        `Stock insuficiente. Disponible: ${selectedProduct.stock}`
      );
      return;
    }

    const existingItem = items.find(
      (item) =>
        item.product_id === selectedProduct.id
    );

    if (existingItem) {
      const newQuantity =
        existingItem.quantity + quantity;

      if (newQuantity > selectedProduct.stock) {
        setErrorMessage(
          `Stock insuficiente. Disponible: ${selectedProduct.stock}`
        );
        return;
      }

      setItems((currentItems) =>
        currentItems.map((item) =>
          item.product_id === selectedProduct.id
            ? {
                ...item,
                quantity: newQuantity,
              }
            : item
        )
      );
    } else {
      setItems((currentItems) => [
        ...currentItems,
        {
          product_id: selectedProduct.id,
          quantity,
          unit_price: Number(
            selectedProduct.unit_price
          ),
        },
      ]);
    }

    setProductId('');
    setQuantity(1);
  };

  const handleRemoveProduct = (
    productIdToRemove: string
  ) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          item.product_id !== productIdToRemove
      )
    );

    setErrorMessage('');
  };

  const handleQuantityChange = (
    productIdToUpdate: string,
    newQuantity: number
  ) => {
    const product = products.find(
      (currentProduct) =>
        currentProduct.id === productIdToUpdate
    );

    if (!product) {
      return;
    }

    if (!Number.isFinite(newQuantity)) {
      return;
    }

    if (newQuantity <= 0) {
      handleRemoveProduct(productIdToUpdate);
      return;
    }

    if (newQuantity > product.stock) {
      setErrorMessage(
        `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`
      );
      return;
    }

    setErrorMessage('');

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product_id === productIdToUpdate
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item
      )
    );
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setErrorMessage('');

    if (!customerId) {
      setErrorMessage(
        'Debe seleccionar un cliente'
      );
      return;
    }

    if (items.length === 0) {
      setErrorMessage(
        'Debe agregar al menos un producto'
      );
      return;
    }

    onSubmit({
      customer_id: customerId,
      status: order?.status || 'DRAFT',
      notes: notes.trim() || undefined,
      items,
    });
  };

  return (
    <div className="container-fluid bg-light min-vh-100">
      <nav className="navbar navbar-dark bg-primary shadow">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">
            <i className="fas fa-cart-plus me-2"></i>

            {order
              ? 'Editar orden'
              : 'Nueva orden'}
          </span>

          <button
            type="button"
            className="btn btn-outline-light"
            onClick={onBack}
            disabled={isSubmitting}
          >
            <i className="fas fa-arrow-left me-2"></i>
            Regresar
          </button>
        </div>
      </nav>

      <div className="container py-4">
        <form onSubmit={handleSubmit}>
          <div className="card shadow-sm">
            <div className="card-header fw-bold">
              <i className="fas fa-file-invoice me-2"></i>
              Datos de la orden
            </div>

            <div className="card-body">
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
                    onClick={() =>
                      setErrorMessage('')
                    }
                  ></button>
                </div>
              )}

              {isCustomersError && (
                <div className="alert alert-danger">
                  Error al cargar los clientes.
                </div>
              )}

              {isProductsError && (
                <div className="alert alert-danger">
                  Error al cargar los productos.
                </div>
              )}

              <div className="row g-3">
                <div className="col-md-12">
                  <label
                    htmlFor="customerId"
                    className="form-label"
                  >
                    Cliente
                  </label>

                  <select
                    id="customerId"
                    className="form-select"
                    value={customerId}
                    onChange={(event) =>
                      setCustomerId(
                        event.target.value
                      )
                    }
                    disabled={
                      isLoadingCustomers ||
                      isSubmitting
                    }
                  >
                    <option value="">
                      {isLoadingCustomers
                        ? 'Cargando clientes...'
                        : 'Seleccione un cliente'}
                    </option>

                    {customers.map((customer) => (
                      <option
                        key={customer.id}
                        value={customer.id}
                      >
                        {customer.name} -{' '}
                        {customer.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <hr />

              <div className="row g-3 align-items-end">
                <div className="col-md-7">
                  <label
                    htmlFor="productId"
                    className="form-label"
                  >
                    Producto
                  </label>

                  <select
                    id="productId"
                    className="form-select"
                    value={productId}
                    onChange={(event) =>
                      setProductId(
                        event.target.value
                      )
                    }
                    disabled={
                      isLoadingProducts ||
                      isSubmitting
                    }
                  >
                    <option value="">
                      {isLoadingProducts
                        ? 'Cargando productos...'
                        : 'Seleccione un producto'}
                    </option>

                    {products.map((product) => (
                      <option
                        key={product.id}
                        value={product.id}
                        disabled={
                          product.stock <= 0
                        }
                      >
                        {product.sku} -{' '}
                        {product.name} | Stock:{' '}
                        {product.stock} | Q{' '}
                        {Number(
                          product.unit_price
                        ).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <label
                    htmlFor="quantity"
                    className="form-label"
                  >
                    Cantidad
                  </label>

                  <input
                    id="quantity"
                    type="number"
                    className="form-control"
                    min={1}
                    max={selectedProduct?.stock}
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(
                        Number(event.target.value)
                      )
                    }
                    disabled={isSubmitting}
                  />
                </div>

                <div className="col-md-3">
                  <button
                    type="button"
                    className="btn btn-success w-100"
                    onClick={handleAddProduct}
                    disabled={
                      isSubmitting ||
                      isLoadingProducts ||
                      !productId
                    }
                  >
                    <i className="fas fa-plus me-2"></i>
                    Agregar
                  </button>
                </div>
              </div>

              <hr />

              <h5 className="mb-3">
                <i className="fas fa-list me-2"></i>
                Productos de la orden
              </h5>

              {items.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <i className="fas fa-box-open fa-3x mb-3"></i>

                  <p className="mb-0">
                    No se han agregado productos.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Producto</th>

                        <th
                          style={{
                            width: '130px',
                          }}
                        >
                          Cantidad
                        </th>

                        <th className="text-end">
                          Precio
                        </th>

                        <th className="text-end">
                          Subtotal
                        </th>

                        <th className="text-center">
                          Acción
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {items.map((item) => {
                        const product =
                          products.find(
                            (currentProduct) =>
                              currentProduct.id ===
                              item.product_id
                          );

                        const subtotal =
                          item.quantity *
                          Number(
                            item.unit_price
                          );

                        return (
                          <tr
                            key={
                              item.product_id
                            }
                          >
                            <td>
                              <strong>
                                {product?.name ||
                                  'Producto'}
                              </strong>

                              <div className="small text-muted">
                                {product?.sku}
                              </div>
                            </td>

                            <td>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                min={1}
                                max={
                                  product?.stock
                                }
                                value={
                                  item.quantity
                                }
                                onChange={(
                                  event
                                ) =>
                                  handleQuantityChange(
                                    item.product_id,
                                    Number(
                                      event
                                        .target
                                        .value
                                    )
                                  )
                                }
                                disabled={
                                  isSubmitting
                                }
                              />
                            </td>

                            <td className="text-end">
                              Q{' '}
                              {Number(
                                item.unit_price
                              ).toFixed(2)}
                            </td>

                            <td className="text-end fw-bold">
                              Q{' '}
                              {subtotal.toFixed(
                                2
                              )}
                            </td>

                            <td className="text-center">
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() =>
                                  handleRemoveProduct(
                                    item.product_id
                                  )
                                }
                                disabled={
                                  isSubmitting
                                }
                                title="Eliminar producto"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>

                    <tfoot>
                      <tr>
                        <th
                          colSpan={3}
                          className="text-end"
                        >
                          Total:
                        </th>

                        <th className="text-end fs-5 text-primary">
                          Q {total.toFixed(2)}
                        </th>

                        <th></th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              <div className="mt-3">
                <label
                  htmlFor="notes"
                  className="form-label"
                >
                  Observaciones
                </label>

                <textarea
                  id="notes"
                  className="form-control"
                  rows={3}
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  placeholder="Escriba observaciones para la orden"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="card-footer d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onBack}
                disabled={isSubmitting}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Cancelar
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  isSubmitting ||
                  items.length === 0 ||
                  !customerId
                }
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-floppy-disk me-2"></i>

                    {order
                      ? 'Actualizar orden'
                      : 'Guardar orden'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderLineForm;
