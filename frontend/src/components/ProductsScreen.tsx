import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from '../api/product';

import { fetchSuppliers } from '../api/suppliers';

import {
  CreateProductPayload,
  Product,
} from '../types/product';

interface Props {
  onBack: () => void;
}

const emptyForm: CreateProductPayload = {
  sku: '',
  name: '',
  supplier_id: '',
  unit_price: 0,
  stock: 0,
};

const ProductsScreen: React.FC<Props> = ({ onBack }) => {
  const queryClient = useQueryClient();

  const [form, setForm] =
    useState<CreateProductPayload>(emptyForm);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const {
    data: suppliers = [],
    isLoading: isLoadingSuppliers,
  } = useQuery({
    queryKey: ['suppliers'],
    queryFn: fetchSuppliers,
  });

  const saveMutation = useMutation({
    mutationFn: (payload: CreateProductPayload) => {
      if (editingProduct) {
        return updateProduct(editingProduct.id, payload);
      }

      return createProduct(payload);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products'],
      });

      setMessage(
        editingProduct
          ? 'Producto actualizado correctamente.'
          : 'Producto creado correctamente.'
      );

      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products'],
      });

      setMessage('Producto eliminado correctamente.');
    },
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingProduct(null);
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === 'unit_price' || name === 'stock'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setMessage('');

    if (!form.sku.trim()) {
      setMessage('El SKU es obligatorio.');
      return;
    }

    if (!form.name.trim()) {
      setMessage('El nombre es obligatorio.');
      return;
    }

    if (!form.supplier_id) {
      setMessage('Debe seleccionar un proveedor.');
      return;
    }

    if (form.unit_price < 0) {
      setMessage('El precio no puede ser negativo.');
      return;
    }

    if (form.stock < 0) {
      setMessage('El stock no puede ser negativo.');
      return;
    }

    saveMutation.mutate({
      sku: form.sku.trim(),
      name: form.name.trim(),
      supplier_id: form.supplier_id,
      unit_price: Number(form.unit_price),
      stock: Number(form.stock),
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);

    setForm({
      sku: product.sku,
      name: product.name,
      supplier_id: product.supplier_id,
      unit_price: Number(product.unit_price),
      stock: Number(product.stock),
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleDelete = (product: Product) => {
    const confirmed = window.confirm(
      `¿Deseas eliminar el producto "${product.name}"?`
    );

    if (confirmed) {
      deleteMutation.mutate(product.id);
    }
  };

  const filteredProducts = products.filter((product) => {
    const text = search.toLowerCase();

    return (
      product.sku.toLowerCase().includes(text) ||
      product.name.toLowerCase().includes(text) ||
      product.supplier_name
        ?.toLowerCase()
        .includes(text)
    );
  });

  const mutationError =
    saveMutation.error instanceof Error
      ? saveMutation.error.message
      : deleteMutation.error instanceof Error
        ? deleteMutation.error.message
        : '';

  return (
    <div className="container-fluid bg-light min-vh-100">
      <nav className="navbar navbar-dark bg-primary shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">
            <i className="fas fa-box me-2"></i>
            Productos
          </span>

          <button
            type="button"
            className="btn btn-outline-light btn-sm"
            onClick={onBack}
          >
            <i className="fas fa-arrow-left me-2"></i>
            Regresar
          </button>
        </div>
      </nav>

      <div className="container py-4">
        {message && (
          <div className="alert alert-info">
            {message}
          </div>
        )}

        {mutationError && (
          <div className="alert alert-danger">
            {mutationError}
          </div>
        )}

        <div className="card shadow-sm mb-4">
          <div className="card-header fw-bold">
            {editingProduct
              ? 'Editar producto'
              : 'Nuevo producto'}
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-2">
                  <label
                    htmlFor="sku"
                    className="form-label"
                  >
                    SKU
                  </label>

                  <input
                    id="sku"
                    name="sku"
                    type="text"
                    className="form-control"
                    value={form.sku}
                    onChange={handleChange}
                    maxLength={50}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label
                    htmlFor="name"
                    className="form-label"
                  >
                    Nombre
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    maxLength={100}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label
                    htmlFor="supplier_id"
                    className="form-label"
                  >
                    Proveedor
                  </label>

                  <select
                    id="supplier_id"
                    name="supplier_id"
                    className="form-select"
                    value={form.supplier_id}
                    onChange={handleChange}
                    disabled={isLoadingSuppliers}
                    required
                  >
                    <option value="">
                      Seleccione un proveedor
                    </option>

                    {suppliers.map((supplier) => (
                      <option
                        key={supplier.id}
                        value={supplier.id}
                      >
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <label
                    htmlFor="unit_price"
                    className="form-label"
                  >
                    Precio
                  </label>

                  <input
                    id="unit_price"
                    name="unit_price"
                    type="number"
                    className="form-control"
                    value={form.unit_price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="col-md-2">
                  <label
                    htmlFor="stock"
                    className="form-label"
                  >
                    Stock
                  </label>

                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    className="form-control"
                    value={form.stock}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    required
                  />
                </div>
              </div>

              <div className="mt-3 d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saveMutation.isPending}
                >
                  <i className="fas fa-save me-2"></i>

                  {saveMutation.isPending
                    ? 'Guardando...'
                    : editingProduct
                      ? 'Actualizar'
                      : 'Guardar'}
                </button>

                {editingProduct && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                    disabled={saveMutation.isPending}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span className="fw-bold">
              Lista de productos
            </span>

            <div className="input-group input-group-sm w-auto">
              <span className="input-group-text">
                <i className="fas fa-search"></i>
              </span>

              <input
                type="search"
                className="form-control"
                placeholder="Buscar"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>
          </div>

          <div className="card-body">
            {isLoading && (
              <div className="text-center py-4">
                <div
                  className="spinner-border text-primary"
                  role="status"
                />

                <p className="mt-2 mb-0">
                  Cargando productos...
                </p>
              </div>
            )}

            {isError && (
              <div className="alert alert-danger mb-0">
                No fue posible cargar los productos.
              </div>
            )}

            {!isLoading && !isError && (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Producto</th>
                      <th>Proveedor</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th className="text-end">
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center text-muted py-4"
                        >
                          No hay productos registrados.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product.id}>
                          <td>{product.sku}</td>
                          <td>{product.name}</td>
                          <td>
                            {product.supplier_name || '-'}
                          </td>
                          <td>
                            Q{' '}
                            {Number(
                              product.unit_price
                            ).toFixed(2)}
                          </td>
                          <td>{product.stock}</td>

                          <td className="text-end">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm me-2"
                              onClick={() =>
                                handleEdit(product)
                              }
                              title="Editar"
                            >
                              <i className="fas fa-pen"></i>
                            </button>

                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() =>
                                handleDelete(product)
                              }
                              disabled={
                                deleteMutation.isPending
                              }
                              title="Eliminar"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
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

export default ProductsScreen;