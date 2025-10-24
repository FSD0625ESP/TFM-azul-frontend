"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AddLotForm() {
  const [shops, setShops] = useState([]); // lista de tiendas
  const [selectedShop, setSelectedShop] = useState("");
  const [lotes, setLotes] = useState("");
  const [message, setMessage] = useState("");

  // 🔹 Cargar tiendas desde el backend
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/shops`
        );
        setShops(res.data);
      } catch (err) {
        console.error("Error cargando tiendas:", err);
      }
    };
    fetchShops();
  }, []);

  // 🔹 Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedShop || !lotes) {
      setMessage("Completa todos los campos");
      return;
    }

    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:4000"
        }/api/lots/create`,
        { shopId: selectedShop, lotes: Number(lotes) }
      );
      setMessage("✅ Lote creado correctamente");
      setLotes("");
      setSelectedShop("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error al crear el lote");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white px-6">
      <h1 className="text-2xl font-bold mb-6">Añadir nuevo lote</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4"
      >
        {/* Seleccionar tienda */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Seleccionar tienda
          </label>
          <select
            value={selectedShop}
            onChange={(e) => setSelectedShop(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
          >
            <option value="">-- Selecciona una tienda --</option>
            {shops.map((shop) => (
              <option key={shop._id} value={shop._id}>
                {shop.name || `Tienda ${shop._id}`}
              </option>
            ))}
          </select>
        </div>

        {/* Introducir número de lotes */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Número de lotes
          </label>
          <input
            type="number"
            value={lotes}
            onChange={(e) => setLotes(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
            placeholder="Ej: 50"
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors py-2 rounded-lg font-semibold"
        >
          Crear lote
        </button>

        {/* Mensaje */}
        {message && (
          <p className="text-center text-sm mt-3 text-gray-300">{message}</p>
        )}
      </form>
    </div>
  );
}
