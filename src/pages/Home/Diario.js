// import '../App.css';
import { MapContainer, TileLayer, useMap,Marker,Popup, Polyline,Tooltip} from 'react-leaflet';
import ReactLeafletDriftMarker  from "react-leaflet-drift-marker";
import { Component } from 'react';
import React,{useRef, useState, useEffect, useMemo} from 'react';
import {HORA_ITER, HORA_BATCH} from '../../constants/Sim_Params';
import algoritmoService from '../../services/algoritmoService';
import pedidoService from '../../services/pedidoService';
import camionService from '../../services/camionService';
import { color } from '@mui/system';
import { Box, Typography, Button, Grid, TextField, CircularProgress, Autocomplete } from '@mui/material';
import BallotIcon from '@mui/icons-material/Ballot';
import LZString from 'lz-string';



const Diario = React.memo(({historico, setHistorico,re, histCamiones, setHistCamiones}) => {

  const addRoutes = async (historico, planes, ciudades, movimientos) => {
    //VAMOS A AGREGAR LAS RUTAS QUE CORRESPONDENO -> INICIANDOLAS AQUI MISMO
    for(let plan of planes){
      for(let ruta of plan.rutas){
        if(ruta.pedido === null)  continue;
        if(!historico.some(ped =>  ped.pedido.id_pedido === ruta.pedido.id_pedido)){
          if(ruta.pedido.id_padre === 0){
            historico.push(
            {
              'pedido': {...ruta.pedido, cantidad: 0},
              'plan_transporte': [],
            });  //AGREGAMOS LOS QUE NO ESTÁN
          }
        }
      }
    }

    //VAMOS A ARREGLAR LAS RUTAS EN LOS PLANES QUE CORRESPONDEN
    let cant = 0;
    for(let plan of planes){
      let allRoute = [];
      //plan.rutas.pop(); //Quitamos el ultimo de todos
      for(let ruta of plan.rutas){
        cant++;
        const newRoutes = [];
        if(ruta.pedido == null)  continue;
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

          if(ruta.pedido.id_padre > 0){
            //ES UN PEDIDO PARCIAL QUE SE DEBE AGREGAR AL ARREGLO DEL PEDIDO PRINCIPAL
            if(!historico.some(ped =>  ped.pedido.id_pedido === ruta.pedido.id_padre)){
              //Debemos llamar al pedido del
              const newPed = await pedidoService.getPedido(ruta.pedido.id_padre)
                historico.push(
                {
                  'pedido': {...newPed, cantidad: 0},
                  'plan_transporte': [],
                });  //AGREGAMOS LOS QUE NO ESTÁN
            }
            const index = historico.findIndex(ped => ped.pedido.id_pedido === ruta.pedido.id_padre);
            historico[index].plan_transporte.push({
              'id_plan_transporte': plan.id_plan_transporte,
              'id_ruta': ruta.id_ruta,
              'id_hijo': ruta.pedido.id_pedido,
              'cantidad': ruta.pedido.cantidad,
              'hora_llegada': allRoute.at(-1).fecha_llegada,
              'hora_salida': allRoute[0].fecha_llegada,
              'camion': plan.camion,
              'plan_transporte': allRoute,
            });
            //Ahora cambiamos el estado del pedido
            const camion_alm = await movimientos.find(camion => camion.id_camion === plan.camion.id);
            const almacen = await ciudades[camion_alm.ruta_ciudad[0].id_ciudad.id-1];
            historico[index].pedido.cantidad += ruta.pedido.cantidad;
            historico[index].pedido.almacen = almacen;
          }
        else{
          if(!historico.some(ped =>  ped.pedido.id_pedido === ruta.pedido.id_pedido)){
            historico.push(
            {
              'pedido': {...ruta.pedido, cantidad: 0},
              'plan_transporte': [],
            });  //AGREGAMOS LOS QUE NO ESTÁN
          }
          const index = historico.findIndex(ped => ped.pedido.id_pedido === ruta.pedido.id_pedido);
          //ES UN PEDIDO ATENDIDO COMPLETAMENTE
          historico[index].plan_transporte.push({
            'id_plan_transporte': plan.id_plan_transporte,
            'id_ruta': ruta.id_ruta,
            'id_hijo': 0,
            'cantidad': ruta.pedido.cantidad,
            'hora_llegada': allRoute.at(-1).fecha_llegada,
            'hora_salida': allRoute[0].fecha_llegada,
            'camion': plan.camion,
            'plan_transporte': allRoute,
          });
          //Ahora cambiamos el estado del pedido
          const camion_alm = await movimientos.find(camion => camion.id_camion === plan.camion.id);
          const almacen = await ciudades[camion_alm.ruta_ciudad[0].id_ciudad.id-1];
          historico[index].plan_transporte.at(-1).plan_transporte = await historico[index].plan_transporte.at(-1).plan_transporte.sort((a,b) => new Date(a.orden) - new Date(b.orden));
          historico[index].pedido.cantidad += ruta.pedido.cantidad;
          historico[index].pedido.almacen = almacen;
        }
      }


    }

    //PROBLEMA: "QUE NO SEA DEL PEDIDO 1 Y LUEGO SIGUE EL PEDIDO 2 - SINO EL PEDIDO50" - Voy a tener un arreglo de pedidos con las rutas para atender el pedido.
    
    return historico;
  }
  const addCamiones = async (historico, planes, ciudades, movimientos) => {
    const camiones = await camionService.getCamiones();
    console.log(camiones);
    //VAMOS A AGREGAR LAS RUTAS QUE CORRESPONDENO -> INICIANDOLAS AQUI MISMO
    for(let camion of camiones){
      if(!historico.some(cam =>  cam.camion.id === camion.id)){
        historico.push(
        {
          'camion': {...camion, estado:camion.estado === 0 ? 1 : camion.estado },
          'plan_transporte': [],
        });  //AGREGAMOS LOS QUE NO ESTÁN
      }
      else{
        break;//Se asume que todo están ingresados -- a la primera
      }
    }
    console.log(historico);
    for(let plan of planes){
      let allRoute = [];  //Este acumulara las rutas totales -- pero para el cmaion y no para el pedido que se va sumando
      //plan.rutas.pop(); //Quitamos el ultimo de todos
      for(let ruta of plan.rutas){
        const newRoutes = [];
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
        allRoute = newRoutes; //Hacemos que vaya creciendo la ruta -- Este en resume

        //Agregamos el pedido en el item -> plan_transporte para separarlo por pedido como tal
        let index = await historico.findIndex(camion => camion.camion.id === plan.camion.id);
        //Buscamos el pedido padre
        if(ruta.pedido == null){
          historico[index].plan_transporte.push({
          'id_plan_transporte': plan.id_plan_transporte,
          'id_ruta': ruta.id_ruta,
          'cantidad': 0,
          'hora_llegada': allRoute.at(-1).fecha_llegada,
          'hora_salida': allRoute[0].fecha_llegada,
          'pedido': null,
          'pedido_padre': null,
          'plan_transporte': allRoute,
          });
        }  
        else{
          const pedPadre = await ruta.pedido.id_padre > 0 ? await pedidoService.getPedido(ruta.pedido.id_padre) : null;
          //ES UN PEDIDO ATENDIDO COMPLETAMENTE
          historico[index].plan_transporte.push({
            'id_plan_transporte': plan.id_plan_transporte,
            'id_ruta': ruta.id_ruta,
            'cantidad': ruta.pedido.cantidad,
            'hora_llegada': allRoute.at(-1).fecha_llegada,
            'hora_salida': allRoute[0].fecha_llegada,
            'pedido': ruta.pedido,
            'pedido_padre': pedPadre,
            'plan_transporte': allRoute,
          });
        }
        historico[index].plan_transporte.at(-1).plan_transporte = await historico[index].plan_transporte.at(-1).plan_transporte.sort((a,b) => new Date(a.orden) - new Date(b.orden));
        historico[index].camion.num_paquetes += ruta.pedido ? ruta.pedido.cantidad : 0;
        historico[index].camion.estado = 0;
      }
    }
    
    return historico;
  }

  //const position1 = [-9.880358501459673, -74.46566630628085];
  const position1 = [-12.045957676769577, -77.0305492374421];
  const position2 = [-12.045957676769577, -77.0305492374421];
  //const zoom1 = 6;
  const zoom1 = 16;
  const zoom2 = 17;
  const limeOptions = { color: 'red' ,weight:1,opacity:1};
  const TramosColor = { color: 'black' ,weight:2,opacity:1};
  // Primero es el origen y luego el destino 

  const [flagOut,setFlagOut] = useState(null);

  const L = require('leaflet');

  const myIcon = L.icon({
      iconUrl:  require('../../archives/circle-16.png'),
      iconSize: [14, 14],
      iconAnchor: [10, 10],
      popupAnchor: [2, -40]
  });
  
  const myIcon2 = L.icon({
    iconUrl:  require('../../archives/green-circle-16.png'),
    iconSize: [14, 14],
    iconAnchor: [10, 10],
    popupAnchor: [2, -40]
});
  
const myIcon3 = L.icon({
  iconUrl:  require('../../archives/blue-circle-16.png'),
  iconSize: [14, 14],
  iconAnchor: [10, 10],
  popupAnchor: [2, -40]
});

const myIconSeleccionado = L.icon({
  iconUrl:  require('../../archives/orange-circle-16.png'),
  iconSize: [18, 18],
  iconAnchor: [9, 10],
  popupAnchor: [2, -40]
});


  const IconMantenimiento = L.icon({
    iconUrl:  require('../../archives/red-circle-32.png'),
    iconSize: [18, 18],
    iconAnchor: [9, 10],
    popupAnchor: [2, -40]
 });

  const myOficina = L.icon({
    iconUrl:  require('../../archives/oficina2.png'),
    iconSize: [16, 16],
    iconAnchor: [9, 10],
    popupAnchor: [2, -40]
  });

  const myAlmacen = L.icon({
    iconUrl:  require('../../archives/almacen2.png'),
    iconSize: [24, 24],
    iconAnchor: [9, 10],
    popupAnchor: [2, -40]
  });
  
  var Mapita = [];
  // useEffect(() => {
  //   console.log("no re-renders");
  //   if(flagOut !== null){
  //           //Ahora si llego mi momento
  //     setSegundosFin(flagOut.segundos);
  //     setMinutosFin(flagOut.minutos);
  //     setFechaFin(flagOut.guardado);
  //     setHistorico(flagOut.historico);
  //     setOpenResume(true);
  //   }
  // }, [flagOut])
  // const top100Films = [
  //   { label: 'The Godfather', id: 1 },
  //   { label: 'Pulp Fiction', id: 2 },
  // ];
  class Diario extends Component{
    constructor(props){
      super(props);
      this.llenarMovimientosInicial = this.llenarMovimientosInicial.bind(this);
      // this.ObtenerRutas = this.ObtenerRutas.bind(this);
      this.CargarData = this.CargarData.bind(this);
      this.forzarPedidos = this.forzarPedidos.bind(this);
      // this.currentTime = this.currentTime.bind(this);
      // this.funcionCiclica = this.funcionCiclica.bind(this);
      // this.sleep = this.sleep.bind(this);
    }
    state = {
      latlng: [-12.13166084108361, -76.98237622750722],
      latlng2: [-12.13166084108361, -76.98237622750722],
      latlng3: [-12.13166084108361, -76.98237622750722],
      Marker1:"",
      ciudades:[],
      tramos:[],
      camiones:[],
      aux : [],
      camionesRefs:[],
      idxCamiones : 0,
      referencias:[],
      creados:0,
      rutas:null,
      flagfinish: false,
      moviXCamion:[],
      mantXCamion:[],
      faltantes:[],
      cami:"",
      tiempo: "",
      // guardado: new Date(fechaActual.getTime()+6*1000*60*60),
      mostrarTramos:true,
      segundos:0,
      minutos:0,
      estadosCamion:[],
      idTiempos:"",
      idObtenerRutas:"",
      terminoSimulacion:false,
      arrMantenimientos:[],
      opciones:{position:position1,zoom:zoom1},
      labelCamiones:[],
      anterior:[]
    };



   forzarPedidos(){
    var xd = {position:position2,zoom:zoom2}
    this.setState({opciones:xd});
    fetch('http://inf226g8.inf.pucp.edu.pe:8000/forzar/diario')
    .then(() => 
      {
      console.log("Se forzo los pedidos");
      //console.log(data);
      var aux = new Date();
      aux.setHours(aux.getHours() - 5);
      var ahora = aux.toISOString().replace(/T/, ' ').replace(/\..+/, '');
      fetch('http://inf226g8.inf.pucp.edu.pe:8000/diario/cargarMapa/'+ahora)
          .then(response => response.json())
          .then(data => 
            {
            console.log(data);
            this.setState({rutas:data});
            this.llenarMovimientos(data.movimientos);
            //console.log(this.state.moviXCamion);
          });
    });
   }
  componentDidUpdate (prevProps,prevState) {
    if (this.state.rutas !== prevState.rutas) {
      console.log(this.state.rutas);
      addRoutes (historico, this.state.rutas.planes, this.state.ciudades, this.state.rutas.movimientos)
      .then(auxhistorico => 
        {
          console.log(auxhistorico);
          setHistorico(auxhistorico);
        }
      );
      //AHORA HAREMOS LA FUNCIONALIDAD PARA LOS CAMIONES
      addCamiones (histCamiones, this.state.rutas.planes, this.state.ciudades, this.state.rutas.movimientos)
      .then(auxcamiones => 
        {
          console.log(auxcamiones);
          setHistCamiones(auxcamiones);
        }
      );
    }
    if(this.state.arrMantenimientos !== prevState.arrMantenimientos){
      //vamos a hallar los camiones en curso y en mantenimiento
      if(histCamiones !== null){
        const auxcamiones = histCamiones;
        if(histCamiones.length > 0){
          this.state.camiones.forEach(camion => {
            if(camion.estado === 2)
              auxcamiones[camion.id-1].camion.estado = 2;
            else
              auxcamiones[camion.id-1].camion.estado = camion.estado;
          })
          setHistCamiones(auxcamiones);
        }
      }
    }
  }
  
   CargarData(){
    //CARGAR CUANDO INICIA EL MAPA POR PRIMERA VEZ

    let datos = JSON.parse(LZString.decompress(window.localStorage.getItem("ciudades")))
    console.log(datos);
    this.setState({ciudades:datos}) 
    datos = JSON.parse(LZString.decompress(window.localStorage.getItem("tramos")))
    console.log(datos);
    this.setState({tramos:datos});
    //Crear Diccionario Global de tramos
    var ini,fin;
    for(let i =0;i<datos.length;i++){
     ini = datos[i].ciudad_destino.id;
     fin = datos[i].ciudad_origen.id;
     var cadena = ini + "+" + fin;
    Mapita[cadena] = datos[i].id_tramo;
   }
   //console.log(Mapita);
    fetch('http://inf226g8.inf.pucp.edu.pe:8000/camion/listar')
    .then(response => response.json())
    .then(dat => 
      {
        var guardar = dat;
        console.log(guardar);
        const data = JSON.parse(LZString.decompress(window.localStorage.getItem("mantenimientos")))
        if(this.state.mantXCamion.length==0) { //Primera vez que se genera los movimientos
          this.state.mantXCamion= Array(dat.length);
          for(let i =0;i<dat.length;i++){
            this.state.mantXCamion[i] = [];
          }
        }
        for(let i =0;i<data.length;i++){
          this.state.mantXCamion[data[i].id_camion.id-1].push({
            fecha:data[i].fecha
          });
        }

        //console.log("Los mantenimientos son: ")
        //console.log( this.state.mantXCamion);
        var aux = new Date();
        aux.setHours(aux.getHours() - 5);
        var ahora = aux.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let blq = 0;
        console.log(ahora); 
        fetch('http://inf226g8.inf.pucp.edu.pe:8000/bloqueo/listarDiario/' + ahora)
            .then(response => response.json())
            .then(data => 
              {
                //console.log("Los bloqueos son: ")
                //console.log(data);
                var auxi = JSON.parse(JSON.stringify(this.state.tramos));
                for(let i = 0;i<auxi.length;i++){
                  auxi[i].bloqueado = 0;
                }
                for(let i = 0;i<data.length;i++){
                  auxi[(data[i].id_tramo.id_tramo)-1].bloqueado = 1;
                  blq++;
                }

                this.setState({tramos:auxi});
                // for(let i = 0;i<guardar.length;i++){
                //   // dat[i].lat = dat[i].almacen.latitud;
                //   // dat[i].log = dat[i].almacen.longitud;
                //   // dat[i].tiempo = 10;  
                //   this.funcionCiclica(i);
                // }
                // console.log(guardar);
                //this.setState({camiones:guardar});
                console.log(this.state.camiones);
                var aux = new Date();
                aux.setHours(aux.getHours() - 5);
                var ahora = aux.toISOString().replace(/T/, ' ').replace(/\..+/, '');
                //console.log(ahora); 
                fetch('http://inf226g8.inf.pucp.edu.pe:8000/diario/cargarMapa/'+ahora)
                .then(response => response.json())
                .then(data => 
                  {
                  console.log(data);
                 this.setState({rutas:data});
                  this.llenarMovimientosInicial(data.movimientos,guardar);
                  console.log(this.state.moviXCamion);
                });
              }
        );
    }
    );
  }
  // toRadians (degrees){
  //   if (degrees < 0) {
  //     degrees += 360;/*from w  w  w .  java2 s.c o m*/
  //   }
  //   return degrees / 180 * Math.PI;
  // }

  //   toDegrees(radians)
  //   {
  //     var pi = Math.PI;
  //     return radians * (180/pi);
  //   }


  // hallarPunto(a,b){
  //   var startLatMicroDeg = this.state.ciudades[a.id_ciudad.id-1].latitud;
  //   var startLonMicroDeg = this.state.ciudades[a.id_ciudad.id-1].longitud; 
  //   var endLatMicroDeg = this.state.ciudades[b.id_ciudad.id-1].latitud;
  //   var endLonMicroDeg =this.state.ciudades[b.id_ciudad.id-1].longitud;
  //   //console.log(a);
  //   //console.log(b);
  //   var ahora = new Date();
  //   var despues = new Date(b.fecha_llegada);
  //   var t = ahora.getTime()/despues.getTime(); // How much of the distance to use, from 0 through 1
  //   var alatRad=this.toRadians(startLatMicroDeg/1000000);
  //   var alonRad=this.toRadians(startLonMicroDeg/1000000);
  //   var blatRad=this.toRadians(endLatMicroDeg/1000000);
  //   var blonRad=this.toRadians(endLonMicroDeg/1000000);
  //   // Calculate distance in longitude
  //   var dlon=blonRad-alonRad;
  //   // Calculate common variables
  //   var alatRadSin=Math.sin(alatRad);
  //   var blatRadSin=Math.sin(blatRad);
  //   var alatRadCos=Math.cos(alatRad);
  //   var blatRadCos=Math.cos(blatRad);
  //   var dlonCos=Math.cos(dlon);
  //   // Find distance from A to B
  //   var distance=Math.acos(alatRadSin*blatRadSin +
  //                             alatRadCos*blatRadCos *
  //                             dlonCos);
  //   // Find bearing from A to B
  //   var bearing=Math.atan2(
  //       Math.sin(dlon) * blatRadCos,
  //       alatRadCos*blatRadSin -
  //       alatRadSin*blatRadCos*dlonCos);
  //   // Find new point
  //   var angularDistance=distance*t;
  //   var angDistSin=Math.sin(angularDistance);
  //   var angDistCos=Math.cos(angularDistance);
  //   var xlatRad = Math.asin( alatRadSin*angDistCos +
  //                               alatRadCos*angDistSin*Math.cos(bearing) );
  //   var xlonRad = alonRad + Math.atan2(
  //       Math.sin(bearing)*angDistSin*alatRadCos,
  //       angDistCos-alatRadSin*Math.sin(xlatRad));
  //   // Convert radians to microdegrees
  //   var xlat=this.toDegrees(xlatRad)*1000000;
  //   var xlon=this.toDegrees(xlonRad)*1000000;
  //   if(xlat>90000000)xlat=90000000;
  //   if(xlat<-90000000)xlat=-90000000;
  //   while(xlon>180000000)xlon-=360000000;
  //   while(xlon<=-180000000)xlon+=360000000;
  //   return {lat:xlat,log:xlon};
  // }
  llenarMovimientos(movi){
    if(movi!=null){
      let inicial,final;
      for(let i =0;i<movi.length;i++){
        if(this.state.moviXCamion[movi[i].id_camion-1].length!=0){
          console.log("Inconsistencia, no modificar");
          continue;
        }
        inicial =  new Date(movi[i].ruta_ciudad[0].fecha_llegada);
          for(let j=1;j<movi[i].ruta_ciudad.length;j++){
            final =  new Date(movi[i].ruta_ciudad[j].fecha_llegada);
            var diff = (final.getTime() - inicial.getTime());
            this.state.moviXCamion[(movi[i].id_camion)-1].push({
              idCiudad: movi[i].ruta_ciudad[j].id_ciudad.id,
              tiempo: diff,
              inicial:movi[i].ruta_ciudad[0].fecha_llegada,
              ant:movi[i].ruta_ciudad[j-1].id_ciudad.id
          });
          inicial = final;
        }
      }
    }
  }


  llenarMovimientosInicial(movi,camiones){
    
    if(movi!=null){
      if(this.state.moviXCamion.length==0) { //Primera vez que se genera los movimientos
          this.state.moviXCamion= Array(camiones.length);
          for(let i =0;i<camiones.length;i++){
            this.state.moviXCamion[i] = [];
          }
      }
      let inicial,final;
      let idx;
      var otro = JSON.parse(JSON.stringify(camiones));
      for(let i =0;i<movi.length;i++){
        // if(i==0){
        //   var xd = {position:position1,zoom:zoom1}
        //   this.setState({opciones:xd});
        //   var map = document.getElementById("idMapita").center;
        //   // // console.log(document.getElementById("idMapita").center);
        //   // this.state.opciones.position = position2;
        //   //map.setView(new L.LatLng(40.737, -73.923), 8);
        // }
          for(let k = 0;k<movi[i].ruta_ciudad.length;k++){
            let fecha = new Date(movi[i].ruta_ciudad[k].fecha_llegada);
            if( fecha >= Date.now()){
              inicial =  fecha;
              idx = k;
              //DOS CASOS 
                //Si k = 0 , entonces aun falta para partir
                //No agregar nada mover normal
                // Si k!=0, debe ester en mita de ejecucion
                //Movernos a mitad de trayecto
                if(k!=0){
                  // -10.07490562230709, -74.1204059187355
                    //let valores = this.hallarPunto(movi[i].ruta_ciudad[k-1],movi[i].ruta_ciudad[k]);
                    otro[(movi[i].id_camion)-1].lat = this.state.ciudades[movi[i].ruta_ciudad[k-1].id_ciudad.id-1].latitud;
                    otro[(movi[i].id_camion)-1].log = this.state.ciudades[movi[i].ruta_ciudad[k-1].id_ciudad.id-1].longitud;
                    otro[(movi[i].id_camion)-1].tiempo = 100;
                    otro[(movi[i].id_camion)-1].listo = 1;
                    // this.state.camiones[(movi[i].id_camion)-1] = otro[(movi[i].id_camion)-1];
                    var ahora = new Date();
                    var ultimo = new Date(movi[i].ruta_ciudad[k].fecha_llegada);
                    var diff = (ultimo.getTime()-ahora.getTime());
                    ///////
                  //   this.state.moviXCamion[(movi[i].id_camion)-1].push({
                  //     idCiudad: movi[i].ruta_ciudad[k-1].id_ciudad.id,
                  //     tiempo: 10,
                  //     inicial:movi[i].ruta_ciudad[0].fecha_llegada,
                  //     ant:movi[i].ruta_ciudad[k-1].id_ciudad.id
                  // });
                    ///////////////
                    this.state.moviXCamion[(movi[i].id_camion)-1].push({
                      idCiudad: movi[i].ruta_ciudad[k].id_ciudad.id,
                      tiempo: diff,
                      inicial:movi[i].ruta_ciudad[0].fecha_llegada,
                      ant:movi[i].ruta_ciudad[k-1].id_ciudad.id
                  });
                  break;
                }
            }   
          }

          var aaa = new Date(movi[i].ruta_ciudad[idx].fecha_llegada); 
          for(let j=idx+1;j<movi[i].ruta_ciudad.length;j++){
            final =  new Date(movi[i].ruta_ciudad[j].fecha_llegada);
            var diff = (final.getTime() - aaa.getTime());
            this.state.moviXCamion[(movi[i].id_camion)-1].push({
              idCiudad: movi[i].ruta_ciudad[j].id_ciudad.id,
              tiempo: diff,
              inicial:movi[i].ruta_ciudad[0].fecha_llegada,
              ant:movi[i].ruta_ciudad[j-1].id_ciudad.id
          });
          inicial  = final;
        }
      }
      //console.log("Aqui llenamos los iniciales de los camiones");
      //console.log(otro);
      for(let i = 0;i<otro.length;i++){
        if(otro[i].listo == 1 ) continue;
        else{
          otro[i].lat = otro[i].almacen.latitud;
          otro[i].log = otro[i].almacen.longitud;
          otro[i].tiempo = 10;  
        }
      }
      this.setState({camiones:otro});
      var bbb=[];
      for(let z = 0;z<this.state.camiones.length;z++){
        bbb.push({
         label:"Camion "+(z+1).toString(),
         id:z
        });
      }
      this.setState({labelCamiones:bbb});
      console.log(this.state.labelCamiones);
      //console.log(this.state.moviXCamion);
      movi = null;
      for(let i=0;i<this.state.moviXCamion.length;i++){
        this.funcionCiclica(i);   //Movemos todos los camiones
      }
      //Cargar funcion que se levante en cada hora del dia
      var ahora = new Date();
      var fechaDeLanzamiento = ahora;
      fechaDeLanzamiento =  new Date(fechaDeLanzamiento.getTime()+ 60*60*1000);
      fechaDeLanzamiento.setSeconds(0);
      fechaDeLanzamiento.setMinutes(0);
      console.log("La fecha en la que se mandara el API es : ");
      console.log(fechaDeLanzamiento);
      var tiempo = fechaDeLanzamiento.getTime()-ahora.getTime();

      setTimeout(() => {
        this.obtenerRutas();
      }, tiempo);

      setTimeout(() => {
        var a = 60*60*1000;
        setInterval(() => {
          this.obtenerRutas();
        }, a);
      }, tiempo);
    }
  }

  async obtenerRutas(){
    console.log("Se llama al API cada hora: "); 
    var aux = new Date();
    aux.setHours(aux.getHours() - 5);
    var ahora = aux.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    console.log(ahora);
    let blq = 0;
    fetch('http://inf226g8.inf.pucp.edu.pe:8000/diario/cargarMapa/'+ahora)
      .then(response => response.json())
      .then(data => 
        {
        console.log(data);
        this.llenarMovimientos(data.movimientos);
        console.log(this.state.moviXCamion);
        fetch('http://inf226g8.inf.pucp.edu.pe:8000/bloqueo/listarFront/' + ahora)
          .then(response => response.json())
          .then(data => 
            {
              //console.log(data);
              var auxi = JSON.parse(JSON.stringify(this.state.tramos));
              for(let i = 0;i<auxi.length;i++){
                if(auxi[i].bloqueado!=2) auxi[i].bloqueado = 0;
              }
              for(let i = 0;i<data.length;i++){
                if(auxi[(data[i].id_tramo.id_tramo)-1].bloqueado!=2) auxi[(data[i].id_tramo.id_tramo)-1].bloqueado = 1;
                 blq++;
                }
                this.setState({tramos:auxi});
              }
              );

          });
  }


  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async funcionCiclica(idx){
   //Revisar movimientos individuales
   //var aux = this.state.camiones;
   var otro = JSON.parse(JSON.stringify(this.state.camiones));
   //console.log(this.state.camiones);
   //console.log(this.state.moviXCamion);
   if(this.state.moviXCamion.length!=0){
      if(this.state.moviXCamion[idx].length!=0){
         //console.log(this.state.moviXCamion[idx]);
         var inicio = new Date(this.state.moviXCamion[idx][0].inicial);
         while(Date.now()<=inicio){ //Esperar que sea la hora correcta
           await this.sleep(1000);
         }
         //otro[idx].estado = 0;
         //this.setState({estadosCamion:otro});
         var anterior = "";
         for (let i =0;i<this.state.moviXCamion[idx].length;i++){
          var nuevaCiudad = this.state.moviXCamion[idx][i];
          //Verificamos si nosotros hacemos el lag
          //console.log(nuevaCiudad);
          //  console.log("Soy el : " + idx); 
          //  console.log("Me estoy moviendo a ");
          //  console.log(otro[idx].lat);
          //  console.log(otro[idx].log);
          // console.log(otro[idx].tiempo);
          //this.state.camiones[idx] = otro[idx];
          //El tramo es 
          //console.log("El tramo donde me muevo es");
          var cadena = (nuevaCiudad.ant).toString() + "+" + (nuevaCiudad.idCiudad).toString();
          // console.log(cadena);
          // console.log(Mapita[cadena]);
          if(i==0){
            var auxi = JSON.parse(JSON.stringify(this.state.tramos));
            auxi[Mapita[cadena]-1].bloqueado = 2;
            const y = [
              ...this.state.tramos.slice(0,Mapita[cadena]-1),
              auxi[Mapita[cadena]-1],   
              ...this.state.tramos.slice(Mapita[cadena]-1+1,this.state.tramos.length)
            ]
            this.setState({tramos:y});
            anterior = Mapita[cadena]-1;
          }
          else{
           //Quitar antiguo
           var auxi = JSON.parse(JSON.stringify(this.state.tramos));
            auxi[anterior].bloqueado = 0;
            var z = [
              ...this.state.tramos.slice(0,anterior),
              auxi[anterior],   
              ...this.state.tramos.slice(anterior+1,this.state.tramos.length)
            ]
            this.setState({tramos:z});
            anterior = Mapita[cadena]-1;
            //////////Nuevo 
            var auxi = JSON.parse(JSON.stringify(this.state.tramos));
            auxi[Mapita[cadena]-1].bloqueado = 2;
            var y = [
              ...this.state.tramos.slice(0,Mapita[cadena]-1),
              auxi[Mapita[cadena]-1],   
              ...this.state.tramos.slice(Mapita[cadena]-1+1,this.state.tramos.length)
            ]
            this.setState({tramos:y});
          }

          //if(i==0) await this.sleep(6000);
          otro[idx].tiempo = nuevaCiudad.tiempo;
          otro[idx].lat = this.state.ciudades[nuevaCiudad.idCiudad-1].latitud;
          otro[idx].log = this.state.ciudades[nuevaCiudad.idCiudad-1].longitud;
          const x = [
           ...this.state.camiones.slice(0,idx),
           otro[idx],   
           ...this.state.camiones.slice(idx+1,this.state.camiones.length)
          ]
          this.setState({camiones:x});
          await this.sleep(nuevaCiudad.tiempo);
         }
         //console.log("Termine con el camion " + idx + "a las: " + this.state.guardado);
         this.state.moviXCamion[idx] = [];
         //this.state.camiones[idx].estado = 1;
      }
    }
   //Revisar mantenimiento
   //console.log(this.state.mantXCamion[idx]);
   //await this.sleep(10000);
  if(this.state.camiones.length!=0){
      for(let i = 0;i<this.state.mantXCamion[idx].length;i++){
        //Queremos obtener las 00 de ese dia
        var inicio = new Date(this.state.mantXCamion[idx][i].fecha);
        inicio.setHours(0);
        inicio.setMinutes(0);
        var final = new Date(this.state.mantXCamion[idx][i].fecha);
        final.setHours(23);
        final.setMinutes(59);
        var ahora = new Date();
        if(ahora>=inicio && ahora<=final){
          var espera  = final.getTime() - ahora.getTime();
          //this.state.camiones[idx].estado = 2;
          console.log("Estoy en mantenimiento: " + idx);

          //Arreglar setstate
          var auxi = JSON.parse(JSON.stringify(this.state.camiones));
          auxi[idx].estado = 2;
          var x = [
            ...this.state.camiones.slice(0,idx),
            auxi[idx],   
            ...this.state.camiones.slice(idx+1,this.state.camiones.length)
           ];
          this.setState({camiones:x});
          var ccc = JSON.parse(JSON.stringify(this.state.arrMantenimientos));
          ccc.push({id:idx});
          this.setState({arrMantenimientos:ccc});
          console.log("Los mantenimiento cargados son: ")
          console.log(this.state.arrMantenimientos);
          await this.sleep(espera/(1000*60*60)*10000);
          //Bajarnos el idx del arrMantenimientos
          var ccc = JSON.parse(JSON.stringify(this.state.arrMantenimientos));
          for(let j = 0;j<ccc.length;j++){
            if(ccc[j].id==idx){
              const index = ccc.indexOf(j);
              if (index > -1) { // only splice array when item is found
                ccc.splice(index, 1); // 2nd parameter means remove one item only
              }
              break;
            }
          }
          this.setState({arrMantenimientos:ccc});
          auxi[idx].estado = 1;
          var x = [
            ...this.state.camiones.slice(0,idx),
            auxi[idx],   
            ...this.state.camiones.slice(idx+1,this.state.camiones.length)
           ];
          this.setState({camiones:x})
        }
      }
   }
   //Lanzar misma funcion dentro de 2 seg
    setTimeout(() => {
      this.funcionCiclica(idx);
    }, 2000);
  }

  // currentTime(){
  //   this.state.guardado.setMinutes(this.state.guardado.getMinutes() + 6); 
  //   var diferencia = new Date(this.state.guardado.getTime() -5* 60 * 60 * 1000); //Diferencia de zona horaria
  //   var ahora = diferencia.toISOString().replace(/T/, ' ').replace(/\..+/, '');
  //   this.setState({tiempo:ahora});
  //   if(this.state.segundos==59){
  //     this.state.segundos = 0;
  //     this.state.minutos+=1;
  //   }
  //   else this.state.segundos+=1;
  // }

  componentDidMount(){
    this.CargarData();
  }
  


  camionSeleccionado(camion){
    var existeAnterior = false;
    var aux;
    if(this.state.anterior.length!=0){
      console.log(this.state.anterior);
      var ss = this.state.anterior[0];
      aux = JSON.parse(JSON.stringify(this.state.camiones));
      aux[ss.id].estado = ss.estadoAntiguo;
      var x = [
        ...this.state.camiones.slice(0,ss.id),
        aux[ss.id],   
        ...this.state.camiones.slice(ss.id+1,this.state.camiones.length)
       ];
      this.setState({camiones:x});
      this.setState({anterior:[]});
      existeAnterior = true;
     //  this.setState({anterior:camion}); 
    }
   if(camion==null){}
   else if(existeAnterior==true){
    // if(existeAnterior==true) var au = aux;
    //    else var au = JSON.parse(JSON.stringify(this.state.camiones));
    var estado = this.state.camiones[camion.id].estado;
    this.state.camiones[camion.id].estado = 4;
    // var z = [
    //   ...this.state.camiones.slice(0,camion.id),
    //   au[camion.id],   
    //   ...this.state.camiones.slice(camion.id+1,this.state.camiones.length)
    //  ];
    // this.setState({camiones:z});
    camion.estadoAntiguo = estado;
    var sd = [];
    sd.push(camion);
    this.setState({anterior:sd});
   }
   else{
    if(existeAnterior==true) var au = aux;
       else var au = JSON.parse(JSON.stringify(this.state.camiones));
    var estado = this.state.camiones[camion.id].estado;
    au[camion.id].estado = 4;
    var z = [
      ...this.state.camiones.slice(0,camion.id),
      au[camion.id],   
      ...this.state.camiones.slice(camion.id+1,this.state.camiones.length)
     ];
    this.setState({camiones:z});
    camion.estadoAntiguo = estado;
    var sd = [];
    sd.push(camion);
    this.setState({anterior:sd});
   }
  }
  render(){
    return (
      // <MapContainer center={this.state.opciones.position} zoom={this.state.opciones.zoom} scrollWheelZoom={true} id="idMapita">
      <MapContainer
     key={JSON.stringify(this.state.opciones)}
     center={this.state.opciones.position}
     zoom={this.state.opciones.zoom} scrollWheelZoom={true} id="idMapita">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* <div style={{position:'relative',zIndex:9999,float:'right'}}>
          <p style={{color:"black",fontSize:"24px"}}>
            {this.state.tiempo}
            <p style={{color:"black",fontSize:"20px"}}>
              Tiempo de ejecución: {this.state.minutos}m : {this.state.segundos}s
            </p>
          </p>
  
        </div> */}
  
        <div style={{position:'relative',zIndex:9999,float:'right',marginTop:'10px',marginRight:'15px'}}>
          <Button variant = "contained" color = "primary" size = "small" type = "submit" fullWidth onClick={()=>this.forzarPedidos()}>
            <Grid container alignItems = "right">
              <Grid item xs = {4} sm = {4} align = "left" marginTop = "0rem">
                <BallotIcon color = "secondary_white" sx = {{paddingLeft: "0rem", 'vertical-align':'-1rem'}} />
              </Grid>
              <Grid item xs = {8} sm = {8} align = "left" marginTop = "0rem">
              <Typography variant = "button_min" color = "secondary_white.main" > 
                  Lanzar Pedidos 
              </Typography>
              </Grid>
            </Grid> 
          </Button>
        </div>
        { this.state.labelCamiones.length!=0 ? 
        (<div style={{position:'relative',zIndex:9999,float:'right',marginTop:'10px',marginRight:'15px'}}>
          <Autocomplete  style={{backgroundColor:"inherit"}} 
              id="combo-box-demo"
              options={this.state.labelCamiones}
              sx={{ width: 200 }} 
              onChange={(event,newValue) => {
                console.log(newValue);
                this.camionSeleccionado(newValue);
              }}      
              renderInput={({ inputProps, ...rest }) =>    <TextField
              {...rest}
              inputProps={{ ...inputProps, readOnly: true }} label="Camiones"/>}
            />
        </div>):(<></>)
        }
        {(
          this.state.ciudades?.map((ciudad)=>(
              ciudad.tipo==1 ? (
              <Marker position={[ciudad.latitud,ciudad.longitud]} icon={myOficina}>
                <Tooltip>
                  {ciudad.ciudad} 
                  <br />
                  {'Id:' + ciudad.id}
                </Tooltip>
                </Marker>):
              (<Marker position={[ciudad.latitud,ciudad.longitud]} icon={myAlmacen} >
                <Tooltip>
                  {ciudad.ciudad}
                  <br />
                  {'Id:' + ciudad.id}
                </Tooltip>
                </Marker>)
          ))
        )
        }
  
      {(
          this.state.tramos ?.map((tramo)=>(
            tramo.bloqueado == 1 && this.state.mostrarTramos == true ? (
            <Polyline pathOptions={limeOptions} positions={[[tramo.ciudad_origen.latitud,tramo.ciudad_origen.longitud]
              ,[tramo.ciudad_destino.latitud,tramo.ciudad_destino.longitud]]}/> ):(
              tramo.bloqueado == 2 && this.state.mostrarTramos == true ?   
              (
              <Polyline pathOptions={TramosColor} positions={[[tramo.ciudad_origen.latitud,tramo.ciudad_origen.longitud]
              ,[tramo.ciudad_destino.latitud,tramo.ciudad_destino.longitud]]}/> ):(<></>) 
              
              )
          ))
        )
        }
  
      {
        (
          this.state.camiones?.map((camion)=>(
            camion.estado == 4 ? (
              <ReactLeafletDriftMarker  icon={myIconSeleccionado}
                  position={[camion.lat,camion.log]}
                  duration={camion.tiempo}
                  keepAtCenter={false}>
                  <Tooltip>
                    {"Id: " + camion.id}
                    <br></br>
                    {"Placa: " + camion.placa}
                  </Tooltip>
                  </ReactLeafletDriftMarker>)
            :(camion.estado == 2 ? (
            <ReactLeafletDriftMarker  icon={IconMantenimiento}
                position={[camion.lat,camion.log]}
                duration={camion.tiempo}
                keepAtCenter={false}>
                <Tooltip>
                  {"Id: " + camion.id}
                  <br></br>
                  {"Placa: " + camion.placa}
                </Tooltip>
                </ReactLeafletDriftMarker>):(
              camion.almacen.id==135 ? (
              <ReactLeafletDriftMarker  icon={myIcon}
              position={[camion.lat,camion.log]}
              duration={camion.tiempo}
              keepAtCenter={false}>
              <Tooltip>
                {"Id: " + camion.id}
                <br></br>
                {"Placa: " + camion.placa}
              </Tooltip>
              </ReactLeafletDriftMarker>
                ) :( camion.almacen.id==123 ? (
                  <ReactLeafletDriftMarker  icon={myIcon2}
                  position={[camion.lat,camion.log]}
                  duration={camion.tiempo}
                  keepAtCenter={false}>
                  <Tooltip>
                    {"Id: " + camion.id}
                    <br></br>
                    {"Placa: " + camion.placa}
                  </Tooltip>
                  </ReactLeafletDriftMarker>
                    ) :( camion.almacen.id==35 ? (
                      <ReactLeafletDriftMarker  icon={myIcon3}
                      position={[camion.lat,camion.log]}
                      duration={camion.tiempo}
                      keepAtCenter={false}>
                      <Tooltip>
                        {"Id: " + camion.id}
                        <br></br>
                        {"Placa: " + camion.placa}
                      </Tooltip>
                      </ReactLeafletDriftMarker>
                        ) :(<></>)))))
          )
        ))
        }
  
      </MapContainer>
    );
  }
  }
  return(
    <div>
      {flagOut === null&&<Diario/>}
    </div>
  );
});

export default Diario;