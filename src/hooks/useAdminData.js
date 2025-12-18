/**
 * Custom hook para manejar operaciones CRUD de admin
 */

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { buildApiUrl } from "../utils/apiConfig";

/**
 * Hook para gestionar datos de admin (users, stores, lots)
 * @param {string} endpoint - Endpoint de la API ('users', 'stores', 'lots')
 * @returns {Object} Datos y funciones CRUD
 */
export const useAdminData = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Obtiene el token de autenticación
   */
  const getAuthToken = () => localStorage.getItem("token");

  /**
   * Obtiene los datos del endpoint
   */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const url = buildApiUrl(`/admin/${endpoint}`);

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(response.data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      toast.error(`Error loading ${endpoint}`);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  /**
   * Crea un nuevo elemento
   */
  const create = async (newItem) => {
    try {
      const token = getAuthToken();
      const url = buildApiUrl(`/admin/${endpoint}`);

      await axios.post(url, newItem, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`${endpoint.slice(0, -1)} created successfully`);
      await fetchData();
      return true;
    } catch (error) {
      console.error(`Error creating ${endpoint}:`, error);
      toast.error(
        error.response?.data?.message ||
          `Error creating ${endpoint.slice(0, -1)}`
      );
      return false;
    }
  };

  /**
   * Elimina un elemento
   */
  const remove = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return false;
    }

    try {
      const token = getAuthToken();
      const url = buildApiUrl(`/admin/${endpoint}/${id}`);

      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`${endpoint.slice(0, -1)} deleted successfully`);
      await fetchData();
      return true;
    } catch (error) {
      console.error(`Error deleting ${endpoint}:`, error);
      toast.error(`Error deleting ${endpoint.slice(0, -1)}`);
      return false;
    }
  };

  /**
   * Carga inicial de datos
   */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    fetchData,
    create,
    remove,
  };
};
