export interface Table {
  tableId: number;
  tableNumber: number;
  status: number;
}


export interface TableOrderWithId {
    tableId: number;
    mesa: number;           // Número de mesa
    statusMesa: number;     // Estado de la mesa (por ejemplo: 1 = ocupada, 0 = libre)
    orders: OrderItem[];    // Lista de órdenes para esa mesa
    totalGeneral: number;   // Total general de todas las órdenes
}

export interface TableOrder {
    mesa: number;           // Número de mesa
    statusMesa: number;     // Estado de la mesa (por ejemplo: 1 = ocupada, 0 = libre)
    orders: OrderItem[];    // Lista de órdenes para esa mesa
    totalGeneral: number;   // Total general de todas las órdenes
}

export interface OrderItem {
  orderId:number;
  productId: string;
  name: string;
  qty: number;
  unitePrice: number;
  totalPrice: number;
}

export interface OrderResponse {
  tableId:number;
  mesa: number; // número de mesa
  statusMesa: number;
  orders: OrderItem[];
  totalGeneral: number;
}

export interface GroupedOrder {
  orderId: number;
  items: OrderItem[];
}

export interface OrderHistoryResponse{
  mesa:number;
  statusMesa:number;
  orders: OrderItem[] 
}