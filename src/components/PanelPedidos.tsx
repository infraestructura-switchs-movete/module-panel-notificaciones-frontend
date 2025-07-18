import React from 'react';
import { Clock, MapPin, Truck, Store, Package } from 'lucide-react';
import { Pedido } from '../types/restaurant';
import { formatearTiempo, formatearPrecio } from '../utils/mesaUtils';

interface PanelPedidosProps {
  pedidos: Pedido[];
}

export default function PanelPedidos({ pedidos }: PanelPedidosProps) {
  const pedidosActivos = pedidos.filter(p => p.estado !== 'entregado');

  if (pedidosActivos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay pedidos activos</h3>
          <p className="text-gray-500">Los pedidos aparecerán aquí cuando se reciban</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pedidosActivos.map((pedido) => (
        <div key={pedido.id} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {/* Header del pedido - Número de Cliente */}
          <div className="bg-red-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold text-xl">{pedido.clienteNumero}</h3>
            <div className="text-xl font-bold">{formatearPrecio(pedido.total)}</div>
          </div>

          {/* Botón Cerrar Cuenta */}
          <div className="px-4 py-2 bg-red-50">
            <button className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors duration-200 font-medium">
              Cerrar Cuenta
            </button>
          </div>

          {/* Contenido del pedido */}
          <div className="p-4">
            {/* Timestamp con ícono */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Clock size={16} />
              <span className="font-medium">{formatearTiempo(pedido.timestamp)}</span>
            </div>

            {/* Lista de productos */}
            <div className="space-y-2 mb-4">
              {pedido.productos.map((producto, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{producto.cantidad} x {producto.nombre}</span>
                  <span className="font-bold">{formatearPrecio(producto.precio * producto.cantidad)}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t pt-3 mb-4">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total: {formatearPrecio(pedido.total)}</span>
              </div>
            </div>

            {/* Información de entrega */}
            <div className="space-y-4">
              {/* Opciones de entrega - Como en la imagen */}
              <div className="flex gap-4">
                <div className={`flex-1 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  pedido.tipo === 'domicilio' 
                    ? 'border-blue-500 bg-blue-50 text-blue-800' 
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}>
                  <div className="flex items-center gap-2">
                    <Truck size={20} />
                    <span className="font-medium">Recibir a domicilio</span>
                  </div>
                </div>
                
                <div className={`flex-1 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  pedido.tipo === 'recoger' 
                    ? 'border-green-500 bg-green-50 text-green-800' 
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}>
                  <div className="flex items-center gap-2">
                    <Store size={20} />
                    <span className="font-medium">Pasa a recogerlo</span>
                  </div>
                </div>
              </div>

              {/* Campo de dirección */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                  <div className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-700 min-h-[40px] flex items-center">
                    {pedido.direccion || 'No especificada'}
                  </div>
                </div>
              </div>

              {/* Estado del pedido */}
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm font-medium text-gray-600">Estado del pedido:</span>
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                  pedido.estado === 'entregado' ? 'bg-green-100 text-green-800' : 
                  pedido.estado === 'listo' ? 'bg-blue-100 text-blue-800' :
                  pedido.estado === 'preparando' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}