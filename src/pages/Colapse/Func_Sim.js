import React from 'react';
import { PROM_CARG } from '../../constants/Sim_Params';
import ciudadService from '../../services/ciudadService';

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
  let cant_B = 0;   let cant_C = 0;
  const results = camiones.filter(camion => {
    return (camion.estado === 1);
  });
  console.log("camiones disponibles: ", results);

  var sum = 0;
  for( var i = 0; i < results.length; i++ ){
      if(results[i].tipo == 'B')  cant_B++;
      if(results[i].tipo == 'C')  cant_C++;
      sum += parseInt( results[i].capacidad_maxima, 10 ); //don't forget to add the base
  }
  var avg = sum/results.length;
  if(cant_B > 7)  avg = 40;
  if(cant_C > 10) avg = 30;
  console.log(avg);
  return avg;
}


//EXPORTS
const processData = (data, batch_time) => { //PROCESAMOS LA DATA -> agarramos 6 horas
  const pedidos = [];
  console.log(batch_time);
  for(let d of data){
    if(d.fecha_registro > batch_time) return pedidos;
    pedidos.push(d);
  }
  return pedidos; //En caso haya finalizado toda la lista
} 

const processParciales = (pedidos, camiones, cantPedidos) => { // Generamos pedidos parciales de acuerdo a la lista de pedidos extraida.
  let prom = promedio(camiones);
  let numPed = cantPedidos;

  if(prom > PROM_CARG) prom = PROM_CARG;
  prom = 30;
  for(let pedido of pedidos){
    //console.log(pedido);
    // if(pedido.cantidad > prom){
    //   let newPedidos = [];
    //   //Evaluamos promedio
    //   while(1){
    //     const pedido1 = structuredClone(pedido);    pedido1.id_pedido = numPed+1;   pedido1.id_padre=pedido.id_pedido;      newPedidos.push(pedido1);//1 pedido
    //     const pedido2 = structuredClone(pedido);    pedido2.id_pedido = numPed+2;   pedido2.id_padre=pedido.id_pedido;      newPedidos.push(pedido2);//2 pedido

    //     //A toda la lista le reducimos la cantidad a la mitada 
    //     newPedidos.forEach(p => p.cantidad = Math.trunc(pedido.cantidad/newPedidos.length)); //Se divide a la mitad de la iteracion actual
    //     newPedidos.at(-1).cantidad += pedido.cantidad - (newPedidos.at(-1).cantidad * newPedidos.length);  //Al ultimo se le agregan los pedidos que no fueron ingresados - MEAN number.

    //     numPed = numPed + 2;
    //     if(newPedidos.at(-1).cantidad <= prom){
    //       pedidos = pedidos.filter(d => {return d.id_pedido !== pedido.id_pedido;});
    //       break; //Fin cuando ya se cumple la condicion inicial
    //     } 
    //   }
    //   //Añadimos newPedidos con pedidos

    if(pedido.cantidad > prom){
      let newPedidos = [];
      let cantPedidos = pedido.cantidad;
      while(1){
        const pedido1 = structuredClone(pedido);    pedido1.id_pedido = numPed+1;   pedido1.id_padre=pedido.id_pedido;

        numPed++;
        //Le reducimos la cantidad del pedido a un MOD del promedio
        cantPedidos -= prom;
        if(cantPedidos > 0) {
          pedido1.cantidad = prom;
          newPedidos.push(pedido1);//1 pedido
        }
        else if(cantPedidos === 0 ){
          pedido1.cantidad = prom;
          newPedidos.push(pedido1);//1 pedido
          pedidos = pedidos.filter(d => {return d.id_pedido !== pedido.id_pedido;});
          break;
        }
        else{
          pedido1.cantidad = prom+cantPedidos;
          newPedidos.push(pedido1);//1 pedido
          pedidos = pedidos.filter(d => {return d.id_pedido !== pedido.id_pedido;});
          break;
        }
      }
      //Añadimos newPedidos con pedidos
      pedidos = pedidos.concat(newPedidos);
    }
  }
  console.log([pedidos, numPed]);
  return [pedidos, numPed];
  //MCD - SOLAMENTE PEDIDOS PARCIALES -> Nueva pedid        |-> ALEATORIO (2 - CAMIONES) <- MCD >  PROM(CAP_TIPO_CAMION)    |-> ALEATORIO (2- CAMIONES) > PROM (4_TIPO_CAMIONES) - MCD.
  //EL SENCILLLO -> ENTRE 2 Y SI NO ES SUFICIENTE - MÁS.    PEIDO -2 > PROM(CAP_TIPO_CAMION) -4 -> 


  //return pedidos;
}

//RECORDATORIO - EL HISTORICO SE LLENA DOS VECES 
//    |-> LOS PEDIDOS PROCESADOS -> ANTES DE LA SIMULACION Y DE PROCESAR LOS PARCIALES -> DONE ^ PAntalla ant.
//    |-> DSP DE LA SIMULACION CUANDO TENEMOS LAS RUTAS PARA PEDIDOS Y PEDISO PARCIALES. -> function addRoutes

