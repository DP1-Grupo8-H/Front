import React, {useState, useEffect} from "react";
import Popup from '../../components/utils/Popup';
import { Box, Typography, Button, Grid, TextField, CircularProgress } from '@mui/material';
import { MapContainer, TileLayer, useMap,Marker, Polyline,Tooltip} from 'react-leaflet';
import ReactLeafletDriftMarker  from "react-leaflet-drift-marker";
import './App.css';
import LegendMapa from "../../components/Legend/Legend_Mapa";
import ResumeMapa from "../../components/Resume/Resume_Mapa";
import ModalListaPed from './Modals/ModalListaPed.js'
import ModalPed from './Modals/ModalPed.js'
import { Component } from 'react';
import BallotIcon from '@mui/icons-material/Ballot';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Home = () => {
  //USO DE PARÁMETROS
  //const data = useRef(datos);

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

  const [openListaPed, setOpenListaPed] = useState(false);
  const [openPed, setOpenPed] = useState(false);

  const [pedidos, setPedidos] = useState([]);
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
    
  class Diario extends Component{
    constructor(props){
      super(props);
      this.llenarMovimientosInicial = this.llenarMovimientosInicial.bind(this);
      // this.ObtenerRutas = this.ObtenerRutas.bind(this);
      this.CargarData = this.CargarData.bind(this);
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
    };

   CargarData(){
    //CARGAR CUANDO INICIA EL MAPA POR PRIMERA VEZ
      fetch('http://localhost:8000/ciudad/listar')
      .then(response => response.json())
      .then(data => 
        {
          this.setState({ciudades:data})
          fetch('http://localhost:8000/tramo/listar')
          .then(response => response.json())
          .then(data => 
            {
              this.setState({tramos:data});
              fetch('http://localhost:8000/camion/listar')
              .then(response => response.json())
              .then(dat => 
                {
                  fetch('http://localhost:8000/mantenimiento/listar')
                    .then(response => response.json())
                    .then(data => 
                      {
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
                        console.log(ahora); 
                        fetch('http://localhost:8000/bloqueo/listarFront/' + ahora)
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
                                }
                                this.setState({tramos:auxi});
                                for(let i = 0;i<dat.length;i++){
                                  dat[i].lat = dat[i].almacen.latitud;
                                  dat[i].log = dat[i].almacen.longitud;
                                  dat[i].tiempo = 10;  
                                }
                                var aux = new Date();
                                aux.setHours(aux.getHours() - 5);
                                var ahora = aux.toISOString().replace(/T/, ' ').replace(/\..+/, '');
                                //console.log(ahora); 
                                fetch('http://localhost:8000/diario/cargarMapa/'+ahora)
                                .then(response => response.json())
                                .then(data => 
                                  {
                                  console.log(data);
                                  this.llenarMovimientosInicial(data.movimientos,dat);
                                  console.log(this.state.moviXCamion);
                                });
                              }
                        );
                    }
                  );
              }
              );
          });  
      });  
  }
  toRadians (degrees){
    if (degrees < 0) {
      degrees += 360;/*from w  w  w .  java2 s.c o m*/
    }
    return degrees / 180 * Math.PI;
  }

    toDegrees(radians)
    {
      var pi = Math.PI;
      return radians * (180/pi);
    }


  hallarPunto(b,a){
    var startLatMicroDeg = this.state.ciudades[a.id_ciudad.id-1].latitud;
    var startLonMicroDeg = this.state.ciudades[a.id_ciudad.id-1].longitud; 
    var endLatMicroDeg = this.state.ciudades[b.id_ciudad.id-1].latitud;
    var endLonMicroDeg =this.state.ciudades[b.id_ciudad.id-1].longitud;
    console.log(a);
    console.log(b);
    var ahora = new Date();
    var despues = new Date(b.fecha_llegada);
    var t = 0; // How much of the distance to use, from 0 through 1
    var alatRad=this.toRadians(startLatMicroDeg/1000000);
    var alonRad=this.toRadians(startLonMicroDeg/1000000);
    var blatRad=this.toRadians(endLatMicroDeg/1000000);
    var blonRad=this.toRadians(endLonMicroDeg/1000000);
    // Calculate distance in longitude
    var dlon=blonRad-alonRad;
    // Calculate common variables
    var alatRadSin=Math.sin(alatRad);
    var blatRadSin=Math.sin(blatRad);
    var alatRadCos=Math.cos(alatRad);
    var blatRadCos=Math.cos(blatRad);
    var dlonCos=Math.cos(dlon);
    // Find distance from A to B
    var distance=Math.acos(alatRadSin*blatRadSin +
                              alatRadCos*blatRadCos *
                              dlonCos);
    // Find bearing from A to B
    var bearing=Math.atan2(
        Math.sin(dlon) * blatRadCos,
        alatRadCos*blatRadSin -
        alatRadSin*blatRadCos*dlonCos);
    // Find new point
    var angularDistance=distance*t;
    var angDistSin=Math.sin(angularDistance);
    var angDistCos=Math.cos(angularDistance);
    var xlatRad = Math.asin( alatRadSin*angDistCos +
                                alatRadCos*angDistSin*Math.cos(bearing) );
    var xlonRad = alonRad + Math.atan2(
        Math.sin(bearing)*angDistSin*alatRadCos,
        angDistCos-alatRadSin*Math.sin(xlatRad));
    // Convert radians to microdegrees
    var xlat=this.toDegrees(xlatRad)*1000000;
    var xlon=this.toDegrees(xlonRad)*1000000;
    if(xlat>90000000)xlat=90000000;
    if(xlat<-90000000)xlat=-90000000;
    while(xlon>180000000)xlon-=360000000;
    while(xlon<=-180000000)xlon+=360000000;
    return {lat:xlat,log:xlon};
  }
  llenarMovimientos(movi){
    if(movi!=null){
      let inicial,final;
      for(let i =0;i<movi.length;i++){
        if(this.state.moviXCamion[i].length!=0){
          console.log("Inconsistencia, no modificar");
          continue;
        }
        inicial =  new Date(movi[i].ruta_ciudad[0].fecha_llegada);
          for(let j=1;j<movi[i].ruta_ciudad.length;j++){
            final =  new Date(movi[i].ruta_ciudad[j].fecha_llegada);
            var diff = (final.getTime() - inicial.getTime())/1000*200;
            this.state.moviXCamion[(movi[i].id_camion)-1].push({
              idCiudad: movi[i].ruta_ciudad[j].id_ciudad.id,
              tiempo: diff,
              inicial:movi[i].ruta_ciudad[0].fecha_llegada
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
                    let valores = this.hallarPunto(movi[i].ruta_ciudad[k-1],movi[i].ruta_ciudad[k]);
                    otro[(movi[i].id_camion)-1].lat = valores.lat;
                    otro[(movi[i].id_camion)-1].log = valores.log;
                    otro[(movi[i].id_camion)-1].tiempo = 10;
                    // this.state.camiones[(movi[i].id_camion)-1] = otro[(movi[i].id_camion)-1];
                    var ahora = new Date();
                    var ultimo = new Date(movi[i].ruta_ciudad[k].fecha_llegada);
                    var diff = (ultimo.getTime()-ahora.getTime())/1000*200;
                    this.state.moviXCamion[(movi[i].id_camion)-1].push({
                      idCiudad: movi[i].ruta_ciudad[k].id_ciudad.id,
                      tiempo: diff,
                      inicial:movi[i].ruta_ciudad[0].fecha_llegada
                  });
               }
              break;
            }   
          }

          var aaa = new Date(movi[i].ruta_ciudad[idx].fecha_llegada); 
          for(let j=idx+1;j<movi[i].ruta_ciudad.length;j++){
            final =  new Date(movi[i].ruta_ciudad[j].fecha_llegada);
            var diff = (final.getTime() - aaa.getTime())/1000*200;
            this.state.moviXCamion[(movi[i].id_camion)-1].push({
              idCiudad: movi[i].ruta_ciudad[j].id_ciudad.id,
              tiempo: diff,
              inicial:movi[i].ruta_ciudad[0].fecha_llegada
          });
          inicial  = final;
        }
      }
      this.setState({camiones:otro});
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
    fetch('http://localhost:8000/diario/cargarMapa/'+ahora)
      .then(response => response.json())
      .then(data => 
        {
        console.log(data);
        this.llenarMovimientos(data.movimientos);
        console.log(this.state.moviXCamion);
        fetch('http://localhost:8000/bloqueo/listarFront/' + ahora)
          .then(response => response.json())
          .then(data => 
            {
              //console.log(data);
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
         for (let i =0;i<this.state.moviXCamion[idx].length;i++){
          var nuevaCiudad = this.state.moviXCamion[idx][i];
          //Verificamos si nosotros hacemos el lag
          //console.log(nuevaCiudad);
           otro[idx].tiempo = nuevaCiudad.tiempo;
           otro[idx].lat = this.state.ciudades[nuevaCiudad.idCiudad-1].latitud;
           otro[idx].log = this.state.ciudades[nuevaCiudad.idCiudad-1].longitud;
          //this.state.camiones[idx] = otro[idx];
          const x = [
           ...this.state.camiones.slice(0,idx),
           otro[idx],   
           ...this.state.camiones.slice(idx+1,this.state.camiones.length)
          ]
          this.setState({camiones:x});
          await this.sleep(nuevaCiudad.tiempo*1000/200);
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

  
  render(){
    return (
        <div>
        <Grid container padding= "2rem" alignItems = "center">
          <Grid item xs = {12} sm = {12} align = "left" >
            < Typography variant="h4" mb={2} color = "primary.contrastText">
                Mapa de las Entregas en Tiempo Real
            </Typography>
          </Grid>
          <Grid item xs = {7.5} sm = {7.5} align = "left" >
            {/* MAPA DE LA SIMULACION */}
      <MapContainer center={position1} zoom={6} scrollWheelZoom={true} id="idMapita">
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
  
        {/* <div style={{position:'absolute',zIndex:9999,float:'left',bottom:0,width:"500px"}}>
           <Legend/>
        </div> */}
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
          </Grid>
          <Grid item xs = {4.5} sm = {4.5} align = "left" >
            {/* RESUMEN Y DETALLES */}
            <Grid container alignItems = "center">
              <Grid item xs = {12} sm = {12} align = "left" >
                <LegendMapa/>
              </Grid>
              <Grid item xs = {8} sm = {8} align = "left" >
                <ResumeMapa/>
              </Grid>
              <Grid item xs = {4} sm = {4} align = "left" >
                <Box sx={{  bgcolor: 'secondary_white.main',
                        m: 1,
                        margin: '0rem 0rem 1rem 1rem',
                        backgroundColor: 'neutral',
                        border: 1.5,
                        width: 'auto',
                        height: '14rem',borderColor: 'primary.contrastText', borderRadius: '16px ' }}>
                    <Grid container alignItems = "center">
                      <Grid item xs = {12} sm = {12} align = "left" marginTop = "2rem">
                        <Button variant = "contained" color = "secondary_white" size = "small" type = "submit" fullWidth onClick = {() => setOpenListaPed(true)}>
                          <Grid container alignItems = "center">
                            <Grid item xs = {4} sm = {4} align = "left" marginTop = "0rem">
                              <BallotIcon color = "primary" sx = {{paddingLeft: "0rem", 'vertical-align':'-0.7rem'}} />
                            </Grid>
                            <Grid item xs = {8} sm = {8} align = "left" marginTop = "0rem">
                            <Typography variant = "button_min" color = "primary" > 
                                Agregar Lista de Pedidos 
                            </Typography>
                            </Grid>
                          </Grid> 
                        </Button>
                      </Grid>
                      <Grid item xs = {12} sm = {12} align = "left" marginTop = "0.5rem">
                        <Button variant = "contained" color = "secondary_white" size = "small" type = "submit" fullWidth onClick = {() => setOpenPed(true)}> 
                          <Grid container alignItems = "center">
                            <Grid item xs = {4} sm = {4} align = "left" marginTop = "0rem">
                              <AddShoppingCartIcon color = "primary" sx = {{paddingLeft: "0rem", 'vertical-align':'-0.7rem'}} />
                            </Grid>
                            <Grid item xs = {8} sm = {8} align = "left" marginTop = "0rem">
                            <Typography variant = "button_min" color = "primary" > 
                                Agregar Pedidos 
                            </Typography>
                            </Grid>
                          </Grid>
                        </Button>
                      </Grid>
                    </Grid>
                </Box>
              </Grid>
              <Grid item xs = {12} sm = {12} align = "left" >
                <Box sx={{  bgcolor: 'secondary_white.main',
                        m: 1,
                        margin: '0rem 0rem 1rem 0rem',
                        backgroundColor: 'neutral',
                        border: 1.5,
                        width: 'auto',
                        overflowY: "scroll",
                        scrollbarColor: "#FFF6E7 #FFFFFF",
                        height: '26rem',borderColor: '#AFAFAF', borderRadius: '6px ' }}>
                  <Grid container alignItems = "center">
                  {pedidos.map((ped) => {
                    return(
                    <Grid item xs = {12} sm = {12} align = "left" marginTop = "0.25rem" marginBottom = "0.25rem">
                      <Button variant = "contained" color = "neutral" size = "small" sx={{height: '3rem'}} type = "submit" fullWidth onClick = {() => setOpenPed(true)}>
                        <Grid container alignItems = "center">
                          <Grid item xs = {8} sm = {8} align = "left" marginTop = "0rem">
                          <Typography variant = "button_min" color = "neutral" > 
                              {`PLAN DE TRANSPORTE | PEDIDO #${ped.id_pedido}`}
                          </Typography>
                          </Grid>
                          <Grid item xs = {4} sm = {4} align = "right" marginTop = "0rem">
                            <ArrowForwardIcon color = "neutral.contrastText" sx = {{paddingLeft: "0rem", 'vertical-align':'-0.5rem'}} />
                          </Grid>
                        </Grid> 
                      </Button>
                    </Grid>
                    );
                    })
                  }
                  </Grid>
                </Box>
            </Grid>
            </Grid>          
          </Grid>
        </Grid>
        <div>
          <Popup
            openPopup={openListaPed}
            setOpenPopup={setOpenListaPed}
            title="AGREGAR LISTA DE PEDIDOS"
            size="sm"
            >
            <ModalListaPed setOpenPopup = {setOpenListaPed} setPedidos = {setPedidos}/>
            </Popup>
            <Popup
            openPopup={openPed}
            setOpenPopup={setOpenPed}
            title="AGREGAR PEDIDOS"
            size="sm"
            >
            <ModalPed setOpenPopup = {setOpenPed} setPedidos = {setPedidos}/>
          </Popup>
        </div>
      </div>
    );
  }
  }
  return(
    <div>
      {flagOut === null&&<Diario/>}
    </div>
  );
}
export default Home;