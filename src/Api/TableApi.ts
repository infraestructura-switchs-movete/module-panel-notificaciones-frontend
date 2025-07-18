import { Table } from '../types/TableType';

const API_URL = 'http://localhost:8080/api/back-whatsapp-qr-app/restauranttable';

export const obtenerTablas = async (): Promise<Table[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener las mesas');
    const data: Table[] = await response.json();
    return data;  // Devuelve un array de objetos de tipo Table
  } catch (error) {
    console.error('Error al obtener las mesas', error);
    return [];  // Retorna un array vacío en caso de error
  }
};
