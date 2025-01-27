import { useState } from "react";
import api from "../utils/api";

export const useMovimientos = () => {

    const DIR = "/movimientos"

    const [error, setError] = useState(null)
    const [isLoadingList, setIsLoadingList] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [notFound, setNotFound] = useState(false)



    const handleRequest = async (FuncionBackend) => {
        try {
            const res = await FuncionBackend()
            return res.data
        } catch (error) {
            if (error.response?.status === 404) {
                setNotFound(true)
            }
            else {
                setError(error)
            }
        }
    }
    
    const crearMovimiento = async (movimiento) => {
        return handleRequest(async () => await api.post(`${DIR}`, movimiento))
    }

    const getMovimientos = async (page=1) => {
        setIsLoadingList(true)
        const res= handleRequest(async () => await api.get(`${DIR}/page/${page}`))
        setIsLoadingList(false)
        return res;
    }

    const getMovimientoPorId = async (id) => {
        setIsLoading(true)
        const res = handleRequest(async () => await api.get(`${DIR}/${id}`))
        setIsLoading(false)
        return res;
    }

    const searchMovimientosByNombre = async (nombre,page=1) => {
        setIsLoadingList(true)
        const res = handleRequest(async () => await api.get(`${DIR}/search/nombre/${nombre}/page/${page}`))
        setIsLoadingList(false)
        return res;
    }


    return { crearMovimiento, getMovimientos, getMovimientoPorId, searchMovimientosByNombre, error, notFound, isLoadingList, isLoading }

}