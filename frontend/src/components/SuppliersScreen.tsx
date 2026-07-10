import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSupplier,
  deleteSupplier,
  fetchSuppliers,
  updateSupplier,
} from '../api/suppliers';
import {
  CreateSupplierPayload,
  Supplier,
} from '../types/supplier';

interface Props {
  onBack: () => void;
}

const emptyForm: CreateSupplierPayload = {
  name: '',
  email: '',
  phone: '',
};

const SuppliersScreen: React.FC<Props> = ({ onBack }) => {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<CreateSupplierPayload>(emptyForm);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  const {
    data: suppliers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['suppliers'],
    queryFn: fetchSuppliers,
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: CreateSupplierPayload) => {
      if (editingSupplier) {
        return updateSupplier(editingSupplier.id, payload);
      }

      return createSupplier(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['suppliers'],
      });

      setMessage(
        editingSupplier
          ? 'Proveedor actualizado correctamente.'
          : 'Proveedor creado correctamente.'
      );

      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['suppliers'],
      });

      setMessage('Proveedor eliminado correctamente.');
    },
  });

  useEffect(() => {
    if (!message) return;

    const timeout = window.setTimeout(() => {
      setMessage('');
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [message]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingSupplier(null);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setMessage('El nombre es obligatorio.');
      return;
    }

    saveMutation.mutate({
      name: form.name.trim(),
      email: form.email?.trim() || undefined,
      phone: form.phone?.trim() || undefined,
    });
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);

    setForm({
      name: supplier.name,
      email: supplier.email ?? '',
      phone: supplier.phone ?? '',
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleDelete = (supplier: Supplier) => {
    const confirmed = window.confirm(
      `¿Deseas eliminar al proveedor "${supplier.name}"?`
    );

    if (confirmed) {
      deleteMutation.mutate(supplier.id);
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const text = search.toLowerCase();

    return (
      supplier.name.toLowerCase().includes(text) ||
      supplier.email?.toLowerCase().includes(text) ||
      supplier.phone?.toLowerCase().includes(text)
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
            <i className="fas fa-truck me-2"></i>
            Proveedores
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
            {editingSupplier
              ? 'Editar proveedor'
              : 'Nuevo proveedor'}
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
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

                <div className="col-md-4">
                  <label
                    htmlFor="email"
                    className="form-label"
                  >
                    Correo
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                    value={form.email ?? ''}
                    onChange={handleChange}
                    maxLength={100}
                  />
                </div>

                <div className="col-md-4">
                  <label
                    htmlFor="phone"
                    className="form-label"
                  >
                    Teléfono
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    className="form-control"
                    value={form.phone ?? ''}
                    onChange={handleChange}
                    maxLength={30}
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
                    : editingSupplier
                      ? 'Actualizar'
                      : 'Guardar'}
                </button>

                {editingSupplier && (
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
              Lista de proveedores
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
                  Cargando proveedores...
                </p>
              </div>
            )}

            {isError && (
              <div className="alert alert-danger mb-0">
                No fue posible cargar los proveedores.
              </div>
            )}

            {!isLoading && !isError && (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Teléfono</th>
                      <th className="text-end">
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredSuppliers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center text-muted py-4"
                        >
                          No hay proveedores registrados.
                        </td>
                      </tr>
                    ) : (
                      filteredSuppliers.map((supplier) => (
                        <tr key={supplier.id}>
                          <td>{supplier.name}</td>
                          <td>{supplier.email || '-'}</td>
                          <td>{supplier.phone || '-'}</td>

                          <td className="text-end">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm me-2"
                              onClick={() =>
                                handleEdit(supplier)
                              }
                            >
                              <i className="fas fa-pen"></i>
                            </button>

                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() =>
                                handleDelete(supplier)
                              }
                              disabled={
                                deleteMutation.isPending
                              }
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

export default SuppliersScreen;