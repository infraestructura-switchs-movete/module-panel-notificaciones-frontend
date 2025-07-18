export interface Mesa {
  tableId: number;
  tableNumber: number;
  status: number; // 1: Disponible, 2: Ocupada, 3: Reservada
}

export interface Pedido {
  id: string;
  clienteNumero: string;
  productos: Producto[];
  total: number;
  tipo: 'domicilio' | 'recoger';
  direccion?: string;
  timestamp: string;
  estado: 'pendiente' | 'preparando' | 'listo' | 'entregado';
}

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface LlamadaActiva {
  id: string;
  numero: string;
  timestamp: string;
}