import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InfoClients from "./pages/clients/InfoClients";
import PageNotFound from "./pages/PageNotFound";
import Layout from "./components/layout/Layout";
import MainClients from "./pages/clients/mainClients";
import MainUsers from "./pages/users/mainUsers";
import Login from "./pages/Login";
import MainProductos from "./pages/productos/MainProductos";
import Servicios from "./pages/servicios/MainServicios";
import InfoServicios from "./pages/servicios/InfoServicios";
import MainProveedores from "./pages/proveedores/MainProveedores";
import MainMiUsuario from './pages/mi_usuario/mainMiUsuario';
import MainCaja from "./pages/caja/MainCaja";
import { CobrosPendientesVista } from "./pages/caja/cobrosPendientes/cobrosPendientesVista";
import CurrentUserProvider from "./context/UserContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import MainLista from "./pages/caja/ventas/lista/MainLista";
import MainVenta from "./pages/caja/ventas/factura/MainVenta";
import InfoCajas from "./pages/caja/listaCajas/InfoCajas";
import ComprasCaja from "./pages/caja/comprasProveedores/ComprasCaja";
import ListaCompras from "./pages/caja/comprasProveedores/ListaCompras";
import { ComprasCajaProvider } from "./context/ComprasCajaState";
import MainDashboard from "./pages/dashboard/MainDashboard";
import MDGrid from "./pages/dashboard/MDGrid";


createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CurrentUserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route exact element={<ProtectedRoute roles={["ADMIN"]} />}><Route exact path="/dashboard" element={<Layout><MainDashboard /></Layout>}/>
          </Route>
          <Route exact element={<ProtectedRoute roles={["ADMIN"]} />}><Route exact path="/mdtest" element={<Layout><MDGrid /></Layout>}/>
          </Route>
          <Route
            path="/clientes"
            element={
              <Layout>
                <MainClients />
              </Layout>
            }
          />
          <Route
            path="/users"
            element={
              <Layout>
                <MainUsers />
              </Layout>
            }
          />
          <Route
            path="/clientesinfo/:id"
            element={
              <Layout>
                <InfoClients />
              </Layout>
            }
          />
          <Route
            path="/productos"
            element={
              <Layout>
                <MainProductos />
              </Layout>
            }
          />
          <Route
            path="/servicios"
            element={
              <Layout>
                <Servicios />
              </Layout>
            }
          />
          <Route
            path="/infoServicio/:id"
            element={
              <Layout>
                <InfoServicios />
              </Layout>
            }
          />
          <Route
            path="/proveedores"
            element={
              <Layout>
                <MainProveedores />
              </Layout>
            }
          />

          {/*seccion de caja, agregar sus flujos de compra, venta, etc.*/}
          <Route
            path="/caja"
            element={
              <Layout>
                <MainCaja />
              </Layout>
            }
          />
          <Route exact element={<ProtectedRoute roles={["ADMIN", "CAJERO"]} />}>
            <Route
              exact
              path="/caja"
              element={
                <Layout>
                  <MainCaja />
                </Layout>
              }
            />
          </Route>
          <Route
            path="/caja"
            element={
              <Layout>
                <MainCaja />
              </Layout>
            }
          />
          <Route exact element={<ProtectedRoute roles={["ADMIN"]} />}>
            <Route
              exact
              path="/caja/lista"
              element={
                <Layout>
                  <InfoCajas />
                </Layout>
              }
            />
          </Route>
          <Route
            path="/caja/pendientes"
            element={
              <Layout>
                <CobrosPendientesVista />
              </Layout>
            }
          />
          <Route
            path="/caja/lista-ventas"
            element={
              <Layout>
                <MainLista />
              </Layout>
            }
          />
          <Route
            path="/caja/ventas"
            element={
              <Layout>
                <MainVenta />
              </Layout>
            }
          />
          <Route
            path="/caja/compras"
            element={
              <Layout>
                <ComprasCaja />
              </Layout>
            }
          />
          <Route
            path="/caja/lista-compras"
            element={
              <Layout>
                <ComprasCajaProvider>
                  <ListaCompras />
                </ComprasCajaProvider>
              </Layout>
            }
          />

          <Route path="/miUsuario" element={<Layout><MainMiUsuario /></Layout>} />

          <Route
            path="*"
            element={
              <Layout>
                <PageNotFound />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </CurrentUserProvider>
  </React.StrictMode>
);
