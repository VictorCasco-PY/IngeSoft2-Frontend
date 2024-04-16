const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

//formatear date al formato del back end
//yyyy-mm-dd
export const formatDate = (date) => {
    const fecha = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1) + "-" + (date.getDate() < 10 ? '0' : '') + date.getDate(); //todo: la fecha ya se formatea en el back, no importa formatear exactamente
    return fecha
}

//de formateado a date real
export const formattedToDate = (date) => {
    if (!date) return null;
    const dateArray = date.split("-");
    if (dateArray.length !== 3) return null;
    return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
}

export const formatHour = (date) => {
    //hh:mm:ss
    const dateArray = date.split("T");
    return dateArray[1].substring(0, 5);
}

export const getCurrentDate = () => {
    const today = new Date();
    return formatDate(today);
}

export const getCurrentHour = () => {
    const today = new Date();
    return formatHour(today);
}

export const getMonthName = (monthIndex) => {
    return MESES[monthIndex];
}

export const getCurrentMonthName = () => {
    const fechaActual = new Date();
    const mesIndex = fechaActual.getMonth();
    return MESES[mesIndex];
}

export const getCurrentYear = () => {
    const fechaActual = new Date();
    return fechaActual.getFullYear();
}

export const invertDateString = (date) => {
    //año-mes-dia a dia-mes-año
    const dateArray = date.split("-");
    return dateArray[2] + "-" + dateArray[1] + "-" + dateArray[0];
}

//gracias ai
//date 1 si es igual o mayor a date 2
//año-mes-dia
export const dateIsLaterOrEqualThan = (date1, date2) => {
    const date1Array = date1.split("-");
    const date2Array = date2.split("-");
    if (parseInt(date1Array[0]) > parseInt(date2Array[0])) {
        return true;
    } else if (parseInt(date1Array[0]) === parseInt(date2Array[0])) {
        if (parseInt(date1Array[1]) > parseInt(date2Array[1])) {
            return true;
        } else if (parseInt(date1Array[1]) === parseInt(date2Array[1])) {
            if (parseInt(date1Array[2]) >= parseInt(date2Array[2])) {
                return true;
            }
        }
    }
    return false;
}

export const dateIsLaterThan = (date1, date2) => {
    const date1Array = date1.split("-");
    const date2Array = date2.split("-");
    if (parseInt(date1Array[0]) > parseInt(date2Array[0])) {
        return true;
    } else if (parseInt(date1Array[0]) === parseInt(date2Array[0])) {
        if (parseInt(date1Array[1]) > parseInt(date2Array[1])) {
            return true;
        } else if (parseInt(date1Array[1]) === parseInt(date2Array[1])) {
            if (parseInt(date1Array[2]) > parseInt(date2Array[2])) {
                return true;
            }
        }
    }
    return false;
}

// obtiene la fecha de hace una semana
export const getLastWeekDate = () => {
    const today = new Date();
    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    return formatDate(lastWeek);
}

//obtener formato ({dia} del {Mes}, {año})
export const getFullDateString = (date) => {
    const dateArray = date.split("-");
    return dateArray[2] + " de " + MESES[parseInt(dateArray[1]) - 1] + ", " + dateArray[0];
}

export const getDateMinusMonths = (months) => {
    if (months < 0) return null;
    const dateArray = getCurrentDate().split("-");
    const newDate = new Date(dateArray[0], dateArray[1] - months, dateArray[2]);
    return formatDate(newDate);
}