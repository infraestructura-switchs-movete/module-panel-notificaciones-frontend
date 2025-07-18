export function obtenerTextoEstado(status: number): { texto: string; clase: string; bgColor: string } {
  switch(status) {
    case 1: 
      return { 
        texto: "Disponible", 
        clase: "disponible",
        bgColor: "bg-green-100 text-green-800 border-green-200"
      };
    case 2: 
      return { 
        texto: "Ocupada", 
        clase: "ocupada",
        bgColor: "bg-red-100 text-red-800 border-red-200"
      };
    case 3: 
      return { 
        texto: "Solicitando atención", 
        clase: "solicitandoAtencion",
        bgColor: "bg-yellow-100 text-yellow-800 border-yellow-200"
      };
    case 4: 
      return { 
        texto: "Reservada", 
        clase: "reservada",
        bgColor: "bg-yellow-100 text-yellow-800 border-yellow-200"
      };
    default:
      return { 
        texto: "Desconocido", 
        clase: "desconocido",
        bgColor: "bg-gray-100 text-gray-800 border-gray-200"
      };
  }
}

export function formatearTiempo(timestamp: string): string {
  const fecha = new Date(timestamp);
  return fecha.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

export function formatearPrecio(precio: number): string {
  return `$${precio.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// Función para actualizar estados de mesas desde la API
export async function actualizarEstadoMesas(setMesas: React.Dispatch<React.SetStateAction<any[]>>) {
  try {
    const response = await fetch("http://localhost:8080/api/back-whatsapp-qr-app/restauranttable");
    if (!response.ok) throw new Error("No se pudo obtener el estado de las mesas");
    
    const mesasAPI = await response.json();

    setMesas(prevMesas => prevMesas.map(mesa => {
      const mesaAPI = mesasAPI.find((m: any) => m.tableNumber === mesa.tableNumber);
      if (mesaAPI) {
        return {
          ...mesa,
          status: mesaAPI.status
        };
      }
      return mesa;
    }));

    console.log('Estados de mesas actualizados desde API');
  } catch (error) {
    console.error("Error al actualizar el estado de las mesas:", error);
  }
}