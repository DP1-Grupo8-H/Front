import React, {useState} from "react";

import CiudadService from '../../services/ciudadService.js'

const dataExtractor = async (values, id, fileName) => {
  const year = fileName.slice(6,-2);
  const month = fileName.slice(-2);

  const ciudad = await CiudadService.getCiudad(values[5].trim());
  const almacen = await CiudadService.getCiudad(values[3].trim());
  //Obtain the date   -- THIS NEEDS TO CHANGE -- TO A GLOBAL STATE
  const currentDate = new Date();
  currentDate.setFullYear(parseInt(year));
  currentDate.setMonth(parseInt(month)-1);
  currentDate.setDate(parseInt(values[0]));
  currentDate.setHours(parseInt(values[1]));
  currentDate.setMinutes(parseInt(values[2]));
  currentDate.setSeconds(0);
  
  const maxDate = new Date();
  maxDate.setFullYear(currentDate.getFullYear());
  maxDate.setMonth(currentDate.getMonth());
  maxDate.setDate(currentDate.getDate());
  maxDate.setHours(currentDate.getHours());
  maxDate.setMinutes(currentDate.getMinutes());

  switch (ciudad[0].region){
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
    ciudad: ciudad[0],
    almacen: almacen[0],
    id_asociado: 0,
    estado: 0,
    ruta: null,
    fecha_llegada: null,
  }

  return pedido;

}

export default {dataExtractor}