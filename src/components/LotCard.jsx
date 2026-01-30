import React from "react";
import { getLotStatus } from "../utils/lotHelpers";

/**
 * LotCard - Componente reutilizable para mostrar un lote
 * @param {Object} lot - Datos del lote
 * @param {Function} onEdit - Callback para editar (opcional)
 * @param {Function} onDelete - Callback para eliminar (opcional)
 * @param {Function} onReserve - Callback para reservar (opcional)
 * @param {Function} onCancel - Callback para cancelar reserva (opcional)
 * @param {Function} onChat - Callback para abrir chat (opcional)
 * @param {Function} onDeliver - Callback para marcar como entregado (opcional)
 * @param {boolean} showActions - Mostrar botones de acción
 * @param {string} userType - Tipo de usuario ('rider' | 'store')
 * @param {number} unreadCount - Número de mensajes no leídos en el chat
 * @param {boolean} deliveryLoading - Estado de carga para entrega
 * @param {Object} distanceState - { allowed: boolean, distance: number }
 */
export const LotCard = ({
  lot,
  onEdit,
  onDelete,
  onReserve,
  onCancel,
  onChat,
  onDeliver,
  showActions = true,
  userType = "rider",
  unreadCount = 0,
  deliveryLoading = false,
  distanceState = null,
}) => {
  const { status, label, color } = getLotStatus(lot);

  return (
    <div
      className={`rounded-lg overflow-hidden shadow-sm ${
        lot.reserved
          ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
          : "bg-white dark:bg-gray-800"
      }`}
    >
      {/* Lot Image */}
      {lot.image && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={lot.image}
            alt={lot.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        {/* Lot Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white m-0">
                {lot.name}
              </h3>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
              >
                <span className="material-symbols-outlined text-xs">
                  {status === "delivered"
                    ? "check_circle"
                    : status === "picked_up"
                      ? "shopping_bag"
                      : status === "reserved"
                        ? "schedule"
                        : "radio_button_unchecked"}
                </span>
                {label}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 m-0">
              {lot.description}
            </p>
          </div>
        </div>

        {/* Lot Info */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <span className="material-symbols-outlined text-sm">
              inventory_2
            </span>
            <span>
              {lot.quantity} {lot.quantity === 1 ? "unidad" : "unidades"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span>
              {new Date(lot.expiryDate).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </div>

        {/* Store Info (for rider view) */}
        {userType === "rider" && lot.shop && (
          <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">
              store
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white m-0">
                {lot.shop.name || lot.shop.shopName || "Tienda"}
              </p>
              {lot.shop.address && (
                <p className="text-xs text-gray-600 dark:text-gray-400 m-0">
                  {lot.shop.address}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Rider Info (for store view) */}
        {userType === "store" && lot.rider && (
          <div className="flex items-center gap-2 mb-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
              person
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white m-0">
                {lot.rider.name || "Rider"}
              </p>
            </div>
          </div>
        )}

        {/* Distance Info */}
        {distanceState && (
          <div
            className={`flex items-center gap-2 mb-3 p-2 rounded ${
              distanceState.allowed
                ? "bg-green-50 dark:bg-green-900/30"
                : "bg-amber-50 dark:bg-amber-900/30"
            }`}
          >
            <span
              className={`material-symbols-outlined ${
                distanceState.allowed
                  ? "text-green-600 dark:text-green-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              location_on
            </span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {distanceState.distance
                ? `${distanceState.distance.toFixed(0)}m de la tienda`
                : distanceState.allowed
                  ? "Cerca de la tienda"
                  : "Lejos de la tienda"}
            </span>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            {/* Chat Button */}
            {onChat && lot.reserved && (
              <button
                onClick={() => onChat(lot._id)}
                className="relative flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">chat</span>
                <span>Chat</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* Reserve Button */}
            {onReserve && !lot.reserved && (
              <button
                onClick={() => onReserve(lot._id)}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">
                  shopping_cart
                </span>
                <span>Reservar</span>
              </button>
            )}

            {/* Cancel Reservation Button */}
            {onCancel && lot.reserved && !lot.pickedUp && (
              <button
                onClick={() => onCancel(lot._id)}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">
                  cancel
                </span>
                <span>Cancelar</span>
              </button>
            )}

            {/* Deliver Button */}
            {onDeliver && lot.pickedUp && !lot.delivered && (
              <button
                onClick={() => onDeliver(lot._id)}
                disabled={deliveryLoading}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {deliveryLoading ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">
                      progress_activity
                    </span>
                    <span>Entregando...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">
                      check_circle
                    </span>
                    <span>Entregar</span>
                  </>
                )}
              </button>
            )}

            {/* Edit Button (Store only) */}
            {onEdit && userType === "store" && !lot.reserved && (
              <button
                onClick={() => onEdit(lot)}
                className="flex items-center justify-center gap-1 rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
              </button>
            )}

            {/* Delete Button (Store only) */}
            {onDelete && userType === "store" && !lot.reserved && (
              <button
                onClick={() => onDelete(lot._id)}
                className="flex items-center justify-center gap-1 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">
                  delete
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
