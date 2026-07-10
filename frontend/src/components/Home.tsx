import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Props {
    onSuppliers: () => void;
}

const Home: React.FC<Props> = ({ onSuppliers }) => {
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
              <div className="card-body">
                <h3>📦</h3>
                <h5>Nueva Orden</h5>
                <p className="text-muted">
                  Crear una nueva orden de compra.
                </p>

                <button className="btn btn-primary w-100">
                  Nueva Orden
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h3>📋</h3>
                <h5>Órdenes</h5>
                <p className="text-muted">
                  Consultar órdenes existentes.
                </p>

                <button className="btn btn-success w-100">
                  Ver Órdenes
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h3>👥</h3>
                <h5>Clientes</h5>
                <p className="text-muted">
                  Administración de clientes.
                </p>

                <button className="btn btn-secondary w-100">
                  Clientes
                </button>
              </div>
            </div>
          </div>

        </div>

        <div className="row g-4 mt-2">

          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h3>🚚</h3>
                <h5>Proveedores</h5>
                <p className="text-muted">
                  Administración de proveedores.
                </p>

                <button className="btn btn-warning w-100" onClick={onSuppliers}>
                  Proveedores
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h3>🛒</h3>
                <h5>Productos</h5>
                <p className="text-muted">
                  Catálogo de productos.
                </p>

                <button className="btn btn-info w-100">
                  Productos
                </button>
              </div>
            </div>
          </div>

        </div>

        <div className="card shadow-sm mt-5">
          <div className="card-header fw-bold">
            Últimas órdenes
          </div>

          <div className="card-body">

            <table className="table table-hover align-middle">

              <thead>
                <tr>
                  <th>No.</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>#1001</td>
                  <td>ACME S.A.</td>
                  <td>Q 1,250.00</td>
                  <td>
                    <span className="badge bg-success">
                      Abierta
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>#1002</td>
                  <td>Demo Corp.</td>
                  <td>Q 850.00</td>
                  <td>
                    <span className="badge bg-secondary">
                      Cerrada
                    </span>
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Home;