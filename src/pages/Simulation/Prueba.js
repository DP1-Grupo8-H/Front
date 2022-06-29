// import '../App.css';
import { MapContainer, TileLayer, useMap,Marker,Popup, Polyline,Tooltip} from 'react-leaflet';
import ReactLeafletDriftMarker  from "react-leaflet-drift-marker";
import { Component } from 'react';
import React,{useRef, useState, useEffect, useMemo} from 'react';
import {HORA_ITER, HORA_BATCH} from '../../constants/Sim_Params';
import algoritmoService from '../../services/algoritmoService';
import  SimFunction from './Func_Sim';

const Mapa_Simulacion = ({datos}) => {
  //USO DE PARÁMETROS
  const data = useRef(datos);



  const position1 = [-9.880358501459673, -74.46566630628085];
  const limeOptions = { color: 'black' ,weight:0.3,opacity:0.5};

  const L = require('leaflet');

  const myIcon = L.icon({
      iconUrl:  require('../../archives/circle-16.png'),
      iconSize: [14, 14],
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

  /**********************************************************************/
  /* IMPLEMENTACIÓN DE LA SIMULACION ITERATIVA */
  const hora_ini = useMemo(() => {
    return new Date (data.current[0].fecha_registro)
  }, [])   //DEFINIMOS LA HORA DE INICIO DE LA SIMULACIÓN -- AGARRAMOS EL DATA[0] SIN PROCESAR --> OBTENEMOS LA HORA DE INICIO
  
  let timing = useRef(useMemo(() => {
    return 1000;
  }, []));
  
  let missingPedidos = useRef([]);

  let historico = useRef([]);

  let cantPedidos = useRef(data.current.length);


  /**********************************************************************/
  /* CLASE PRINCIPAL */
  class Prueba extends Component{
    constructor(props){
      super(props);
      this.Acelerarx2 = this.Acelerarx2.bind(this);
      this.MostrarReferencias = this.MostrarReferencias.bind(this);
      this.ObtenerRutas = this.ObtenerRutas.bind(this);
      this.CargarData = this.CargarData.bind(this);
    }
    state = {
      latlng: [-12.13166084108361, -76.98237622750722],
      latlng2: [-12.13166084108361, -76.98237622750722],
      latlng3: [-12.13166084108361, -76.98237622750722],
      duracion: 10000,
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
      moviXCamion:[],
      faltantes:[]
    };

    /**********************************************************************/
    async ObtenerRutas(){
     
      timing.current = HORA_ITER;
        if(data.current.length === 0) { 
          console.log("FINISH");
          return;
        }  //Se depleto
      //Cambiamos la hora de inicio para indicar que ya pasaron las 6 horas corerspondientes.
      hora_ini.setHours(hora_ini.getHours() + HORA_BATCH);  
      let processPedidos = SimFunction.processData(data.current, hora_ini);
      
      historico.current.concat(processPedidos); //PARA TENER EL HISTORIAL DE LOS PEDIDOS --> Originalmente los llenamos con los sacados -- luego aniadamos los parciales
      data.current = data.current.filter(d => {return !processPedidos.includes(d);});  //Removemos los pedidos procesados -> asegura iteraciones
      
      var arr = SimFunction.processParciales(processPedidos, this.state.rutas.camiones, cantPedidos); //Procesamos la creacion de pedidos parciales en caso sea requerido.
      processPedidos = arr[0];    cantPedidos.current = arr[1];
      //Priority pedidos debería sacar de esta lista a los pedidos que tienen pedidos parciales -- AL ORIGINAL YA QUE NO SE CONTEMPLA LA BASE
      const pedidos = SimFunction.priorityPedidos(processPedidos, missingPedidos, hora_ini);
      
      if(pedidos.length === 0) return;//Llego al colapso --
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //PETICION AL BACK
      const ruta = await algoritmoService.simSemanal(pedidos, this.state.camiones, hora_ini);
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      
      //console.log(ruta);
      await this.setState({rutas:ruta});  //SET_STATE--> RUTAS -- SE LLENAS LAS RUTAS :: RUTAS : MOVIMIENTOS - PLANES {CAMIONES, MOVIMIENTOS, PEDIDOS_FALT (NO HAY PEDIDO ORIGINAL - SOLO EL PARCIAL), PLANES}

      //Llenado de pedidos faltantes
      missingPedidos.current = await this.state.rutas.pedidos_faltantes;
      
      //Acumulacion de los pedidos en un arreglo grande - HISTORICO ARREGLADO
      historico.current = SimFunction.addRoutes(historico.current, this.state.rutas.planes);

      console.log("MISSING: ", missingPedidos.current);
      console.log(this.state.rutas);

     setTimeout( this.ObtenerRutas
    , timing.current);
      
  }
  /**********************************************************************/
  async CargarData(){
    var existen = new Array(201);
      for(let i = 0;i<=200;i++){
        existen[i] = new Array(201);
      }
      for(let  i = 0;i<200;i++){
        for(let j =0;j<200;j++){
          existen[i][j] = false;
        }
      }
      fetch('http://localhost:8080/ciudad/listar')
      .then(response => response.json())
      .then(data => 
          {
            //console.log(data);
            this.setState({ciudades:data})
            let aux = [];
            for(let i=0;i<data.length;i++){
              for(let j=0;j<data[i].tramos1.length;j++){
                if(!existen[data[i].tramos1[j].ciudad_destino.id][data[i].tramos1[j].ciudad_origen.id] && 
                  !existen[data[i].tramos1[j].ciudad_origen.id][data[i].tramos1[j].ciudad_destino.id] )
                  {
                    aux.push(data[i].tramos1[j]);
                    existen[data[i].tramos1[j].ciudad_destino.id][data[i].tramos1[j].ciudad_origen.id] = true;
                    existen[data[i].tramos1[j].ciudad_origen.id][data[i].tramos1[j].ciudad_destino.id] = true;
                  }
              }
            }
            this.setState({tramos:aux});
            //console.log(this.state.tramos);
            
            fetch('http://localhost:8080/camion/listar')
            .then(response => response.json())
            .then(data => 
              {
                //console.log(data);
                //Agregar atributo de tiempo y coordenadas actuales  
                for(let i = 0;i<data.length;i++){
                  data[i].lat = data[i].almacen.latitud;
                  data[i].log = data[i].almacen.longitud;
                  data[i].tiempo = 10;  
                  data[i].tiempollegada = new Date();
                  data[i].ciudadActual = data[i].almacen.id;  
                }
                this.setState({aux:data});
                this.setState({camiones:this.state.aux});
                this.ObtenerRutas();
                this.MostrarReferencias();
              }
            );
       }
  );
  
  }

  componentDidMount(){
    this.CargarData();
  }

    MostrarReferencias(){
      //Funcion para mover a los camiones aleatoriamente
      //console.log(this.state.rutas); 
      //Si estado esta lleno debemos vaciar al final
      //console.log(this.state.rutas);
      if(this.state.rutas!=null){
        this.state.moviXCamion= Array(this.state.camiones.length);
        for(let i =0;i<this.state.camiones.length;i++){
          this.state.moviXCamion[i] = [];
        }
        for(let i =0;i<this.state.rutas.movimientos.length;i++){  //Creamos cola por cada camion
          // this.state.moviXCamion[(this.state.rutas.movimientos[i].id_camion)-1].push({
          //    idCiudad: this.state.rutas.movimientos[i].ruta_ciudad[0].id_ciudad.id,
          //    tiempo: 0.0  //Primera ciudad tiempo 0
          // });
          let inicial =  new Date(this.state.rutas.movimientos[i].ruta_ciudad[0].fecha_llegada);
          for(let j=1;j<this.state.rutas.movimientos[i].ruta_ciudad.length;j++){
            let final =  new Date(this.state.rutas.movimientos[i].ruta_ciudad[j].fecha_llegada);
            var diff = Math.abs(final - inicial)
            this.state.moviXCamion[(this.state.rutas.movimientos[i].id_camion)-1].push({
              idCiudad: this.state.rutas.movimientos[i].ruta_ciudad[j].id_ciudad.id,
              tiempo: diff
           });
          }
        }
        this.state.faltantes = this.state.rutas.pedidos_faltantes;
        this.state.rutas = null;
      }  
      //console.log(this.state.moviXCamion);

      let aux = this.state.camiones;

      //Conversion 6h a 1 minuto

      //Definimos tiempo en el que se deben mover todos
      //La diferencia de tiempo entre ahora y el tiempo referencial
      //lanzara la funcion de movimiento individual

      for(let i=0;i<this.state.moviXCamion.length;i++){
          if(this.state.moviXCamion[i].length==0) continue; //No mas movimientos para ese camion
          if(aux[i].tiempollegada >= Date.now()) { //Aun no regresa
            //console.log("Aun no me puedo mover");
            continue;
          }
          var nuevaCiudad = this.state.moviXCamion[i].shift();
          //console.log(nuevaCiudad);
          aux[i].lat = this.state.ciudades[nuevaCiudad.idCiudad-1].latitud;
          aux[i].log = this.state.ciudades[nuevaCiudad.idCiudad-1].longitud;
          let min = nuevaCiudad.tiempo/(1000*60*60);
          aux[i].tiempo = 500*min; //1h es 10 seg reales
          aux[i].tiempollegada = Date.now()+aux[i].tiempo; //Buscar mejor bandera
          this.setState({camiones:aux});
        }

      setTimeout(
      this.MostrarReferencias
      ,1000);

    }

      Acelerarx2(){
      //console.log(this.Marker1.current);
      var a = this.state.duracion/2;
      this.setState({duracion:a});
      this.setState({latlng:[-8.474110507351497, -74.82935154356059]});
        this.setState({latlng2:[-3.586306117836121, -80.41144843770009]});
      this.setState({latlng3:[-16.42723302628582, -71.66528915483397]});
      }

      /* prueba para el algoritmo como tal --> LO QUE PIDIO RODRIGO EN FRONT */



  render(){
    return (
      <MapContainer center={position1} zoom={6} scrollWheelZoom={true} >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <div style={{position:'relative',zIndex:9999,float:'right'}}>
        <br></br>
        <button style={{width:"70px",height:"30px",marginRight:"15px"}}>Stop</button>
        <button style={{width:"70px",height:"30px",marginRight:"30px"}} onClick={this.MostrarReferencias}>Start</button>
        <br></br>
        <button style={{width:"45px",height:"30px"}}>x0.25</button>
        <button style={{width:"45px",height:"30px"}}>x0.5</button>
        <button style={{width:"45px",height:"30px"}}>x1</button>
        <button style={{width:"45px",height:"30px"}} onClick={this.Acelerarx2}>x2</button>
        <button style={{width:"45px",height:"30px"}}>x4</button>
      </div> */}

  
      {(
        this.state.ciudades?.map((ciudad)=>(
            ciudad.tipo==1 ? (
            <Marker position={[ciudad.latitud,ciudad.longitud]} icon={myOficina}/>):
            (<Marker position={[ciudad.latitud,ciudad.longitud]} icon={myAlmacen}  />)
        ))
      )
      }

    {/* {(
        this.state.tramos?.map((tramo)=>(
          <Polyline pathOptions={limeOptions} positions={[[tramo.ciudad_origen.latitud,tramo.ciudad_origen.longitud]
            ,[tramo.ciudad_destino.latitud,tramo.ciudad_destino.longitud]]}/>       
        ))
      )
      } */}

    {
      (
        this.state.camiones?.map((camion)=>(
          <ReactLeafletDriftMarker  icon={myIcon}
              position={[camion.lat,camion.log]}
              duration={camion.tiempo*0.6}
              keepAtCenter={false}/>  
          )
        )
      )
      }

    </MapContainer>
    
    );
  }
  }
  return(
    <Prueba/>
  );
}
export default Mapa_Simulacion;