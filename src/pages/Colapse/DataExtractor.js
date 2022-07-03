import React, {useState} from "react";

import CiudadService from '../../services/ciudadService.js'


const findCiudades = async (ciudades, line) => {
  const ciudad = await ciudades.find(c => {
    return (c.ubigeo === parseInt(line.trim()))
  })
  return ciudad;
}

const dataExtractor = async (values, id, ciudades, year, month) => {
  
  const ciudad = await findCiudades(ciudades, values[5]);
  const almacen = await findCiudades(ciudades, values[3]); 
  //Obtain the date   -- THIS NEEDS TO CHANGE -- TO A GLOBAL STATE
  const currentDate = new Date();
  currentDate.setFullYear(parseInt(year));
  currentDate.setMonth(parseInt(month)-1);
  currentDate.setDate(parseInt(values[0]));
  currentDate.setHours(parseInt(values[1]));
  currentDate.setMinutes(parseInt(values[2]));
  currentDate.setSeconds(0);
  
  const maxDate = new Date(currentDate);

  switch (ciudad.region){
      case 'COSTA':
          maxDate.setDate(maxDate.getDate() + 1);
          break;
      case 'SIERRA':
          maxDate.setDate(maxDate.getDate() + 2);
          break;
      case 'SELVA':
          maxDate.setDate(maxDate.getDate() + 3);
          break;
      default:
          maxDate.setDate(maxDate.getDate() + 2);
          break;
  }
  const pedido = {
    id_pedido: id,
    codigo: values[7],
    fecha_registro: currentDate,
    fecha_entrega_max: maxDate,
    // hora_entrega_max_hh: parseInt(values[1]),
    // hora_entrega_max_mm: parseInt(values[2]),
    cantidad: parseInt(values[6]), 
    cliente: null,
    ciudad: ciudad,
    almacen: almacen,
    id_padre: 0,
    estado: 0,
    ruta: null,
    fecha_entrega: null,
  }

  return pedido;

}

export default {dataExtractor}