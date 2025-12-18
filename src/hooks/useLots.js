import { useState, useEffect, useCallback } from "react";
import {
  fetchAllLots,
  filterLotsByStore,
  filterLotsByRider,
  deleteLot,
  reserveLot,
  cancelReservation,
  markAsDelivered,
  checkDistanceForPickup,
} from "../utils/lotHelpers";

/**
 * Custom hook para gestionar lotes
 * @param {Object} options - Opciones de configuración
 * @param {string} options.storeId - ID de la tienda (para filtrar)
 * @param {string} options.riderId - ID del rider (para filtrar)
 * @param {boolean} options.onlyReserved - Solo mostrar lotes reservados
 * @param {boolean} options.autoRefresh - Auto-refrescar cada 5 segundos
 * @returns {Object} Estado y funciones para gestionar lotes
 */
export const useLots = ({
  storeId,
  riderId,
  onlyReserved,
  autoRefresh,
} = {}) => {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deliveryStates, setDeliveryStates] = useState({});
  const [distanceStates, setDistanceStates] = useState({});

  // Función para refrescar manualmente
  const refresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Fetch lots
  const loadLots = useCallback(async () => {
    try {
      setLoading(true);
      const allLots = await fetchAllLots();

      let filteredLots = allLots;

      // Filtrar por tienda
      if (storeId) {
        filteredLots = filterLotsByStore(filteredLots, storeId);
      }

      // Filtrar por rider
      if (riderId) {
        filteredLots = filterLotsByRider(filteredLots, riderId);
      }

      // Filtrar solo reservados
      if (onlyReserved) {
        filteredLots = filteredLots.filter((lot) => lot.reserved);
      }

      setLots(filteredLots);
    } catch (error) {
      console.error("Error loading lots:", error);
    } finally {
      setLoading(false);
    }
  }, [storeId, riderId, onlyReserved, refreshTrigger]);

  // Cargar lotes al montar y cuando cambian las dependencias
  useEffect(() => {
    loadLots();
  }, [loadLots]);

  // Auto-refresh si está activado
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadLots();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, loadLots]);

  // Refrescar cuando la página vuelve a tener foco
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refresh();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [refresh]);

  // Verificar distancia para lotes que están pickedUp pero no delivered
  useEffect(() => {
    const checkDistances = async () => {
      for (const lot of lots) {
        if (lot.pickedUp && !lot.delivered) {
          try {
            const result = await checkDistanceForPickup(lot._id, false);
            setDistanceStates((prev) => ({ ...prev, [lot._id]: result }));
          } catch (error) {
            console.error(`Error checking distance for lot ${lot._id}:`, error);
          }
        } else {
          // Limpiar estado si no aplica
          setDistanceStates((prev) => {
            const copy = { ...prev };
            delete copy[lot._id];
            return copy;
          });
        }
      }
    };

    if (riderId && onlyReserved) {
      checkDistances();
    }
  }, [lots, riderId, onlyReserved]);

  // Eliminar un lote
  const handleDelete = async (lotId) => {
    if (!confirm("Are you sure you want to delete this lot?")) return;

    try {
      await deleteLot(lotId);
      setLots((prev) => prev.filter((lot) => lot._id !== lotId));
    } catch (error) {
      console.error("Error deleting lot:", error);
    }
  };

  // Reservar un lote
  const handleReserve = async (lotId) => {
    try {
      const updatedLot = await reserveLot(lotId);
      if (updatedLot.reserved) {
        // Si se filtran solo disponibles, remover de la lista
        if (!onlyReserved) {
          setLots((prev) => prev.filter((lot) => lot._id !== lotId));
        } else {
          // Actualizar el lote en la lista
          setLots((prev) =>
            prev.map((lot) => (lot._id === lotId ? updatedLot : lot))
          );
        }
      }
    } catch (error) {
      console.error("Error reserving lot:", error);
    }
  };

  // Cancelar reserva
  const handleCancel = async (lotId) => {
    if (!confirm("Are you sure you want to cancel this reservation?")) return;

    try {
      const updatedLot = await cancelReservation(lotId);
      if (!updatedLot.reserved) {
        // Si se filtran solo reservados, remover de la lista
        if (onlyReserved) {
          setLots((prev) => prev.filter((lot) => lot._id !== lotId));
        } else {
          // Actualizar el lote en la lista
          setLots((prev) =>
            prev.map((lot) => (lot._id === lotId ? updatedLot : lot))
          );
        }
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
    }
  };

  // Marcar como entregado
  const handleDeliver = async (lotId) => {
    try {
      setDeliveryStates((prev) => ({ ...prev, [lotId]: "loading" }));

      const updatedLot = await markAsDelivered(lotId);

      setDeliveryStates((prev) => ({ ...prev, [lotId]: "success" }));

      // Actualizar el lote en la lista
      setLots((prev) =>
        prev.map((lot) => (lot._id === lotId ? updatedLot : lot))
      );

      // Limpiar estado después de 2 segundos
      setTimeout(() => {
        setDeliveryStates((prev) => {
          const copy = { ...prev };
          delete copy[lotId];
          return copy;
        });
      }, 2000);
    } catch (error) {
      console.error("Error delivering lot:", error);
      setDeliveryStates((prev) => ({ ...prev, [lotId]: "error" }));

      setTimeout(() => {
        setDeliveryStates((prev) => {
          const copy = { ...prev };
          delete copy[lotId];
          return copy;
        });
      }, 2000);
    }
  };

  return {
    lots,
    loading,
    refresh,
    deliveryStates,
    distanceStates,
    handleDelete,
    handleReserve,
    handleCancel,
    handleDeliver,
  };
};
