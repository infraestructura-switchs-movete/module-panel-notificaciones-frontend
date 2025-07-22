import { Pedido } from "../types/restaurant";


export const getOrders = async (): Promise<Pedido[]> => {
  try {
    const response = await fetch('https://arqmv-module-back-whatsapp-qr-app-backend.onrender.com/api/back-whatsapp-qr-app/order-delivery/get-all-orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los pedidos');
    }

    const data: Pedido[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};


export const deleteOrder = async (orderTransactionDeliveryId: number): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://arqmv-module-back-whatsapp-qr-app-backend.onrender.com/api/back-whatsapp-qr-app/order-delivery/delete/${orderTransactionDeliveryId}`,
      { method: 'DELETE' }
    );
    return response.ok;
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    return false;
  }
};


export const updateOrderStatus = async (
  orderTransactionDeliveryId: number,
  orderStatus: string
): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://arqmv-module-back-whatsapp-qr-app-backend.onrender.com/api/back-whatsapp-qr-app/order-delivery/updateStatus/${orderTransactionDeliveryId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus }),
      }
    );
    return response.ok;
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    return false;
  }
};