import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../InfoClients.css";

import toast, { Toaster } from "react-hot-toast";
import { useParams, useSearchParams } from "react-router-dom";
import { IoArrowBackSharp, IoAdd } from "react-icons/io5";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { IoPencilOutline } from "react-icons/io5";

import ButtonBasic from "../../../components/bottons/ButtonBasic.jsx";

import ModalBase from "../../../components/modals/ModalBase.jsx";
import CustomAlert from "../../../components/alert/CustomAlert.jsx";

import { Link } from "react-router-dom";
import TablaActividadesCliente from "../../../components/tablas/TablaActividadesCliente.jsx";
import TablaMedicionesCliente from "../../../components/tablas/TablaMedicionesClientes.jsx";
import TablaPagosClientes from "../../../components/tablas/TablaPagosClientes.jsx";
import CartaPrincipal from "../../../components/cartaPrincipal/CartaPrincipal.jsx";
import FormularioCliente from "../../../components/Formularios/FormularioCliente.jsx";
import FormularioMedicion from "../../../components/Formularios/FormularioMedicion.jsx";

import useClienteData from "../../../hooks/useClientesData";

const InformacionClientes = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const {
    getClienteById,
    getMedicionClienteById,
    getPagosClienteById,
    setCliente,
    setMediciones,
    actualizarCliente,
    mediciones,
    crearMedicion,
    eliminarMedicion,
    cliente,
    isLoading,
    error,
  } = useClienteData();

  const [showPayments, setShowPayments] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [showActivities, setShowActivities] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState("one");
  const [editingClient, setEditingClient] = useState(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'editClient' o 'nuevaMedicion'

  const [errorMessage, setErrorMessage] = useState(null);
  const [pagos, setPagos] = useState([]);

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [refreshKey, setRefreshKey] = useState(0);
  const [formValues, setFormValues] = useState({
    peso: "",
    altura: "",
    imc: "",
    cirBrazo: "",
    cirPiernas: "",
    cirCintura: "",
    cirPecho: "",
    clienteID: "",
  });
  const [detailsVisible, setDetailsVisible] = useState(false);
  const fetchData = async (page) => {
    try {
      const clienteResponse = await getClienteById(id, page); // Obtenemos los datos del cliente
      const medicionesResponse = await getMedicionClienteById(id, page); // Obtenemos las mediciones
      const pagosResponse = await getPagosClienteById(id, page);
      setCliente(clienteResponse); // Actualizamos el estado del cliente
      setMediciones(medicionesResponse.items); // Actualizamos el estado de las mediciones
      setPagos(pagosResponse.items);
      setTotalPages(medicionesResponse.totalPages);
      if (pagosResponse.items.length === 0) {
        setErrorMessage("Este cliente no posee pagos disponibles.");
      }
    } catch (error) {
      // Manejo de errores
      console.error("Error al obtener datos del cliente y mediciones:", error);
    }
  };

  useEffect(() => {
    // Llamar a fetchData solo cuando shouldRefetch sea verdadero
    if (shouldRefetch) {
      fetchData(currentPage);
      setShouldRefetch(false); // Restablecer shouldRefetch después de obtener los datos
    }
  }, [shouldRefetch, currentPage, id, mediciones]);

  const handleConfirmDelete = async (medicionId) => {
    try {
      await eliminarMedicion(medicionId);
      // Actualiza el estado de las mediciones después de la eliminación
      const medicionesResponse = await getMedicionClienteById(id, currentPage);
      setMediciones(medicionesResponse.items);
      setShowAlert(false); // Oculta el mensaje de confirmación
      toast.success("Medición eliminada con éxito");
    } catch (error) {
      console.error("Error al eliminar medición:", error);
      toast.error("Error al eliminar la medición");
    }
  };
  const handleCancelDelete = () => {
    setShowAlert(false); // Oculta la alerta
  };

  useEffect(() => {
    // Llama a la función fetchData solo cuando cambie currentPage
    fetchData(currentPage);
  }, [currentPage]);

  // Función para obtener las iniciales del nombre y del apellido
  const getInitials = (name) => {
    const words = name.split(" ");
    // Tomar solo las iniciales de los dos primeros nombres
    const initials = words
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("");
    return initials.toUpperCase();
  };
  const initials = cliente ? getInitials(cliente.nombre) : "";

  const ButtonBasic2 = ({ initials }) => {
    const circleSize = 150; // Cambia el tamaño deseado
    const fontSize = 60; // Cambia el tamaño de la fuente deseado
    return (
      <svg width={circleSize} height={circleSize}>
        <circle
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={circleSize / 2 - 5}
          fill="#F9F5FF"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="0.35em"
          fill="#7F56D9"
          fontSize={fontSize}
        >
          {initials}
        </text>
      </svg>
    );
  };
  // Función para manejar el cambio de pestaña
  const handleChange = (event, newValue) => {
    setValue(newValue);
    // Actualiza los estados para mostrar u ocultar las tablas según la pestaña seleccionada
    if (newValue === "one") {
      setShowPayments(true);
      setShowMeasurements(false);
      setShowActivities(false);
    } else if (newValue === "two") {
      setShowPayments(false);
      setShowMeasurements(true);
      setShowActivities(false);
    } else if (newValue === "three") {
      setShowPayments(false);
      setShowMeasurements(false);
      setShowActivities(true);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (modalAction === "editClient") {
      setEditingClient((prevEditingClient) => ({
        ...prevEditingClient,
        [name]: value,
      }));
    } else if (modalAction === "nuevaMedicion") {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        [name]: value,
      }));
    }
  };

  const handleMedicionChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevFormValues) => ({
      // Actualiza el estado formValues
      ...prevFormValues,
      clienteID: id,
      [name]: value, // Actualiza el valor del campo correspondiente
    }));
  };

  // Función para abrir el modal cuando se hace clic en "Editar Cliente"
  const handleEditClientClick = () => {
    setEditingClient(cliente);
    setModalOpen(true);
    setModalAction("editClient");
  };

  const handleNuevaMedicionClick = () => {
    setModalOpen(true);
    setModalAction("nuevaMedicion");
  };
  // Función para cerrar el modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCrearMedicion = async () => {
    const isEmpty = Object.values(formValues).some((value) => value === "");
    if (isEmpty) {
      toast.error("Por favor completa todos los campos.");
      return;
    }
    try {
      await crearMedicion(id, formValues); // Crear la nueva medición
      const medicionesResponse = await getMedicionClienteById(id, currentPage); // Obtener las mediciones actualizadas
      setMediciones(medicionesResponse.items); // Actualizar el estado mediciones
      setRefreshKey(refreshKey + 1);
      setModalOpen(false);
      toast.success("Medición creada con éxito");
    } catch (error) {
      console.error("Error al crear medición:", error);
      toast.error("Error al crear la medición");
    }
  };

  const handleAceptar = async () => {
    try {
      const updatedCliente = await actualizarCliente(id, editingClient);
      setCliente(updatedCliente.data); // Actualiza el estado del cliente con los nuevos datos
      setModalOpen(false);
      toast.success("Cliente actualizado con exito");
      setShouldRefetch(true); // Indicar que se deben obtener los datos actualizados
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      toast.error("Error al actualizar el cliente");
    }
  };

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
      <CartaPrincipal>
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
        <div style={{ marginLeft: "3%" }}>
          <Link to="/clientes">
            <button className="custom-button">
              <IoArrowBackSharp />
            </button>
          </Link>
        </div>
        <div className="cuadro-medio">
          {cliente && (
            <div className="info-cliente">
              <div>
                <ButtonBasic2 initials={initials} />
              </div>
              <div className="headerMi col-5 pt-2">
                <h1 style={{ color: "#667085" }}>{cliente.nombre}</h1>
              </div>
              <div className="col-3 prueba text-center">
                <ButtonBasic
                  icon={<IoPencilOutline />}
                  color="secondary"
                  text="Editar Cliente"
                  onClick={handleEditClientClick}
                />
              </div>
            </div>
          )}
          {/* Modal que se abre al editar */}
          <ModalBase
            open={modalOpen}
            title={
              modalAction === "editClient" ? "Editar Cliente" : "Nueva Medición"
            }
            closeModal={handleCloseModal}
          >
            {modalAction === "editClient" ? (
              <FormularioCliente
                cliente={editingClient}
                onInputChange={handleInputChange}
                onAceptar={handleAceptar}
              />
            ) : (
              <FormularioMedicion
                formValues={formValues}
                onInputChange={handleMedicionChange}
                onCrearMedicion={handleCrearMedicion}
              />
            )}
          </ModalBase>
          <hr />
          {cliente && (
            <div
              className="contenedorDetalles"
              style={{ display: detailsVisible ? "block" : "none" }}
            >
              <div className="row">
                <div className="col-4 text-center">
                  <h4 style={{ fontSize: "30px", color: "#667085" }}>Plan</h4>
                  <p style={{ fontSize: "20px" }}>Mensual</p>
                </div>
                <div className="col-4 text-center">
                  <h4 style={{ fontSize: "30px", color: "#667085" }}>Teléfono</h4>
                  <p style={{ fontSize: "20px" }}>{cliente.telefono}</p>
                </div>
                <div className="col-4 text-center">
                  <h4 style={{ fontSize: "30px", color: "#667085" }}>RUC</h4>
                  <p style={{ fontSize: "20px" }}>{cliente.ruc}</p>
                </div>
              </div>
              <hr />
            </div>
          )}
          <div className="text-center mt-3 ">
            <button
              className="btnDetalles"
              onClick={() => setDetailsVisible(!detailsVisible)}
              style={{}}
            >
              <span style={{ marginBottom: "5px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></svg>
              </span>
              {detailsVisible ? (
                <>
                  Cerrar detalles
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                </>
              ) : (
                <>
                  Mostrar detalles
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </>
              )}
            </button>
          </div>
          <div style={{ marginLeft: "73%" }}>
            <ButtonBasic
              icon={<IoAdd />}
              color="secondary"
              text="Nueva Medicion"
              onClick={handleNuevaMedicionClick}
            />
          </div>
          <div className="d-flex justify-content-center">
            <div className="d-flex justify-content-center mb-3">
              <Tabs
                value={value}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
              >
                <Tab value="one" label="Pagos" />
                <Tab value="two" label="Mediciones" />
                <Tab value="three" label="Actividades" />
              </Tabs>
            </div>
          </div>

          {/* Renderiza la tabla de pagos si showPayments es true */}
          {showPayments && (
            <TablaPagosClientes
              clienteId={id}
              page={currentPage}
              setParentTotalPages={setCurrentPage}
            />
          )}

          {/* Renderiza la tabla de mediciones si showMeasurements es true */}
          {showMeasurements && (
            <TablaMedicionesCliente
              key={refreshKey}
              clienteId={id}
              toast={toast}
              page={currentPage}
              setParentTotalPages={setCurrentPage}
              handleEliminarMedicion={handleConfirmDelete}
            />
          )}
          {showAlert && (
            <CustomAlert
              message={`¿Estás seguro de eliminar esta medición?`}
              confirmText="Aceptar"
              cancelText="Cancelar"
              confirmAction={() => handleConfirmDelete(id)}
              cancelAction={handleCancelDelete}
              show={showAlert} // Pasa el estado para controlar si se muestra el mensaje de confirmación
            />
          )}

          {showActivities && (
            <TablaActividadesCliente
              clienteId={id}
              toast={toast}
              page={currentPage}
            />
          )}
        </div>
      </CartaPrincipal>
    </>
  );
};

export default InformacionClientes;
