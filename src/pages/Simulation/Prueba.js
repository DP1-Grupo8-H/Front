// import '../App.css';
import { MapContainer, TileLayer, useMap,Marker,Popup, Polyline,Tooltip} from 'react-leaflet';
import ReactLeafletDriftMarker  from "react-leaflet-drift-marker";
import { Component } from 'react';
import React,{useRef, useState, useEffect, useMemo} from 'react';
import {HORA_ITER, HORA_BATCH} from '../../constants/Sim_Params';
import algoritmoService from '../../services/algoritmoService';
import  SimFunction from './Func_Sim';
import Legend from "../../components/Legend/Legend";
import { color } from '@mui/system';

import LZString from 'lz-string';


const Mapa_Simulacion = ({datos,fechaActual, setOpenResume, setHistorico, setFechaFin,setMinutosFin,setSegundosFin}) => {
  //USO DE PARÁMETROS
  const data = useRef(datos);

  const position1 = [-9.880358501459673, -74.46566630628085];
  const limeOptions = { color: 'red' ,weight:1,opacity:1};
  // Primero es el origen y luego el destino

  const L = require('leaflet');

  const myIcon = L.icon({
      iconUrl:  require('../../archives/circle-16.png'),
      iconSize: [14, 14],
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

  const [flagOut,setFlagOut] = useState(null);

  useEffect(() => {
    console.log("no re-renders");
    if(flagOut !== null){
            //Ahora si llego mi momento
      setSegundosFin(flagOut.segundos);
      setMinutosFin(flagOut.minutos);
      setFechaFin(flagOut.guardado);
      setHistorico(flagOut.historico);
      setOpenResume(true);
    }
  }, [flagOut])
  


 /**********************************************************************/
  /* IMPLEMENTACIÓN DE LA SIMULACION ITERATIVA */
  const hora_ini = useMemo(() => {
    //return new Date (data.current[0].fecha_registro)
    return new Date(fechaActual)
  }, [])   //DEFINIMOS LA HORA DE INICIO DE LA SIMULACIÓN -- AGARRAMOS EL DATA[0] SIN PROCESAR --> OBTENEMOS LA HORA DE INICIO
  
  let timing = useRef(useMemo(() => {
    return 1000;
  }, []));
  
  let missingPedidos = useRef([]);

  let historico = useRef([]);

  let cantPedidos = useRef(data.current.length);

 var idInterval = [];
  /**********************************************************************/
  
  class Prueba extends Component{
    constructor(props){
      super(props);
      this.ObtenerRutas = this.ObtenerRutas.bind(this);
      this.CargarData = this.CargarData.bind(this);
      this.currentTime = this.currentTime.bind(this);
      this.funcionCiclica = this.funcionCiclica.bind(this);
      this.sleep = this.sleep.bind(this);
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
      flagcolapse: false,
      moviXCamion:[],
      mantXCamion:[],
      faltantes:[],
      cami:"",
      tiempo: "",
      guardado: new Date(fechaActual.getTime()+6*1000*60*60),
      mostrarTramos:true,
      segundos:0,
      minutos:0,
      estadosCamion:[],
      idTiempos:"",
      idObtenerRutas:"",
      terminoSimulacion:false,
    };

    async hallarFin(){
      for(let i =0;i<this.state.moviXCamion.length;i++){
        if(this.state.moviXCamion[i].length!=0){
          await this.sleep(1500);
          i--;
        }
      }
      console.log("Dejaron de moverse todos bien");
    }
    componentDidUpdate(prevProps,prevState) {
      if (this.state.flagfinish !== prevState.flagfinish) {
        console.log("Do something");
        if(this.state.flagfinish) {
          console.log("FINISH");
          this.hallarFin()
          .then(() => {
            console.log("ENTRAMOS");

            setFlagOut({segundos: this.state.segundos, minutos: this.state.minutos, guardado:this.state.guardado, historico: historico.current});
            //.then(await this.sleep(9999999999))
            //var d = JSON.parse(JSON.stringify(historico.current))
            console.log("Solo debo estar en la eternidad 1 vez");
            return ;
          });
        }
      }
      if (this.state.flagcolapse !== prevState.flagcolapse) {
        console.log("Do something");
        if(this.state.flagcolapse) {
          console.log("COLAPSE");
          this.hallarFin()
          setFlagOut({segundos: this.state.segundos, minutos: this.state.minutos, guardado:this.state.guardado, historico: historico.current});
          console.log("Solo debo estar en la eternidad 1 vez");
          return ;
        }
      }
    }

    async ObtenerRutas(){
     //11am -> [+6 HORAS |- 5am]
     //console.log("Obtuve Rutas"); 
      timing.current = HORA_ITER;
        //DEBE CAMBIAR -> A QUE TERMINE CUANDO LOS CAMIONES REGRESAN A SU ESTADO INICIAL
      //+5 Horas por el desfase de zona horaria  
      hora_ini.setHours(hora_ini.getHours() + HORA_BATCH);
      let processPedidos = SimFunction.processData(data.current, hora_ini);
      //hora_ini.setHours(hora_ini.getHours() +5);  //Cambiamos la hora de inicio para indicar que ya pasaron las 6 horas corerspondientes.
      //var diferencia = new Date(hora_ini.getTime()); //Diferencia de zona horaria
      var aux = new Date(hora_ini);
      aux.setHours(aux.getHours() - 5);
      var ahora = aux.toISOString().replace(/T/, ' ').replace(/\..+/, '');   
      console.log("Hora para bloqueos: ");  
      console.log(ahora);
      fetch('http://inf226g8.inf.pucp.edu.pe:8000/bloqueo/listarFront/' + ahora)
          .then(response => response.json())
          .then(data => 
            {
              console.log(data);
              var auxi = JSON.parse(JSON.stringify(this.state.tramos));
              for(let i = 0;i<auxi.length;i++){
                auxi[i].bloqueado = 0;
              }
              for(let i = 0;i<data.length;i++){
                 auxi[(data[i].id_tramo.id_tramo)-1].bloqueado = 1;
              }
              this.setState({tramos:auxi});
            }
        );
        aux.setHours(aux.getHours() +5); 
        //PARA TENER EL HISTORIAL DE LOS PEDIDOS --> Originalmente los llenamos con los sacados -- luego aniadamos los parciales
        processPedidos.forEach((ped) =>{ historico.current.push(
          {
          'pedido': ped,
          'plan_transporte': [],
          }
        );});

        data.current = data.current.filter(d => {return !processPedidos.includes(d);});  //Removemos los pedidos procesados -> asegura iteraciones

        if(data.current.length === 0 && processPedidos.length === 0 && missingPedidos.current.length === 0) {
          clearInterval(idInterval);
          this.setState((state) => ({
            flagfinish: !state.flagfinish
          }))
          return;
          //SI YA SE ENTREGARON TODOS LOS PEDIDOS - this.state.terminoSimulacion 1->
        }
          // var a = JSON.parse(JSON.stringify(this.state.segundos));
          // setSegundosFin(a);
          // var b = JSON.parse(JSON.stringify(this.state.minutos));
          // setMinutosFin(b);
          //var c = new Date(JSON.parse(JSON.stringify(this.state.guardado)));
          // setFechaFin(hora_ini);
          // setHistorico(historico.current);
          // setOpenResume(true)
          // .then(await this.sleep(9999999999))
          //var d = JSON.parse(JSON.stringify(historico.current))
          // console.log("Solo debo estar en la eternidad 1 vez");
          // return ;
          //return;
        // } else if(data.current.length === 0) {
        //   // clearInterval(this.state.idTiempos);
        //   // clearInterval(idInterval);
        //   // await this.sleep(9999999999);
        //   return ;
        // }
        
        console.log(data);
        var arr = SimFunction.processParciales(processPedidos, this.state.estadosCamion, cantPedidos.current); //Procesamos la creacion de pedidos parciales en caso sea requerido.
        processPedidos = arr[0];    cantPedidos.current = arr[1];
        //Priority pedidos debería sacar de esta lista a los pedidos que tienen pedidos parciales -- AL ORIGINAL YA QUE NO SE CONTEMPLA LA BASE
        const pedidos = SimFunction.priorityPedidos(processPedidos, missingPedidos.current, hora_ini);
        console.log(pedidos); 
        if(pedidos === null) {
          clearInterval(idInterval);
          this.setState((state) => ({
            flagcolapse: !state.flagcolapse
          }))
          return;
        }//Llego al colapso --
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //PETICION AL BACK
        console.log(hora_ini);
        const ruta = await algoritmoService.simSemanal(pedidos, this.state.estadosCamion, hora_ini);
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        //console.log(ruta);
        await this.setState({rutas:ruta});  //SET_STATE--> RUTAS -- SE LLENAS LAS RUTAS :: RUTAS : MOVIMIENTOS - PLANES {CAMIONES, MOVIMIENTOS, PEDIDOS_FALT (NO HAY PEDIDO ORIGINAL - SOLO EL PARCIAL), PLANES}
        
        //Poner las rutas en los movimientos de cada camion
        
        //Acumulacion de los pedidos en un arreglo grande - HISTORICO ARREGLADO
        arr = SimFunction.addRoutes(historico.current, this.state.rutas.planes, this.state.ciudades);
        historico.current = arr[0];        const pedido_plan = arr[1];
        
        //Llenado de pedidos faltantes
        missingPedidos.current = SimFunction.llenarMissingPedidos(this.state.rutas.pedidos_faltantes, missingPedidos.current, pedido_plan);
        console.log("MISSING: ", missingPedidos.current);
        console.log("HISTORICOOOOOO::: ", historico.current);
        console.log(this.state.rutas);

        if(this.state.rutas!=null){
          if(this.state.moviXCamion.length==0) { //Primera vez que se genera los movimientos
              this.state.moviXCamion= Array(this.state.camiones.length);
              for(let i =0;i<this.state.camiones.length;i++){
                this.state.moviXCamion[i] = [];
              }
          }
          let inicial,final;
          for(let i =0;i<this.state.rutas.movimientos.length;i++){
            inicial =  new Date(this.state.rutas.movimientos[i].ruta_ciudad[0].fecha_llegada);
            for(let j=1;j<this.state.rutas.movimientos[i].ruta_ciudad.length;j++){
               final =  new Date(this.state.rutas.movimientos[i].ruta_ciudad[j].fecha_llegada);
              var diff = Math.abs(final.getTime() - inicial.getTime());
              this.state.moviXCamion[(this.state.rutas.movimientos[i].id_camion)-1].push({
                idCiudad: this.state.rutas.movimientos[i].ruta_ciudad[j].id_ciudad.id,
                tiempo: diff,
                inicial: this.state.rutas.movimientos[i].ruta_ciudad[0].fecha_llegada
             });
             inicial = final;
            }
          }
          this.state.rutas = null;
        }      
      //  setTimeout( this.ObtenerRutas
      // , timing.current);
  }
  CargarData(){
    let data = JSON.parse(LZString.decompress(window.localStorage.getItem("ciudades")))
    console.log(data);
    this.setState({ciudades:data})

    data = JSON.parse(LZString.decompress(window.localStorage.getItem("tramos")))
    console.log(data);
    this.setState({tramos:data});

    data = JSON.parse(LZString.decompress(window.localStorage.getItem("mantenimientos")))
    //console.log("Los mantenimientos son: ")
    //console.log(data);
    var dat = data;
    fetch('http://inf226g8.inf.pucp.edu.pe:8000/camion/listar')
    .then(response => response.json())
    .then(data => 
      {
        if(this.state.mantXCamion.length==0) { //Primera vez que se genera los movimientos
          this.state.mantXCamion= Array(data.length);
          for(let i =0;i<data.length;i++){
            this.state.mantXCamion[i] = [];
          }
        }
        for(let i =0;i<dat.length;i++){
          this.state.mantXCamion[dat[i].id_camion.id-1].push({
            fecha:dat[i].fecha
          });
        }
        //console.log(data);
        //Agregar atributo de tiempo y coordenadas actuales  
        for(let i = 0;i<data.length;i++){
          data[i].lat = data[i].almacen.latitud;
          data[i].log = data[i].almacen.longitud;
          data[i].tiempo = 10;  
          data[i].tiempollegada = new Date();
          data[i].ciudadActual = data[i].almacen.id;
          data[i].estado = 1;
          this.funcionCiclica(i);  
        }
        this.setState({estadosCamion:data});
        this.setState({camiones:data});
        // setOpenResume(true);
        // var d = JSON.parse(JSON.stringify(historico.current));
        // setHistorico(d);
        ////
        this.ObtenerRutas();
        ////
        idInterval = setInterval(() => {
          this.ObtenerRutas();
        }, 60000);
        // this.setState({idObtenerRutas:b});
        // this.ObtenerMantenimientos();
        // this.MostrarReferencias();

        //Comenzar Timer una vez se halla iniciado con todo
        var auxii = setInterval(() => {
          this.currentTime()
        }, 1000);
        this.setState({idTiempos:auxii});
      }
    );
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
         while(this.state.guardado<=this.state.moviXCamion[idx][0].inicial){ //Esperar que sea la hora correcta
           await this.sleep(1000);
         }
        otro[idx].estado = 0;
         this.setState({estadosCamion:otro});
         for (let i =0;i<this.state.moviXCamion[idx].length;i++){
          var nuevaCiudad = this.state.moviXCamion[idx][i];
          //Verificamos si nosotros hacemos el lag
          otro[idx].lat = this.state.ciudades[nuevaCiudad.idCiudad-1].latitud;
          otro[idx].log = this.state.ciudades[nuevaCiudad.idCiudad-1].longitud;
          let min = nuevaCiudad.tiempo/(1000*60*60);
          otro[idx].tiempo = 10*min*80; 
          this.state.camiones[idx] = otro[idx];
          await this.sleep(10000*min);
         }
         //console.log("Termine con el camion " + idx + "a las: " + this.state.guardado);
         this.state.moviXCamion[idx] = [];
         this.state.camiones[idx].estado = 1;
      }
    }
   //Revisar mantenimiento
  //  console.log(this.state.mantXCamion[idx]);
  //  await this.sleep(10000);
  if(this.state.camiones.length!=0){
      for(let i = 0;i<this.state.mantXCamion[idx].length;i++){
        //Queremos obtener las 00 de ese dia
        var inicio = new Date(this.state.mantXCamion[idx][i].fecha);
        inicio.setHours(0);
        inicio.setMinutes(0);
        var final = new Date(this.state.mantXCamion[idx][i].fecha);
        final.setHours(23);
        final.setMinutes(59);
        if(this.state.guardado>=inicio && this.state.guardado<=final){
          var espera  = final.getTime() - this.state.guardado.getTime();
          this.state.camiones[idx].estado = 2;
          console.log("Estoy en mantenimiento: " + idx);
          await this.sleep(espera/(1000*60*60)*10000);
          this.state.camiones[idx].estado = 1;
        }
      }
   }
   //Lanzar misma funcion dentro de 2 seg
    setTimeout(() => {
      this.funcionCiclica(idx);
    }, 2000);
  }
  currentTime(){
    this.state.guardado.setMinutes(this.state.guardado.getMinutes() + 6); 
    var diferencia = new Date(this.state.guardado.getTime() -5* 60 * 60 * 1000); //Diferencia de zona horaria
    var ahora = diferencia.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    this.setState({tiempo:ahora});
    if(this.state.segundos==59){
      this.state.segundos = 0;
      this.state.minutos+=1;
    }
    else this.state.segundos+=1;
  }

  componentDidMount(){
    this.CargarData();
  }

    
      // Acelerarx2(){
      // //console.log(this.Marker1.current);
      // var a = this.state.duracion/2;
      // this.setState({duracion:a});
      // this.setState({latlng:[-8.474110507351497, -74.82935154356059]});
      //   this.setState({latlng2:[-3.586306117836121, -80.41144843770009]});
      // this.setState({latlng3:[-16.42723302628582, -71.66528915483397]});
      // }

      /* prueba para el algoritmo como tal --> LO QUE PIDIO RODRIGO EN FRONT */



  render(){
    return (
      <MapContainer center={position1} zoom={6} scrollWheelZoom={true} id="idMapita">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <div style={{position:'relative',zIndex:9999,float:'right'}}>
        <p style={{color:"black",fontSize:"24px"}}>
          {this.state.tiempo}
          <p style={{color:"black",fontSize:"20px"}}>
            Tiempo de ejecución: {this.state.minutos}m : {this.state.segundos}s
          </p>
        </p>
        {/* <Chrono/> */}
        {/* <br></br>
        <button style={{width:"70px",height:"30px",marginRight:"15px"}}>Stop</button>
        <button style={{width:"70px",height:"30px",marginRight:"30px"}} onClick={this.MostrarReferencias}>Start</button>
        <br></br>
        <button style={{width:"45px",height:"30px"}}>x0.25</button>
        <button style={{width:"45px",height:"30px"}}>x0.5</button>
        <button style={{width:"45px",height:"30px"}}>x1</button>
        <button style={{width:"45px",height:"30px"}} onClick={this.Acelerarx2}>x2</button>
        <button style={{width:"45px",height:"30px"}}>x4</button> */}

      </div>

      <div style={{position:'absolute',zIndex:9999,float:'left',bottom:0,width:"500px"}}>
         <Legend/>
      </div>
      {(
        this.state.ciudades?.map((ciudad)=>(
            ciudad.tipo==1 ? (
            <Marker position={[ciudad.latitud,ciudad.longitud]} icon={myOficina}>
              <Tooltip>
                {ciudad.ciudad}
              </Tooltip>
              </Marker>):
            (<Marker position={[ciudad.latitud,ciudad.longitud]} icon={myAlmacen} >
              <Tooltip>
                {ciudad.ciudad}
              </Tooltip>
              </Marker>)
        ))
      )
      }

    {(
        this.state.tramos ?.map((tramo)=>(
          tramo.bloqueado == 1 && this.state.mostrarTramos == true ? (
          <Polyline pathOptions={limeOptions} positions={[[tramo.ciudad_origen.latitud,tramo.ciudad_origen.longitud]
            ,[tramo.ciudad_destino.latitud,tramo.ciudad_destino.longitud]]}/> ):(<></>)      
        ))
      )
      }

    {
      (
        this.state.camiones?.map((camion)=>(
          camion.estado == 2 ? (
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
              ) 
          )
        )
      )
      }

    </MapContainer>
    
    );
  }
  }
  return(
    <div>
      {flagOut === null&&<Prueba/>}
    </div>
  );
}
export default Mapa_Simulacion;