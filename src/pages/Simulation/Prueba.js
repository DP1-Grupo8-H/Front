// import '../App.css';
import { MapContainer, TileLayer, useMap,Marker,Popup, Polyline,Tooltip} from 'react-leaflet';
import ReactLeafletDriftMarker  from "react-leaflet-drift-marker";
import { Component } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import { width } from '@mui/system';

const position1 = [-9.880358501459673, -74.46566630628085];
const position2 = [-3.586306117836121, -80.41144843770009];
const position3 = [-8.474110507351497, -74.82935154356059];
const position4 = [-16.42723302628582, -71.66528915483397];
const position5 = [-5.63906,-78.5317];
const limeOptions = { color: 'black' ,weight:0.3,opacity:0.5};
// Primero es el origen y luego el destino
const polyline1 = [
  [-12.13166084108361, -76.98237622750722],
  [-3.586306117836121, -80.41144843770009]
];
const polyline2 = [
  [-12.13166084108361, -76.98237622750722],
  [-8.474110507351497, -74.82935154356059]
];
const polyline3 = [
  [-3.586306117836121, -80.41144843770009],
  [-8.474110507351497, -74.82935154356059]
];
const polyline4 = [
  [-12.13166084108361, -76.98237622750722],
  [-16.42723302628582, -71.66528915483397]
];

const L = require('leaflet');

const myIcon = L.icon({
    iconUrl:  require('../../archives/circle-16.png'),
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


var pos = [-12.13166084108361, -76.98237622750722];
class Prueba extends Component{
  constructor(props){
    super(props);
    this.Mover1 = this.Mover1.bind(this);
    this.Mover2 = this.Mover2.bind(this);
    this.Mover3 = this.Mover3.bind(this);
    this.Mover4 = this.Mover4.bind(this);
    this.Acelerarx2 = this.Acelerarx2.bind(this);
    this.Marker1 = React.createRef();
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
    idxCamiones : 0
  };
  componentDidMount(){
    this.state.camionesRefs = new Array(80);
    for(let i = 0;i<this.state.length;i++){
      this.state.camionesRefs[i] = React.createRef();
    }
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
         this.setState({aux:data})    
       }
     );
  }
    Mover1(){
     this.setState({latlng:[-8.474110507351497, -74.82935154356059]});
     this.setState({latlng2:[-3.586306117836121, -80.41144843770009]});
     this.setState({latlng3:[-16.42723302628582, -71.66528915483397]});
    }
    Mover2(){
      this.setState({latlng:[-12.13166084108361, -76.98237622750722]});
      this.setState({latlng2:[-12.13166084108361, -76.98237622750722]});
     this.setState({latlng3:[-12.13166084108361, -76.98237622750722]});
     }
     Mover3(){
      this.setState({latlng:[-3.586306117836121, -80.41144843770009]});
     }
     Mover4(){
      this.setState({latlng:[-16.42723302628582, -71.66528915483397]});
     }
     Acelerarx2(){
      console.log(this.Marker1.current);
      var a = this.state.duracion/2;
      this.setState({duracion:a});
      this.setState({latlng:[-8.474110507351497, -74.82935154356059]});
       this.setState({latlng2:[-3.586306117836121, -80.41144843770009]});
     this.setState({latlng3:[-16.42723302628582, -71.66528915483397]});
     }
 render(){
  return (
    <MapContainer center={position1} zoom={6} scrollWheelZoom={true} >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {/* <div style={{position:'relative',zIndex:9999,float:'right'}}>
      <button style={{width:"45px",height:"30px"}}>Stop</button>
      <button style={{width:"45px",height:"30px"}}>Start</button>
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

  {(
       this.state.tramos?.map((tramo)=>(
        <Polyline pathOptions={limeOptions} positions={[[tramo.ciudad_origen.latitud,tramo.ciudad_origen.longitud]
          ,[tramo.ciudad_destino.latitud,tramo.ciudad_destino.longitud]]}/>       
       ))
     )
    }

   {(
       this.state.camiones?.map((camion)=>(
        <ReactLeafletDriftMarker  icon={myIcon}
            position={[camion.almacen.latitud,camion.almacen.longitud]}
            duration={10}
            keepAtCenter={false} ref={this.state.camionesRefs[camion.id]}/>  
       ))
     )
    }

    {/* <Marker position={position1} eventHandlers={{ click: this.Mover2 }} ref={this.Marker1}>

    </Marker>
    <Marker position={position2} eventHandlers={{ click: this.Mover3 }}>

    </Marker>
    <Marker position={position3} eventHandlers={{ click: this.Mover1 }}>
    </Marker>
    <Marker position={position4} eventHandlers={{ click: this.Mover4 }}>
    </Marker> */}
    {/* <ReactLeafletDriftMarker  icon={myIcon}
            position={this.state.latlng}
            duration={this.state.duracion}
            keepAtCenter={false}
          >
    </ReactLeafletDriftMarker >
    <ReactLeafletDriftMarker  icon={myIcon}
            position={this.state.latlng2}
            duration={this.state.duracion}
            keepAtCenter={false}
          >
    </ReactLeafletDriftMarker >
    <ReactLeafletDriftMarker  icon={myIcon}
            position={this.state.latlng3}
            duration={this.state.duracion}
            keepAtCenter={false}
          >
    </ReactLeafletDriftMarker > */}
    {/* <Polyline pathOptions={limeOptions} positions={polyline1}/>
    <Polyline pathOptions={limeOptions} positions={polyline2}/>
    <Polyline pathOptions={limeOptions} positions={polyline3}/>
    <Polyline pathOptions={limeOptions} positions={polyline4}/> */}
  </MapContainer>
  
  );
 }
}
export default Prueba;