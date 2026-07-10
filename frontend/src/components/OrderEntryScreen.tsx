import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Props {
  onSuppliers: () => void;
  onProducts: () => void;
  onCustomers: () => void;
  onOrders: () => void;
    onOrdersList: () => void;

}

const Home: React.FC<Props> = ({ onSuppliers, onProducts, onCustomers, onOrders, onOrdersList }) => {
  return (
    <div className="container-fluid bg-light min-vh-100">

      <nav className="navbar navbar-dark bg-primary shadow">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">
            Sistema de Órdenes de Compra
          </span>
        </div>
      </nav>

      <div className="container py-4">

        <div className="mb-4">
          <h2>Bienvenido</h2>
          <p className="text-muted">
            Seleccione una opción para comenzar.
          </p>
        </div>

        <div className="row g-4">

          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">

                <i className="fas fa-file-circle-plus fa-3x text-primary mb-3"></i>

                <h5>Nueva Orden</h5>

                <p className="text-muted">
                  Crear una nueva orden de compra.
                </p>

                <button className="btn btn-primary w-100" onClick={onOrders}>
                  Nueva Orden
                </button>

              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">

                <i className="fas fa-clipboard-list fa-3x text-success mb-3"></i>

                <h5>Órdenes</h5>

                <p className="text-muted">
                  Consultar órdenes existentes.
                </p>

                <button className="btn btn-success w-100" onClick={onOrdersList}>
                  Ver Órdenes
                </button>

              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">

                <i className="fas fa-users fa-3x text-secondary mb-3"></i>

                <h5>Clientes</h5>

                <p className="text-muted">
                  Administración de clientes.
                </p>

                <button className="btn btn-secondary w-100" onClick={onCustomers}>
                  Clientes
                </button>

              </div>
            </div>
          </div>

        </div>

        <div className="row g-4 mt-2">

          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">

                <i className="fas fa-truck fa-3x text-warning mb-3"></i>

                <h5>Proveedores</h5>

                <p className="text-muted">
                  Administración de proveedores.
                </p>

                <button
                  className="btn btn-warning w-100"
                  onClick={onSuppliers}
                >
                  Proveedores
                </button>

              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">

                <i className="fas fa-box-open fa-3x text-info mb-3"></i>

                <h5>Productos</h5>

                <p className="text-muted">
                  Catálogo de productos.
                </p>

                <button
                  className="btn btn-info w-100"
                  onClick={onProducts}
                >
                  Productos
                </button>

              </div>
            </div>
          </div>

        </div>

       

      </div>

    </div>
  );
};

export default Home;