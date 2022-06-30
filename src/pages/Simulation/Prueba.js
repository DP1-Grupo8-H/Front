// import '../App.css';
import { MapContainer, TileLayer, useMap,Marker,Popup, Polyline,Tooltip} from 'react-leaflet';
import ReactLeafletDriftMarker  from "react-leaflet-drift-marker";
import { Component } from 'react';
import React,{useRef, useState, useEffect, useMemo} from 'react';
import {HORA_ITER, HORA_BATCH} from '../../constants/Sim_Params';
import algoritmoService from '../../services/algoritmoService';
import  SimFunction from './Func_Sim';
import Chrono from './Chrono';
import { color } from '@mui/system';

const Mapa_Simulacion = ({datos,fechaActual}) => {
  //USO DE PARÁMETROS
  const data = useRef(datos);

  // //FUNCIONES
  // const processData = (data, batch_time) => {
  //   const pedidos = [];

  //   for(let d of data){
  //     if(d.fecha_registro > batch_time) return pedidos;
  //     pedidos.push(d);
  //   }
  //   return pedidos; //En caso haya finalizado toda la lista
  // } 
  
  // const priorityPedidos = (processPedidos, missingPedidos, hora_ini) => {
  //   const pedidos = [...processPedidos];
  //   pedidos.concat(missingPedidos);
  //   //SI PASA QUE (pedido.fecha_entrega_max - hora_ini) -> COLAPSA
  //   if(pedidos.some(e => (e.fecha_entrega_max - hora_ini) <= 0))
  //     return [];
  //   //Priorizamos los pedidos: fecha_registro
  //   pedidos.sort((a,b) => a.fecha_registro - b.fecha_registro); 
  //   return pedidos;
  // }

  const position1 = [-9.880358501459673, -74.46566630628085];
  const limeOptions = { color: 'red' ,weight:1,opacity:1};
  // Primero es el origen y luego el destino

  /* IMPLEMENTACIÓN DE LA SIMULACION ITERATIVA */
  // const hora_ini = useMemo(() => {
  //     return new Date (data.current[0].fecha_registro)
  // }, [])   //DEFINIMOS LA HORA DE INICIO DE LA SIMULACIÓN -- AGARRAMOS EL DATA[0] SIN PROCESAR --> OBTENEMOS LA HORA DE INICIO

  // let timing = useRef(useMemo(() => {
  //     return 1000;
  // }, []));

  // const missingPedidos = useRef([]);

  // const [rutas, setRutas] = useState([]);
  
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     timing.current = HORA_ITER;
  //     if(data.current.length === 0) {
  //       console.log("FINISH");
  //       return;
  //     }  //Se depleto
  //   hora_ini.setHours(hora_ini.getHours() + HORA_BATCH);  //Cambiamos la hora de inicio para indicar que ya pasaron las 6 horas corerspondientes.
  //   const processPedidos = processData(data.current, hora_ini);
    
  //   data.current = data.current.filter(d => {return !processPedidos.includes(d);});  //Removemos los pedidos procesados -> asegura iteraciones
    
  //   const pedidos = priorityPedidos(processPedidos, missingPedidos, hora_ini);
    
  //   console.log(pedidos);
  //   if(pedidos.length === 0) return;//Llego al colapso
    
  //   algoritmoService.testAlgorithm(pedidos)
  //   .then(ruta => setRutas(ruta));
    
  //   console.log(rutas);
  // }, timing.current); // DESPUES DE 1 SEGUNDO SE EJECUTA
  // return () => clearTimeout(timer);
  // }, [rutas])

  //FIN DEL ALGORITMO


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


  /**********************************************************************/
  
  class Prueba extends Component{
    constructor(props){
      super(props);
      this.Acelerarx2 = this.Acelerarx2.bind(this);
      this.MostrarReferencias = this.MostrarReferencias.bind(this);
      this.ObtenerRutas = this.ObtenerRutas.bind(this);
      this.CargarData = this.CargarData.bind(this);
      this.ObtenerMantenimientos = this.ObtenerMantenimientos.bind(this);
      this.currentTime = this.currentTime.bind(this);
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
      faltantes:[],
      cami:"",
      tiempo: "",
      guardado:""
    };

    async ObtenerRutas(){
     
     //console.log("Obtuve Rutas"); 
      timing.current = HORA_ITER;
        if(data.current.length === 0) {
          console.log("FINISH");
          return;
        }  //Se depleto
      //+5 Horas por el desfase de zona horaria  
      hora_ini.setHours(hora_ini.getHours() + HORA_BATCH+5);  //Cambiamos la hora de inicio para indicar que ya pasaron las 6 horas corerspondientes.
      let processPedidos = SimFunction.processData(data.current, hora_ini);
      hora_ini.setHours(hora_ini.getHours() -5); 
      var diferencia = new Date(hora_ini.getTime() - 5 * 60 * 60 * 1000); //Diferencia de zona horaria
      var ahora = diferencia.toISOString().replace(/T/, ' ').replace(/\..+/, '');     
      console.log(ahora);
      fetch('http://localhost:8080/bloqueo/listarFront/' + ahora)
          .then(response => response.json())
          .then(data => 
            {
              console.log(data);
              var auxi = this.state.tramos;
              for(let i = 0;i<auxi.length;i++){
                auxi[i].bloqueado = 0;
              }
              for(let i = 0;i<data.length;i++){
                 auxi[(data[i].id_tramo.id_tramo)-1].bloqueado = 1;
              }
              this.setState({tramos:auxi});
            }
        );

        historico.current.concat(processPedidos); //PARA TENER EL HISTORIAL DE LOS PEDIDOS --> Originalmente los llenamos con los sacados -- luego aniadamos los parciales
        data.current = data.current.filter(d => {return !processPedidos.includes(d);});  //Removemos los pedidos procesados -> asegura iteraciones
        
        var arr = SimFunction.processParciales(processPedidos, this.state.camiones, cantPedidos); //Procesamos la creacion de pedidos parciales en caso sea requerido.
        processPedidos = arr[0];    cantPedidos.current = arr[1];
        //Priority pedidos debería sacar de esta lista a los pedidos que tienen pedidos parciales -- AL ORIGINAL YA QUE NO SE CONTEMPLA LA BASE
        const pedidos = SimFunction.priorityPedidos(processPedidos, missingPedidos.current, hora_ini);
        console.log(pedidos); 
        if(pedidos.length === 0) return;//Llego al colapso --
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //PETICION AL BACK
        console.log(hora_ini);
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
  async CargarData(){
    // var existen = new Array(201);
    //   for(let i = 0;i<=200;i++){
    //     existen[i] = new Array(201);
    //   }
    //   for(let  i = 0;i<200;i++){
    //     for(let j =0;j<200;j++){
    //       existen[i][j] = false;
    //     }
    //   }
      fetch('http://localhost:8080/ciudad/listar')
      .then(response => response.json())
      .then(data => 
          {
            //console.log(data);
            this.setState({ciudades:data})
            fetch('http://localhost:8080/tramo/listar')
            .then(response => response.json())
            .then(data => 
              {
                console.log(data);
                this.setState({tramos:data});
                var diferencia = new Date(hora_ini.getTime() +1 * 60 * 60 * 1000); //Diferencia de zona horaria
                var ahora = diferencia.toISOString().replace(/T/, ' ').replace(/\..+/, '');     
                fetch('http://localhost:8080/mantenimiento/listarActual/'+ahora)
                  .then(response => response.json())
                  .then(data => 
                    {
                      console.log(data);
                      var dat = data;
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
                              data[i].estado = 1;  
                            }
                            this.setState({aux:data});
                            this.setState({camiones:this.state.aux});
                            var auxi = this.state.camiones;
                            for(let  i = 0;i<auxi.length;i++){
                              if(auxi[i].estado==2) auxi[i].estado = 1;
                            }
                            for(let i =0;i<dat.length;i++){
                              auxi[(dat[i].id_camion.id)-1].estado = 2;
                            }
                            this.setState({camiones:auxi});
                            this.ObtenerRutas();
                            //this.ObtenerMantenimientos();
                            this.MostrarReferencias();
                            //Una vez cargada la data ,activamos el reloj
                            setInterval(() => {
                              this.currentTime()
                            }, 1000);
                          }
                        );
                    }
                  );
              }
            );
       }
  );
  
  }
 
  currentTime(){
    this.state.guardado.setMinutes(this.state.guardado.getMinutes() + 6); 
    var diferencia = new Date(this.state.guardado.getTime() -5* 60 * 60 * 1000); //Diferencia de zona horaria
    var ahora = diferencia.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    this.setState({tiempo:ahora});
  }
  componentDidMount(){
    // var diferencia = new Date(hora_ini.getTime() -5* 60 * 60 * 1000); //Diferencia de zona horaria
    // var ahora = diferencia.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    console.log(hora_ini);
    var a = hora_ini;
    a.setHours(hora_ini.getHours()-6);
    this.setState({guardado:a});
    // this.setState({tiempo:ahora});
    this.CargarData();
  }


    ObtenerMantenimientos(){
      var diferencia = new Date(hora_ini.getTime() +1 * 60 * 60 * 1000); //Diferencia de zona horaria
      var ahora = diferencia.toISOString().replace(/T/, ' ').replace(/\..+/, '');     
      fetch('http://localhost:8080/mantenimiento/listarActual/'+ahora)
        .then(response => response.json())
        .then(data => 
          {
            console.log(data);
            var auxi = this.state.camiones;
            for(let  i = 0;i<auxi.length;i++){
              if(auxi[i].estado==2) auxi[i].estado = 1;
            }
            for(let i =0;i<data.length;i++){
              auxi[(data[i].id_camion.id)-1].estado = 2;
            }
            this.setState({camiones:auxi});
          }
        );
      
      setTimeout(
          this.ObtenerMantenimientos
          ,10000); //Cada hora
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
          if(this.state.moviXCamion[i].length==0 && aux[i].tiempollegada >= Date.now()) {
                   aux[i].estado = 1;
                   continue;
            } //No mas movimientos para ese camion
           else if (this.state.moviXCamion[i].length==0){
            continue;
           }
          if(aux[i].tiempollegada >= Date.now()) { //Aun no regresa
            //console.log("Aun no me puedo mover");
            continue;
          }
          var nuevaCiudad = this.state.moviXCamion[i].shift();
          aux[i].estado = 0;
          //console.log(nuevaCiudad);
          aux[i].lat = this.state.ciudades[nuevaCiudad.idCiudad-1].latitud;
          aux[i].log = this.state.ciudades[nuevaCiudad.idCiudad-1].longitud;
          let min = nuevaCiudad.tiempo/(1000*60*60);
          aux[i].tiempo = 10000*min; //1h es 10 seg reales
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
      <div style={{position:'relative',zIndex:9999,float:'right'}}>
        <p style={{color:"black",fontSize:"24px"}}>
          {this.state.tiempo}
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
        this.state.tramos?.map((tramo)=>(
          tramo.bloqueado == 1 ? (
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
              duration={camion.tiempo*0.55}
              keepAtCenter={false}>
              <Tooltip>
                {"Id: " + camion.id}
                <br></br>
                {"Placa: " + camion.placa}
              </Tooltip>
              </ReactLeafletDriftMarker>):(
            <ReactLeafletDriftMarker  icon={myIcon}
            position={[camion.lat,camion.log]}
            duration={camion.tiempo*0.63}
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
    <Prueba/>
  );
}
export default Mapa_Simulacion;