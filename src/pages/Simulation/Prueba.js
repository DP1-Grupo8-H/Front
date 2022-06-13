// import '../App.css';
import { MapContainer, TileLayer, useMap,Marker,Popup, Polyline,Tooltip} from 'react-leaflet';
import ReactLeafletDriftMarker  from "react-leaflet-drift-marker";
import { Component } from 'react';
import React,{useRef} from 'react';
import {HORA_ITER, HORA_BATCH} from '../../constants/Sim_Params';


const Mapa_Simulacion = (data) => {
  
  //FUNCIONES
  const processData = (data, batch_time) => {
    const pedidos = [];

    for(let d of data){
      console.log(d);
      if(d.fecha_registro > batch_time) return pedidos;
      pedidos.push(d);
    }
    return pedidos; //En caso haya finalizado toda la lista
  } 
  
  const priorityPedidos = (processPedidos, missingPedidos, hora_ini) => {
    const pedidos = new Array (missingPedidos);
    pedidos.push(processPedidos);
    //SI PASA QUE (pedido.fecha_entrega_max - hora_ini) -> COLAPSA
    if(pedidos.some(e => (e.fecha_entrega_max - hora_ini) <= 0))
      return [];
    //Priorizamos los pedidos: fecha_registro
    pedidos.sort((a,b) => a.fecha_registro - b.fecha_registro); 
    return pedidos;
  }

  const position1 = [-9.880358501459673, -74.46566630628085];
  const limeOptions = { color: 'black' ,weight:0.3,opacity:0.5};
  // Primero es el origen y luego el destino

  /* IMPLEMENTACIÓN DE LA SIMULACION ITERATIVA */
  const hora_ini = data[0].fecha_registro;  //DEFINIMOS LA HORA DE INICIO DE LA SIMULACIÓN -- AGARRAMOS EL DATA[0] SIN PROCESAR --> OBTENEMOS LA HORA DE INICIO
  const missingPedidos = [];


  hora_ini.setHours(hora_ini.getHours() + HORA_BATCH);  //Cambiamos la hora de inicio para indicar que ya pasaron las 6 horas corerspondientes.
  const processPedidos = processData(data, hora_ini);

  console.log(processPedidos);
  data.remove(processPedidos);  //Removemos los pedidos procesados -> asegura iteraciones
  console.log(data);
  const pedidos = priorityPedidos(processPedidos, missingPedidos, hora_ini);
  console.log(pedidos);
  // while(1)
  // {


  // }



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

  class Prueba extends Component{
    constructor(props){
      super(props);
      this.Acelerarx2 = this.Acelerarx2.bind(this);
      this.MostrarReferencias = this.MostrarReferencias.bind(this);
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
      creados:0
    };
    componentDidMount(){
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
                console.log(data);
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
                console.log(this.state.tramos);
                this.setState({camiones:this.state.aux})  
              }
    );
    fetch('http://localhost:8080/camion/listar')
    .then(response => response.json())
    .then(data => 
        {
          console.log(data);
          //Agregar atributo de tiempo y coordenadas actuales  
          for(let i = 0;i<data.length;i++){
            data[i].lat = data[i].almacen.latitud;
            data[i].log = data[i].almacen.longitud;
            data[i].tiempo = 10;  
            data[i].tiempollegada = new Date();
            data[i].ciudadActual = data[i].almacen.id;  
          }
          this.setState({aux:data})    
        }
      );
    }

    MostrarReferencias(){
      //Funcion para mover a los camiones aleatoriamente
      let aux = this.state.camiones;
      let max = 2000;
      let min = 1000;
      let mini,maxi,diff;
      let difference = max - min;
      let rand ;

      for(let i=0;i<aux.length;i++){
          //console.log(aux[i].options.idCamion);
          //  aux[i].lat =  -8.39275854521267;
          //  aux[i].log = -73.74649630862517;
          if(aux[i].tiempollegada >= Date.now()) {
            console.log("Aun no me puedo mover");
            continue;
          }
          //Hay que randomizar el tramo
          mini = 0;
          maxi = this.state.ciudades[(aux[i].ciudadActual)-1].tramos1.length-1;
          diff=  maxi-mini;
          rand = Math.random();
          rand = Math.floor( rand * diff);
          rand = rand + mini;
          aux[i].lat = this.state.ciudades[(aux[i].ciudadActual)-1].tramos1[rand].ciudad_destino.latitud;
          aux[i].log = this.state.ciudades[(aux[i].ciudadActual)-1].tramos1[rand].ciudad_destino.longitud;
          aux[i].ciudadActual = this.state.ciudades[(aux[i].ciudadActual)-1].tramos1[rand].ciudad_destino.id;
          rand = Math.random();
          rand = Math.floor( rand * difference);
          rand = rand + min;
          aux[i].tiempo = rand;
          aux[i].tiempollegada = Date.now() + rand;
        }
      this.setState({camiones:aux});
      console.log(this.state.camiones);

      setTimeout(
      this.MostrarReferencias
      ,2000);

    }

      Acelerarx2(){
      console.log(this.Marker1.current);
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
      <div style={{position:'relative',zIndex:9999,float:'right'}}>
        <br></br>
        <button style={{width:"70px",height:"30px",marginRight:"15px"}}>Stop</button>
        <button style={{width:"70px",height:"30px",marginRight:"30px"}} onClick={this.MostrarReferencias}>Start</button>
        {/* <br></br>
        <button style={{width:"45px",height:"30px"}}>x0.25</button>
        <button style={{width:"45px",height:"30px"}}>x0.5</button>
        <button style={{width:"45px",height:"30px"}}>x1</button>
        <button style={{width:"45px",height:"30px"}} onClick={this.Acelerarx2}>x2</button>
        <button style={{width:"45px",height:"30px"}}>x4</button> */}
      </div>

  
      {(
        this.state.ciudades?.map((ciudad)=>(
            ciudad.tipo==1 ? (
            <Marker position={[ciudad.latitud,ciudad.longitud]} icon={myOficina}/>):
            (<Marker position={[ciudad.latitud,ciudad.longitud]} icon={myAlmacen}  />)
        ))
      )
      }

    {(
        this.state.tramos?.map((tramo)=>(
          <Polyline pathOptions={limeOptions} positions={[[tramo.ciudad_origen.latitud,tramo.ciudad_origen.longitud]
            ,[tramo.ciudad_destino.latitud,tramo.ciudad_destino.longitud]]}/>       
        ))
      )
      }

    {
      (
        this.state.camiones?.map((camion)=>(
          <ReactLeafletDriftMarker  icon={myIcon}
              position={[camion.lat,camion.log]}
              duration={camion.tiempo}
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