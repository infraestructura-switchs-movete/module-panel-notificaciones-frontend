export interface Mesa {
  tableId: number;
  tableNumber: number;
  status: number; // 1: Disponible, 2: Ocupada, 3: Reservada
}

export interface Producto {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Pedido {
  phone: string;
  orderTransactionDeliveryId: number;
  products: Producto[];
  total: number;
  paymentId: number;
  paymentName: string;
  typeIdentificationId: number;
  typeIdentificationName: string;
  method: 'domicilio' | 'recoger';
  nameClient: string;
  address: string;
  phoneClient: string;
  mail: string;
  numerIdentification: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  statusOrder: 'PENDIENTE' | 'PREPARANDO' | 'LISTO' | 'ENTREGADO';
}

export interface LlamadaActiva {
  id: string;
  numero: string;
  timestamp: string;
}