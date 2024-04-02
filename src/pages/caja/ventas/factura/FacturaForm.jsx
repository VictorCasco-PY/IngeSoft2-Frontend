import React, { useState } from "react";
import { Btn } from "../../../../components/bottons/Button";
import classes from "./FacturaForm.module.css";
import api from "../../../../utils/api";
import { Toaster, toast } from "react-hot-toast";
import { RiDeleteBinLine } from "react-icons/ri";
import FlechaAtras from "../../../../components/flechaAtras/FlechaAtras";

const FacturaForm = () => {
  // State
  const [detalles, setDetalles] = useState([]);
  const [detallesParaMostrar, setDetallesParaMostrar] = useState([]);
  const [detallesParaEnviar, setDetallesParaEnviar] = useState([]);
  const [cantidadMaxima, setCantidadMaxima] = useState(0);
  const [clienteInfo, setClienteInfo] = useState({
    nombre: "",
    clienteId: "",
    direccion: "",
    ruc: "",
  });
  const [producto, setProducto] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    cantidad: "",
    precio: "",
    iva: "",
  });

  // Constants
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().substr(0, 10);

  // Functions
  const getSuscripcionesVencidas = async (idCliente) => {
    try {
      const response = await api.get(
        `suscripciones/cliente/${idCliente}/pendientes/page/1`
      );
      const suscripciones = response.data.items;
      const detallesSuscripciones = suscripciones.map((suscripcion) => ({
        suscripcionId: suscripcion.id,
        descripcion: suscripcion.descripcion,
        precioUnitario:
          suscripcion.modalidad === "SEMANAL"
            ? suscripcion.costoSemanal
            : suscripcion.costoMensual,
        cantidad: 1,
        subtotal:
          suscripcion.modalidad === "SEMANAL"
            ? suscripcion.costoSemanal
            : suscripcion.costoMensual,
        iva: 10,
        ivaTotal:
          suscripcion.modalidad === "SEMANAL"
            ? suscripcion.costoSemanal * 0.1
            : suscripcion.costoMensual * 0.1,
      }));
      setDetalles([...detalles, ...detallesSuscripciones]);
    } catch (error) {
      console.error("Error al obtener las suscripciones:", error);
      toast.error("Error al obtener las suscripciones");
    }
  };

  const getClienteById = async (ruc) => {
    try {
      const data = await api.get(`/clientes/searchByRuc/${ruc}/page/1`);
      const cliente = data.data;
      if (cliente) {
        setClienteInfo({
          ruc: ruc,
          nombre: cliente.items[0].nombre,
          clienteId: cliente.items[0].id,
          direccion: cliente.items[0].direccion,
        });
        getSuscripcionesVencidas(cliente.items[0].id);
      }
    } catch (error) {
      toast.error("Cliente no encontrado");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calcular subtotal, iva5, iva10 y total
      let subTotal = 0;
      let iva5 = 0;
      let iva10 = 0;
      detalles.forEach((detalle) => {
        subTotal += detalle.subtotal;
        if (detalle.iva === 5) {
          iva5 += detalle.ivaTotal;
        } else if (detalle.iva === 10) {
          iva10 += detalle.ivaTotal;
        }
      });
      const total = subTotal;
      console.log(total, iva5, iva10);
      // Enviar la factura al backend
      console.log({
        factura: {
          clienteId: clienteInfo.clienteId,
          timbrado: 1547884,
          fecha: formattedDate,
          nombreCliente: clienteInfo.nombre,
          rucCliente: clienteInfo.ruc,
          direccion: clienteInfo.direccion,
          sesionId: 1,
          subTotal: subTotal,
          iva5: iva5,
          iva10: iva10,
          total: total,
          saldo: total,
        },
        detalles: detalles,
      });
      /* const response = await api.post("/facturas", {
        factura: {
          clienteId: clienteInfo.clienteId,
          timbrado: 1547884,
          fecha: formattedDate,
          nombreCliente: clienteInfo.nombre,
          rucCliente: clienteInfo.ruc,
          direccion: clienteInfo.direccion,
          sesionId: 1,
          subTotal: subTotal,
          iva5: iva5,
          iva10: iva10,
          total: total,
          saldo: total,
        },
        detalles: detalles,
      });*/
      toast.success("Factura generada correctamente");
    } catch (error) {
      toast.error("No se pudo cargar la factura");
    }
  };

  // Función para eliminar un detalle
  const handleDeleteDetalle = (index) => {
    const updatedDetallesMostrar = [...detallesParaMostrar];
    const updatedDetallesEnviar = [...detallesParaEnviar];

    updatedDetallesMostrar.splice(index, 1);
    updatedDetallesEnviar.splice(index, 1);

    setDetallesParaMostrar(updatedDetallesMostrar);
    setDetallesParaEnviar(updatedDetallesEnviar);
  };
  const handleAgregarItem = () => {
    const nuevoDetalleMostrar = {
      cantidad: producto.cantidad,
      descripcion: producto.descripcion,
      precioUnitario: producto.precio,
      iva: producto.iva,
      subtotal: producto.precio * producto.cantidad,
    };

    const nuevoDetalleEnviar = {
      productoId: producto.id,
      precioUnitario: producto.precio,
      cantidad: producto.cantidad,
      subtotal: producto.precio * producto.cantidad,
      iva: producto.iva,
      ivaTotal: producto.precio * producto.cantidad * producto.iva,
    };

    setDetallesParaMostrar([...detallesParaMostrar, nuevoDetalleMostrar]);
    setDetallesParaEnviar([...detallesParaEnviar, nuevoDetalleEnviar]);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Tab") {
      const codigo = e.target.value;
      try {
        const response = await api.get(`/productos/codigo/${codigo}`);
        const productoData = response.data;
        if (productoData) {
          setProducto({
            id: productoData.id,
            nombre: productoData.nombre,
            descripcion: productoData.descripcion,
            cantidad: Math.min(producto.cantidad, productoData.cantidad),
            precio: productoData.precio,
            iva: productoData.iva,
          });
          setCantidadMaxima(productoData.cantidad);
        } else {
          toast.error("Producto no encontrado");
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
        toast.error("Error al obtener el producto");
      }
    }
  };

  return (
    <div className={classes.form_container}>
      <div>
        <Toaster position="top-right" />
      </div>
      <div className={classes.title_container}>
        <FlechaAtras />
        <h1 className={classes.title}>Registrar venta</h1>
      </div>

      <form>
        <div className="row mb-4">
          <div className="col-3">
            <label htmlFor="fecha">Fecha</label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              className="form-control"
              value={formattedDate}
              readOnly
              style={{ backgroundColor: "white" }}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-4">
            <label htmlFor="rucCliente">RUC</label>
            <input
              type="text"
              id="rucCliente"
              name="rucCliente"
              className="form-control"
              onKeyDown={async (e) => {
                if (e.key === "Tab") {
                  await getClienteById(e.target.value);
                }
              }}
            />
          </div>
          <div className="col">
            <label htmlFor="nombreCliente">Razon social</label>
            <input
              id="razon-social"
              name="nombreCliente"
              className="form-control"
              value={clienteInfo.nombre}
              readOnly
              style={{ backgroundColor: "white" }}
            />
          </div>
        </div>
        <div className="col mb-4">
          <label htmlFor="direccion">Direccion</label>
          <input
            id="direccion"
            name="direccion"
            className="form-control"
            value={clienteInfo.direccion}
            readOnly
            style={{ backgroundColor: "white" }}
          />
        </div>
        <hr />
        {/* Detalles */}
        <div className="row mb-4 align-items-center">
          <div className="col">
            <label htmlFor="codigo">Codigo</label>
            <input
              type="number"
              id="codigo"
              name="codigo"
              className="form-control"
              style={{ width: "120px" }}
              min={0}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="col-1">
            <label htmlFor="cantidad">Cantidad</label>
            <input
              type="number"
              id="cantidad"
              name="cantidad"
              className="form-control"
              value={producto.cantidad}
              min={1}
              max={cantidadMaxima}
              onChange={(e) => {
                const nuevaCantidad = parseInt(e.target.value);
                if (nuevaCantidad <= cantidadMaxima) {
                  setProducto({
                    ...producto,
                    cantidad: nuevaCantidad,
                  });
                }
              }}
            />
          </div>
          <div className="col-3">
            <label htmlFor="descripcion">Descripcion</label>
            <input
              id="descripcion"
              name="descripcion"
              className="form-control"
              value={producto.descripcion}
              readOnly
              style={{ backgroundColor: "white" }}
            />
          </div>
          <div className="col">
            <label htmlFor="precio-unitario">P. Unitario</label>
            <input
              type="number"
              id="precio-unitario"
              name="precio_unitario"
              className="form-control"
              style={{ width: "150px", backgroundColor: "white" }}
              value={producto.precio}
              readOnly
            />
          </div>
          <div className="col-1">
            <label htmlFor="iva">IVA(%)</label>
            <input
              type="number"
              id="iva"
              name="iva"
              className="form-control"
              value={producto.iva}
              readOnly
              style={{ backgroundColor: "white" }}
            />
          </div>
          <div className="col">
            <label htmlFor="subtotal">Subtotal</label>
            <input
              type="number"
              id="subtotal"
              name="subtotal"
              className="form-control"
              style={{ width: "150px", backgroundColor: "white" }}
              value={producto.precio * producto.cantidad}
              readOnly
            />
          </div>
          <div className="col mt-1">
            <Btn
              type="secondary"
              outline
              className="mt-4"
              onClick={handleAgregarItem}
            >
              Agregar Item
            </Btn>
          </div>
        </div>
        <hr />
        <div className={classes.table_container}>
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Cantidad</th>
                <th>Descripcion</th>
                <th>P. Unitario(Gs)</th>
                <th>IVA(%)</th>
                <th>Subtotal(Gs)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((detalle, index) => (
                <tr key={index}>
                  <td>{detalle.cantidad}</td>
                  <td>{detalle.descripcion}</td>
                  <td>{detalle.precioUnitario.toLocaleString("es-ES")}</td>
                  <td>{detalle.iva}</td>
                  <td>{detalle.subtotal.toLocaleString("es-ES")}</td>
                  <td>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => handleDeleteDetalle(index)}
                    >
                      <RiDeleteBinLine />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={classes.button_container}>
          <Btn submit type="primary" onClick={handleSubmit}>
            Generar factura
          </Btn>
        </div>
      </form>
    </div>
  );
};

export default FacturaForm;
