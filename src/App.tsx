import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { Plus } from "lucide-react";
import Header from "./components/Header";
import Mesa from "./components/Mesa";
import PanelPedidos from "./components/PanelPedidos";
import HistorialGeneral from "./components/HistorialGeneral";
import { Mesa as MesaType } from "./types/restaurant";
import axios from "axios";
import {
  OrderHistoryResponse,
  OrderResponse,
  TableOrderWithId,
} from "./types/TableType";

const socket = io(
  "https://arqmv-module-back-whatsapp-qr-app-backend.onrender.com/api/back-whatsapp-qr-app"
);

function App() {
  const [vistaActual, setVistaActual] = useState<
    "mesas" | "pedidos" | "historial"
  >("mesas");
  const [mesas, setMesas] = useState<MesaType[]>([]);
  const [mesasConOrdenes, setMesasConOrdenes] = useState<TableOrderWithId[]>(
    []
  );
  const [llamadasActivas] = useState(0);

  // Fusionar mesas con órdenes
  const obtenerOrdenesYFusionarConMesas = useCallback(async () => {
    try {
      const response = await axios.get<OrderResponse[]>(
        "https://arqmv-module-back-whatsapp-qr-app-backend.onrender.com/api/back-whatsapp-qr-app/order"
      );
      const ordenes = response.data;

      const resultado = mesas.map((mesa) => {
        const orden = ordenes.find((o) => o.mesa === mesa.tableNumber);
        return {
          tableId: mesa.tableId,
          mesa: mesa.tableNumber,
          statusMesa: mesa.status,
          orders: orden ? orden.orders : [],
          totalGeneral: orden ? orden.totalGeneral : 0,
        };
      });

      setMesasConOrdenes(resultado);
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
    }
  }, [mesas]);

  // Obtener mesas actuales desde la base de datos
  useEffect(() => {
    const obtenerEstadoMesas = async () => {
      try {
        const response = await axios.get(
          "https://arqmv-module-back-whatsapp-qr-app-backend.onrender.com/api/back-whatsapp-qr-app/restauranttable"
        );
        setMesas(response.data);
        await obtenerOrdenesYFusionarConMesas();
      } catch (error) {
        console.error("Error al obtener las mesas:", error);
      }
    };

    obtenerEstadoMesas();
  }, []);

  // Escuchar el evento de actualización de mesa desde el servidor
  useEffect(() => {
    socket.on("mesa_actualizada", (data) => {
      setMesas((prevMesas) =>
        prevMesas.map((mesa) =>
          mesa.tableId === data.mesa ? { ...mesa, status: data.estado } : mesa
        )
      );
      obtenerOrdenesYFusionarConMesas();
    });

    return () => {
      socket.off("mesa_actualizada");
    };
  }, [obtenerOrdenesYFusionarConMesas]);

  // Sincronizar mesasConOrdenes cuando cambian las mesas
  useEffect(() => {
    if (mesas.length > 0) {
      obtenerOrdenesYFusionarConMesas();
    }
  }, [mesas]);

  // Funciones para agregar, eliminar y cambiar estado de mesas
  const agregarMesa = async () => {
    try {
      const numeroMesa = Math.max(...mesas.map((m) => m.tableNumber), 0) + 1;
      const response = await axios.post(
        "https://arqmv-module-back-whatsapp-qr-app-backend.onrender.com/api/back-whatsapp-qr-app/restauranttable",
        {
          tableNumber: numeroMesa,
        }
      );

      const nuevaMesa = {
        tableId: response.data.tableId,
        tableNumber: numeroMesa,
        status: 1,
      };
      setMesas([...mesas, nuevaMesa]);
    } catch (error) {
      console.error("Error al agregar la mesa:", error);
    }
  };

  const eliminarMesa = async (tableId: number) => {
    try {
      await axios.delete(
        `https://arqmv-module-back-whatsapp-qr-app-backend.onrender.com/api/back-whatsapp-qr-app/restauranttable/${tableId}`
      );
      setMesas(mesas.filter((mesa) => mesa.tableId !== tableId));
    } catch (error) {
      console.error("Error al eliminar la mesa:", error);
    }
  };

  const cambiarEstadoMesa = async (tableNumber: number, status: number) => {
    const url =
      status === 1
        ? "https://arqmv-module-back-whatsapp-qr-app-backend.onrender.com/api/back-whatsapp-qr-app/restauranttable/change/status-free"
        : "https://arqmv-module-back-whatsapp-qr-app-backend.onrender.com/api/back-whatsapp-qr-app/restauranttable/change/status-ocuped";

    try {
      await axios.post(`${url}?tableNumber=${tableNumber}`);
      setMesas(
        mesas.map((mesa) =>
          mesa.tableId === tableNumber ? { ...mesa, status } : mesa
        )
      );
    } catch (error) {
      console.error("Error al cambiar el estado de la mesa:", error);
      throw new Error("Error al cambiar el estado de la mesa.");
    }
  };

  const waiterCall = async (tableId: number, tableNumber: number) => {
    const payload = { tableId, status: 1 };
    try {
      await axios.post(
        "https://arqmv-module-back-whatsapp-qr-app-backend.onrender.com/api/back-whatsapp-qr-app/waitercall/create-waitercall",
        payload
      );
      await axios.post(
        `https://arqmv-module-back-whatsapp-qr-app-backend.onrender.com/api/back-whatsapp-qr-app/restauranttable/change/status-ocuped?tableNumber=${tableNumber}`
      );
    } catch (error) {
      console.error("Error al llamar al mesero:", error);
      throw new Error("Error al llamar al mesero.");
    }
  };

  const sendOrder = async (orderId: number) => {
    try {
      await axios.post(
        `https://arqmv-module-back-whatsapp-qr-app-backend.onrender.com/api/back-whatsapp-qr-app/order/status/send/${orderId}`
      );
    } catch (error) {
      console.error("Error al enviar la orden:", error);
      throw new Error("Error al enviar la orden.");
    }
  };

  const getOrdersHistory = async (tableNumber: number) => {
    try {
      const data = await axios.get<OrderHistoryResponse[]>(
        `https://arqmv-module-back-whatsapp-qr-app-backend.onrender.com/api/back-whatsapp-qr-app/order/enviada/${tableNumber}`
      );
      return data.data;
    } catch (error) {
      console.error("Error al obtener el historial: ", error);
      throw new Error("Error al obtener el historial.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        vistaActual={vistaActual}
        onCambiarVista={setVistaActual}
        llamadasActivas={llamadasActivas}
      />

      <div className="max-w-7xl mx-auto p-6">
        {vistaActual === "mesas" && (
          <div>
            {/* Botón para agregar mesa */}
            <div className="mb-6">
              <button
                onClick={agregarMesa}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
              >
                <Plus size={20} />
                Agregar Nueva Mesa
              </button>
            </div>

            {/* Grid de mesas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mesasConOrdenes.map((mesa) => (
                <Mesa
                  key={mesa.tableId}
                  mesa={mesa}
                  onCambiarEstado={cambiarEstadoMesa}
                  onCerrarCuenta={() => {}}
                  onVerHistorial={() => {}}
                  onEliminarMesa={eliminarMesa}
                  onWaiterCall={waiterCall}
                  onSendOrder={sendOrder}
                  onGetOrdersHistory={getOrdersHistory}
                />
              ))}
            </div>
          </div>
        )}

        {vistaActual === "pedidos" && <PanelPedidos pedidos={[]} />}

        {vistaActual === "historial" && <HistorialGeneral mesas={mesas} />}
      </div>
    </div>
  );
}

export default App;
