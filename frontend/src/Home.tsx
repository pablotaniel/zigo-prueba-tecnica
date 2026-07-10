import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="container py-5">

      <h2 className="text-center mb-5">
        Sistema de Órdenes
      </h2>

      <div className="row justify-content-center g-4">

        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <i className="fas fa-plus fa-2x mb-3 text-primary"></i>
              <h5>Nueva Orden</h5>
              <button className="btn btn-primary btn-sm">Abrir</button>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <i className="fas fa-list fa-2x mb-3 text-success"></i>
              <h5>Órdenes</h5>
              <button className="btn btn-success btn-sm">Abrir</button>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <i className="fas fa-box fa-2x mb-3 text-info"></i>
              <h5>Productos</h5>
              <button className="btn btn-info btn-sm text-white">Abrir</button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Home;