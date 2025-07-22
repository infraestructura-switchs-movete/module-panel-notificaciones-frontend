import { Table } from '../types/TableType';

const API_URL = 'https://arqmv-module-back-whatsapp-qr-app-backend.onrender.com/api/back-whatsapp-qr-app/restauranttable';

export const obtenerTablas = async (): Promise<Table[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener las mesas');
    const data: Table[] = await response.json();
    return data;  
  } catch (error) {
    console.error('Error al obtener las mesas', error);
    return [];  
  }
};
