import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form"
import BotonCrear from "../../components/bottons/ButtonCrear";
import MainSquare from "../../components/mainSquare/MainSquare";
import './MainCaja.css'

const MainCaja = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => console.log(data);

    return (
        <>
            <MainSquare>
                <h1>Registrar Nueva Caja</h1>
                <form>
                    <label for="nombre">Nombre de la Caja</label>
                    <input type="text" placeholder="nombre" {...register("nombre", { required: true, maxLength: 15, minLength: 5 })} />
                    <label for="monto">Monto de la Caja</label>
                    <input type="number" placeholder="monto" {...register("monto", { required: true, max: 10000000, min: 50000 })} />
                    <BotonCrear
                        onClick={handleSubmit(onSubmit)}
                        text={"Registrar Caja"}
                    />
                </form>
            </MainSquare>
        </>
    )
}


export default MainCaja