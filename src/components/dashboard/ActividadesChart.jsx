import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import SkeletonWrapper from '../loadingSkeleton/SkeletonWrapper';
import { useDashboard } from '../../context/DashboardContext';

//FORMATO para los datos:
// [
//     {
//         "actividad": "Actividad1",
//         "cantidad": 10,
//     },
//     {
//         "actividad": "Actividad2",
//         "cantidad": 20,
//     }


const MAX_ACTIVIDADES_TO_SHOW = 10;

const ActividadesChart = () => {

    const { getActividadesMasRegistradas, isLoadingActividades } = useDashboard();

    const [actividadesMasClientes, setActividadesMasClientes] = useState(null);
    const [actividadesLabels, setActividadesLabels] = useState(null); //nombres en string de los productos como un arreglo

    const [actividadMasRegistrada, setActividadMasRegistrada] = useState(null); //un producto singular el cual es el mas vendido

    const setDataFromKeys = (data) => {
        const months = ['Clientes']
        let newData = [];

        //por cada mes se hace el bucle, añadiendo los productos y su cantidad
        months.forEach(month => {
            let newActividad = {}
            newActividad['actividad'] = month
            data.forEach(actividad => {
                newActividad[actividad.actividad] = actividad.cantidad
            })
            newData.push(newActividad)
        })
        return newData
    }

    //llamar a esta funcion cuando se quieran cambiar los datos en el grafico
    const ordenarDatos = async () => {
        //asumiendo que las fechas de los states ya estan formateados, importante, formato: yyyy-mm-dd
        let data = await getActividadesMasRegistradas()
        //si hay mas de 10 actividades, solo mostrar las primeros 10, cuando hay muchos datos, se volverá feo
        data = data.slice(0, MAX_ACTIVIDADES_TO_SHOW);

        setActividadesMasClientes(setDataFromKeys(data))
        const labels = data.map(actividad => actividad.actividad)
        setActividadesLabels(labels)

        //tambien obtener el producto que fue mas vendido
        if (labels && labels?.length <= 0) {
            setActividadMasRegistrada(null)
        } else if (data.length > 0) {
            const actividadMasRegistrada = data.reduce((prev, current) => (prev.cantidad > current.cantidad) ? prev : current)
            setActividadMasRegistrada(actividadMasRegistrada.actividad)
        }
    }


    useEffect(() => {
        ordenarDatos()
    }, [isLoadingActividades])

    const switchRender = () => {
        if (actividadesLabels && actividadesLabels.length === 0) {
            return (<h4 className='gananciasDiv aGreen'>No hay ingresos en el rango seleccionado.</h4>)
        }
        if (isLoadingActividades) {
            return (<SkeletonWrapper width={475}><Skeleton style={{ height: 280 }} /></SkeletonWrapper>)
        }
        return (<ResponsiveBar
            data={actividadesMasClientes}
            keys={actividadesLabels}
            indexBy="actividad"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.15}
            groupMode="grouped"
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'category10' }}
            /*defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: '#38bcb2',
                    size: 4,
                    padding: 1,
                    stagger: true
                },
                {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: '#eed312',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10
                 }
            ]}*/
            fill={[]}
            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        1.6
                    ]
                ]
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legendPosition: 'middle',
                legendOffset: 38,
                truncateTickAt: 0
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Clientes',
                legendPosition: 'middle',
                legendOffset: -40,
                truncateTickAt: 0,
                format: value => {
                    if (value % 1 === 0) {
                        return value
                    } else {
                        return ''
                    }
                }
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        1.6
                    ]
                ]
            }}
            legends={[
                {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
            role="application"
            ariaLabel="Grafico de Clientes por Actividad"
            barAriaLabel={e => e.id + ": " + e.formattedValue + " in mes: " + e.indexValue}
        />)
    }

    return (
        <>
            <div className='graphSection'>
                {switchRender()}
            </div>
            {isLoadingActividades ? (<Skeleton style={{ width: 280 }} />)
                :
                (actividadMasRegistrada && (<i className='p-0 m-0'>Actividad mas suscrita: {actividadMasRegistrada}.</i>))
            }
        </>
    )
}

export default ActividadesChart;