const addRoutes = (historico, planes, ciudades) => {

  //PLANES - {[[PEDIDOS_NORMALES], [PEDIDOS_PARCIALES]]} ->  CADA PLAN TIENE EL CAMION Y UN ARREGLO DE RUTAS --> CIUDADES A DONDE TIENE QUE IR CADA 
  //  PLANES TIENE PARTIDO -- DE LA CIUDAD DEL ALMACEN - HACIA LA CIUDAD1 - ES PARA EL PEDIDO1::
  // -------------------------DE LA CIUDAD1 - CIUDAD2 - CIUDAD3 - CIUDAD 4 ES PARA EL PEDIDO2:: -- TENGO QUE SUMAR ALMACEN - CIUDAD1
  const pedido_plan = [];
  //VAMOS A ARREGLAR LAS RUTAS EN LOS PLANES QUE CORRESPONDEN
  for(let plan of planes){
    let allRoute = [];
    //plan.rutas.pop(); //Quitamos el ultimo de todos
    for(let ruta of plan.rutas){
      const newRoutes = [];
      if(ruta.pedido.id_pedido == 0)  continue;
      ruta.ruta_ciudad.forEach(r => {
        newRoutes.push(
          {
            'fecha_llegada':r.fecha_llegada,
            'id_ciudad':r.id_ciudad,
            'ciudad': ciudades[r.id_ciudad.id-1],
            'orden': r.orden,
          }
        )
      })
      //newRoutes.shift();
      allRoute = allRoute.concat(newRoutes); //Hacemos que vaya creciendo la ruta
      if(ruta.pedido.id_pedido > historico.length){
        //ES UN PEDIDO PARCIAL QUE SE DEBE AGREGAR AL ARREGLO DEL PEDIDO PRINCIPAL
        historico[ruta.pedido.id_padre-1].plan_transporte.push({
          'id_plan_transporte': plan.id_plan_transporte,
          'id_ruta': ruta.id_ruta,
          'id_hijo': ruta.pedido.id_pedido,
          'cantidad': ruta.pedido.cantidad,
          'hora_llegada': allRoute.at(-1).fecha_llegada,
          'hora_salida': allRoute[0].fecha_llegada,
          'camion': plan.camion,
          'plan_transporte': allRoute,
        });
      }
      else{
        //ES UN PEDIDO ATENDIDO COMPLETAMENTE
        historico[ruta.pedido.id_pedido-1].plan_transporte.push({
          'id_plan_transporte': plan.id_plan_transporte,
          'id_ruta': ruta.id_ruta,
          'id_hijo': 0,
          'cantidad': ruta.pedido.cantidad,
          'hora_llegada': allRoute.at(-1).fecha_llegada,
          'hora_salida': allRoute[0].fecha_llegada,
          'camion': plan.camion,
          'plan_transporte': allRoute,
        });
      }
      //LLENAMOS EL PEDIDO_PLAN --> PARA SABER CUALES SON LOS PEDIDOS ATENDIDOS
      pedido_plan.push(ruta.pedido);
    }
  }

  //PROBLEMA: "QUE NO SEA DEL PEDIDO 1 Y LUEGO SIGUE EL PEDIDO 2 - SINO EL PEDIDO50" - Voy a tener un arreglo de pedidos con las rutas para atender el pedido.
  
  return [historico, pedido_plan];
}

const priorityPedidos = (processPedidos, missingPedidos, hora_ini) => {
  console.log("PEDIDOS: ", processPedidos, "\\nMISSING: ", missingPedidos);
  let pedidos = [...processPedidos];
  //Priorizamos los pedidos: fecha_registro
  pedidos = pedidos.sort((a,b) => new Date(a.fecha_registro) - new Date(b.fecha_registro));
  let pedidos_final = [...missingPedidos]; 
  pedidos_final = pedidos_final.sort((a,b) => new Date(a.fecha_registro) - new Date(b.fecha_registro));
  pedidos_final = pedidos_final.concat(pedidos);
  //SI PASA QUE (pedido.fecha_entrega_max - hora_ini) -> COLAPSA
  for(let e of pedidos_final){
    if(new Date(e.fecha_entrega_max) <= new Date(hora_ini)){
      console.log("COLPASO EN: ", e);
      return null;
    }
  };
  return pedidos_final;
}

const llenarMissingPedidos = (pedidos_faltantes, pedidos, pedidos_plan) => {
  console.log(pedidos_plan, '->',pedidos_faltantes);
  for(let plan of pedidos_plan){
    pedidos = pedidos.filter(d => {return d.id_pedido !== plan.id_pedido;});  //FILTRAMOS LOS QUE YA SE ATENDIERON
  }
  for(let miss of pedidos_faltantes){
    if(!pedidos.some(d =>  d.id_pedido === miss.id_pedido))
      pedidos.push(miss);  //AGREGAMOS LOS QUE NO ESTÁN
    }
  return pedidos;
}


export default {processData, processParciales, addRoutes, priorityPedidos, llenarMissingPedidos};