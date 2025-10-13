import "./App.css";

function App() {
  return (
    <>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl">Mi Tarjeta</h2>
          <p>Contenido de la tarjeta usando Daisy UI</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Acción</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
