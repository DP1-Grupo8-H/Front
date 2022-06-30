import React from 'react';
import { PROM_CARG } from '../../constants/Sim_Params';

//FUNCIONES
function gcd(a, b) 
{ 
    if (a === 0) 
        return b; 
    return gcd(b % a, a); 
} 
function findGCD (arr, n) 
{ 
    let result = arr[0]; 
    for (let i = 1; i < n; i++) 
    { 
        result = gcd(arr[i], result); 
  
        if(result === 1) 
        { 
        return 1; 
        } 
    } 
    return result; 
} 
function promedio (camiones)
{
  const results = camiones.filter(result => {
    return (camiones.estado == 1);
  });

  var sum = 0;
  for( var i = 0; i < results.length; i++ ){
      sum += parseInt( results[i].capacidad_maxima, 10 ); //don't forget to add the base
  }
  var avg = sum/results.length;
  return avg;
}


//EXPORTS
const processData = (data, batch_time) => { //PROCESAMOS LA DATA -> agarramos 6 horas
  const pedidos = [];

  for(let d of data){
    if(d.fecha_registro > batch_time) return pedidos;
    pedidos.push(d);
  }
  return pedidos; //En caso haya finalizado toda la lista
} 

const processParciales = (pedidos, camiones, cantPedidos) => { // Generamos pedidos parciales de acuerdo a la lista de pedidos extraida.
  let newPedidos = [];
  let prom = promedio(camiones);

  console.log(prom);

  if(prom < PROM_CARG) prom = PROM_CARG;

  for(let pedido of pedidos){
    //console.log(pedido);
    if(pedido.cantidad > prom){
      //Evaluamos promedio
      while(1){
        const pedido1 = pedido;    pedido1.id_pedido = cantPedidos+1;   newPedidos.push(pedido1);//1 pedido
        const pedido2 = pedido;    pedido2.id_pedido = cantPedidos+2;   newPedidos.push(pedido2);//2 pedido

        //A toda la lista le reducimos la cantidad a la mitada
        newPedidos.forEach(p => p.cantidad = Math.trunc(pedido.cantidad/newPedidos.length)); //Se divide a la mitad de la iteracion actual
        newPedidos.at(-1).cantidad = pedido.cantidad - (newPedidos.at(-1).cantidad * newPedidos.length);  //Al ultimo se le agregan los pedidos que no fueron ingresados - MEAN number.

        cantPedidos += 2;
        if(newPedidos.at(-1).cantidad <= prom) break; //Fin cuando ya se cumple la condicion inicial
      }
      //Añadimos newPedidos con pedidos
      pedidos = pedidos.concat(newPedidos);
    }
  }
  console.log([pedidos, cantPedidos]);
  return [pedidos, cantPedidos];
  //MCD - SOLAMENTE PEDIDOS PARCIALES -> Nueva pedid        |-> ALEATORIO (2 - CAMIONES) <- MCD >  PROM(CAP_TIPO_CAMION)    |-> ALEATORIO (2- CAMIONES) > PROM (4_TIPO_CAMIONES) - MCD.
  //EL SENCILLLO -> ENTRE 2 Y SI NO ES SUFICIENTE - MÁS.    PEIDO -2 > PROM(CAP_TIPO_CAMION) -4 -> 


  //return pedidos;
}

//RECORDATORIO - EL HISTORICO SE LLENA DOS VECES 
//    |-> LOS PEDIDOS PROCESADOS -> ANTES DE LA SIMULACION Y DE PROCESAR LOS PARCIALES -> DONE ^ PAntalla ant.
//    |-> DSP DE LA SIMULACION CUANDO TENEMOS LAS RUTAS PARA PEDIDOS Y PEDISO PARCIALES. -> function addRoutes

const addRoutes = (historico, planes) => {

  //PLANES - {[[PEDIDOS_NORMALES], [PEDIDOS_PARCIALES]]} ->  CADA PLAN TIENE EL CAMION Y UN ARREGLO DE RUTAS --> CIUDADES A DONDE TIENE QUE IR CADA 
  //  PLANES TIENE PARTIDO -- DE LA CIUDAD DEL ALMACEN - HACIA LA CIUDAD1 - ES PARA EL PEDIDO1::
  // -------------------------DE LA CIUDAD1 - CIUDAD2 - CIUDAD3 - CIUDAD 4 ES PARA EL PEDIDO2:: -- TENGO QUE SUMAR ALMACEN - CIUDAD1

  //PROBLEMA: "QUE NO SEA DEL PEDIDO 1 Y LUEGO SIGUE EL PEDIDO 2 - SINO EL PEDIDO50" - Voy a tener un arreglo de pedidos con las rutas para atender el pedido.
  
  return historico;
}

const priorityPedidos = (processPedidos, missingPedidos, hora_ini) => {
  let pedidos = [...processPedidos];
  pedidos = pedidos.concat(missingPedidos);
  //SI PASA QUE (pedido.fecha_entrega_max - hora_ini) -> COLAPSA
  if(pedidos.some(e => (e.fecha_entrega_max - hora_ini) <= 0))
    return [];
  //Priorizamos los pedidos: fecha_registro
  pedidos = pedidos.sort((a,b) => a.fecha_registro - b.fecha_registro); 
  return pedidos;
}


export default {processData, processParciales, addRoutes, priorityPedidos};