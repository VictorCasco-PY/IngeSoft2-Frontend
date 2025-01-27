import React, { useEffect, useState } from "react";
import FlechaAtras from "../../components/flechaAtras/FlechaAtras";
import { Btn } from "../../components/bottons/Button";
import useCaja from "../../hooks/useCaja";
import CajaStorage from "../../utils/CajaStorage";
import useArqueo from "../../hooks/useArqueo";
import { format } from "date-fns";
import { precioHandler } from "../../utils/precioHandler";
import { useArqueoContext } from "../../context/ArqueoContext";
import { getCurrentHour } from "../../utils/DateStatics";
import useSesionCaja from "../../hooks/useSesionCaja";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ArqueoPage = () => {
  const navigate = useNavigate();
  const { getCajaById } = useCaja();
  const { getArqueoBySesionId, data, isLoading } = useArqueo();
  const [caja, setCaja] = useState({});
  const fechaActual = format(new Date(), "dd-MM-yyyy");
  const { arqueoData } = useArqueoContext();
  const [sesionCaja, setSesionCaja] = useState({});
  const { cerrarCajaById } = useSesionCaja();

  const {
    totalEntradaEfectivo,
    totalEntradaTarjeta,
    totalEntradaTransferencia,
    totalSalidaEfectivo,
    totalSalidaTarjeta,
    totalSalidaTransferencia,
  } = arqueoData;

  const totalEntrada =
    totalEntradaEfectivo + totalEntradaTarjeta + totalEntradaTransferencia;
  const totalSalida =
    totalSalidaEfectivo + totalSalidaTarjeta + totalSalidaTransferencia;

  const cerrarCajaActual = async () => {
    const hora = getCurrentHour();
    const putData = {
      horaCierre: hora,
    };

    const response = await cerrarCajaById(
      CajaStorage.getSesionCajaId(),
      putData
    );

    if (!response) {
      toast.error("Error al cerrar caja. Revise la conexión.");
      return;
    }
    setSesionCaja(response);

    CajaStorage.cerrarCaja();
    toast.success(
      `Caja cerrada con éxito a las ${hora}. Redirigiendo a la página principal..`
    );
    setTimeout(() => {
      navigate("/caja");
    }, 2500);
  };

  console.log("Arqueo data: ", arqueoData);

  useEffect(() => {
    const fetchCaja = async () => {
      const response = await getCajaById(CajaStorage.getCajaId());
      setCaja(response);
    };

    fetchCaja();
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          success: {
            style: {
              background: "#75B798",
              color: "#0A3622",
            },
          },
          error: {
            style: {
              background: "#FFDBD9",
              color: "#D92D20",
            },
          },
        }}
      />
      <div className="d-flex align-items-center align-content-center">
        <FlechaAtras ruta={"/caja"} />
        <h1 className="mx-4">Arqueo Caja</h1>
      </div>
      <div className="row align-items-center m-3 justify-content-between">
        <div className="col-2">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Fecha
            </span>
            <input
              type="text"
              class="form-control"
              aria-label="Fecha"
              aria-describedby="basic-addon1"
              value={fechaActual}
              readOnly
              style={{ backgroundColor: "white" }}
            />
          </div>
        </div>
        <div className="col-3">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Saldo de cierre
            </span>
            <input
              type="text"
              className="form-control"
              aria-label="Saldo_de_cierre"
              aria-describedby="basic-addon1"
              readOnly
              value={precioHandler(caja.monto)}
              style={{ backgroundColor: "white" }}
            />
          </div>
        </div>
        <div className="col-3 me-4">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Caja
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Caja 1"
              aria-label="Caja"
              aria-describedby="basic-addon1"
              value={caja.nombre || "Caja"}
              readOnly
              style={{ backgroundColor: "white" }}
            />
          </div>
        </div>
        <div className="col d-flex align-items-center justify-content-center gap-3">
          {sesionCaja.horaCierre ? (
            <p className="p-0 m-0 cajaMiscFont">
              Caja cerrada a las {sesionCaja.horaCierre}
            </p>
          ) : (
            <p className="p-0 m-0 cajaMiscFont">Caja en curso</p>
          )}
          <Btn id="btn-cerrar-caja" outline onClick={cerrarCajaActual}>
            Cerrar Caja
          </Btn>
        </div>
        <hr />
      </div>

      {/**Arqueo */}
      <div className="row align-items-center align-content-center ms-5 mt-5 justify-content-between d-flex">
        <div className="col-4">
          <div className="card text-dark bg-light mb-3">
            <div className="card-header">
              <h4>Tipo de pago/cobro</h4>
            </div>
            <div className="card-body">
              <h5 className="card-title">Efectivo</h5>
              <hr />
              <h5 className="card-title">Tarjeta</h5>
              <hr />
              <h5 className="card-title">Transferencia</h5>
            </div>
            <div className="card-footer">
              <h5>Totales</h5>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card text-dark bg-light mb-3">
            <div className="card-header">
              <h4>Entrada</h4>
            </div>
            <div className="card-body text-end">
              <h5 className="card-title">
                {totalEntradaEfectivo == 0
                  ? 0
                  : precioHandler(totalEntradaEfectivo)}
              </h5>
              <hr />
              <h5 className="card-title">
                {totalEntradaTarjeta == 0
                  ? 0
                  : precioHandler(totalEntradaTarjeta)}
              </h5>
              <hr />
              <h5 className="card-title">
                {totalEntradaTransferencia == 0
                  ? 0
                  : precioHandler(totalEntradaTransferencia)}
              </h5>
            </div>
            <div className="card-footer text-end">
              <h5>{totalEntrada == 0 ? 0 : precioHandler(totalEntrada)}Gs.</h5>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card text-dark bg-light mb-3 ">
            <div className="card-header">
              <h4>Salida</h4>
            </div>
            <div className="card-body text-end">
              <h5 className="card-title">
                {totalSalidaEfectivo == 0
                  ? 0
                  : precioHandler(totalSalidaEfectivo)}
              </h5>
              <hr />
              <h5 className="card-title">
                {totalSalidaTarjeta == 0
                  ? 0
                  : precioHandler(totalSalidaTarjeta)}
              </h5>
              <hr />
              <h5 className="card-title">
                {totalSalidaTransferencia == 0
                  ? 0
                  : precioHandler(totalSalidaTransferencia)}
              </h5>
            </div>
            <div className="card-footer text-end">
              <h5>{totalSalida == 0 ? 0 : precioHandler(totalSalida)}Gs.</h5>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArqueoPage;
