export const precioHandler = (precio) => {
  if(!precio) return;
  
  // normalizar precio (si ya tiene ., sacarlos)
  precio = normalizarPrecio(precio)

  let result = precio.toString();

  // Dividir la cadena en grupos de 3 desde la derecha
  let grupos = [];
  while (result.length > 3) {
    grupos.unshift(result.slice(-3));
    result = result.slice(0, -3);
  }

  grupos.unshift(result); // Agregar el primer grupo

  // Unir los grupos con puntos y devolver el resultado
  return `${grupos.join(".")}`;
};


export const normalizarPrecio = (precio) => {
  return parseInt(precio?.toString().replace(/\./g, ''));
}