import React, { useState } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createCustomer,
  deleteCustomer,
  fetchCustomers,
  updateCustomer,
} from '../api/customers';

import {
  Customer,
  CustomerInput,
} from '../types/customer';

interface Props {
  onBack: () => void;
}

const emptyForm: CustomerInput = {
  name: '',
  email: '',
};

const CustomersScreen: React.FC<Props> = ({ onBack }) => {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<CustomerInput>(emptyForm);
  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);

  const [errorMessage, setErrorMessage] = useState('');

  const {
    data: customers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });

  const createMutation = useMutation({
    mutationFn: createCustomer,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customers'],
      });

      resetForm();
    },

    onError: (error: any) => {
      setErrorMessage(
        error.response?.data?.error ||
          error.message ||
          'Error al crear el cliente'
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CustomerInput;
    }) => updateCustomer(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customers'],
      });

      resetForm();
    },

    onError: (error: any) => {
      setErrorMessage(
        error.response?.data?.error ||
          error.message ||
          'Error al actualizar el cliente'
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customers'],
      });
    },

    onError: (error: any) => {
      setErrorMessage(
        error.response?.data?.error ||
          error.message ||
          'Error al eliminar el cliente'
      );
    },
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingCustomer(null);
    setErrorMessage('');
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

    setErrorMessage('');

    if (!form.name.trim()) {
      setErrorMessage('El nombre es obligatorio');
      return;
    }

    if (!form.email.trim()) {
      setErrorMessage('El correo es obligatorio');
      return;
    }

    const payload: CustomerInput = {
      name: form.name.trim(),
      email: form.email.trim(),
    };

    if (editingCustomer) {
      updateMutation.mutate({
        id: editingCustomer.id,
        payload,
      });

      return;
    }

    createMutation.mutate(payload);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);

    setForm({
      name: customer.name,
      email: customer.email,
    });

    setErrorMessage('');
  };

  const handleDelete = (customer: Customer) => {
    const confirmed = window.confirm(
      `¿Deseas eliminar al cliente "${customer.name}"?`
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(customer.id);
  };

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending;

  return (
    <div className="container-fluid bg-light min-vh-100">

      <nav className="navbar navbar-dark bg-primary shadow">
        <div className="container-fluid">

          <span className="navbar-brand fw-bold">
            <i className="fas fa-users me-2"></i>
            Administración de Clientes
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
            {errorMessage}

            <button
              type="button"
              className="btn-close"
              onClick={() => setErrorMessage('')}
            ></button>
          </div>
        )}

        <div className="row g-4">

          <div className="col-lg-4">

            <div className="card shadow-sm">

              <div className="card-header fw-bold">
                <i
                  className={
                    editingCustomer
                      ? 'fas fa-user-pen me-2'
                      : 'fas fa-user-plus me-2'
                  }
                ></i>

                {editingCustomer
                  ? 'Editar cliente'
                  : 'Nuevo cliente'}
              </div>

              <div className="card-body">

                <form onSubmit={handleSubmit}>

                  <div className="mb-3">
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
                      placeholder="Nombre del cliente"
                      disabled={isSaving}
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="email"
                      className="form-label"
                    >
                      Correo electrónico
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-control"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="cliente@correo.com"
                      disabled={isSaving}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i
                          className={
                            editingCustomer
                              ? 'fas fa-floppy-disk me-2'
                              : 'fas fa-plus me-2'
                          }
                        ></i>

                        {editingCustomer
                          ? 'Actualizar cliente'
                          : 'Guardar cliente'}
                      </>
                    )}
                  </button>

                  {editingCustomer && (
                    <button
                      type="button"
                      className="btn btn-secondary w-100 mt-2"
                      onClick={resetForm}
                      disabled={isSaving}
                    >
                      <i className="fas fa-xmark me-2"></i>
                      Cancelar edición
                    </button>
                  )}

                </form>

              </div>

            </div>

          </div>

          <div className="col-lg-8">

            <div className="card shadow-sm">

              <div className="card-header fw-bold">
                <i className="fas fa-list me-2"></i>
                Lista de clientes
              </div>

              <div className="card-body">

                {isLoading && (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>

                    <p className="text-muted mt-3 mb-0">
                      Cargando clientes...
                    </p>
                  </div>
                )}

                {isError && (
                  <div className="alert alert-danger">
                    Error al cargar los clientes.
                  </div>
                )}

                {!isLoading &&
                  !isError &&
                  customers.length === 0 && (
                    <div className="text-center text-muted py-5">
                      <i className="fas fa-users fa-3x mb-3"></i>

                      <p className="mb-0">
                        No hay clientes registrados.
                      </p>
                    </div>
                  )}

                {!isLoading &&
                  !isError &&
                  customers.length > 0 && (
                    <div className="table-responsive">

                      <table className="table table-hover align-middle">

                        <thead className="table-light">
                          <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th className="text-end">
                              Acciones
                            </th>
                          </tr>
                        </thead>

                        <tbody>

                          {customers.map((customer) => (
                            <tr key={customer.id}>

                              <td>
                                <i className="fas fa-user text-primary me-2"></i>
                                {customer.name}
                              </td>

                              <td>
                                <i className="fas fa-envelope text-muted me-2"></i>
                                {customer.email}
                              </td>

                              <td className="text-end">

                                <button
                                  type="button"
                                  className="btn btn-sm btn-warning me-2"
                                  onClick={() =>
                                    handleEdit(customer)
                                  }
                                >
                                  <i className="fas fa-pen"></i>
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger"
                                  onClick={() =>
                                    handleDelete(customer)
                                  }
                                  disabled={
                                    deleteMutation.isPending
                                  }
                                >
                                  <i className="fas fa-trash"></i>
                                </button>

                              </td>

                            </tr>
                          ))}

                        </tbody>

                      </table>

                    </div>
                  )}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CustomersScreen;
