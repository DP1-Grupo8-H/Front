import React, {useState, useEffect} from "react";
import { Typography, Button, Grid, TextField, CircularProgress, Box, Autocomplete } from '@mui/material';


import { format } from 'date-fns';
import CustomizedInputs from "../../../components/utils/CustomizedInputs";
import CiudadService from '../../../services/ciudadService.js'
import PedidoService from '../../../services/pedidoService.js'

import SaveAltIcon from '@mui/icons-material/SaveAlt';

import LZString from 'lz-string';

function isOverCharged (pedido) {
  //Funcion para evaluar si un pedido está sobrecargado de estos mismos.

  //console.log(pedido);
  let newPedidos = [];
  if(pedido.cantidad > 90){
    let cantPedidos = pedido.cantidad;
    while(1){
      let pedido1 = structuredClone(pedido);    pedido1.id_padre=pedido.id_pedido;     pedido1.estado = 1;       pedido1.id_pedido = undefined;
      //Le reducimos la cantidad del pedido a un MOD del promedio
      cantPedidos -= 30;
      if(cantPedidos >= 0) {
        pedido1.cantidad = 30;
        newPedidos.push(pedido1);//1 pedido
      }
      else{
        pedido1.cantidad = 30+cantPedidos;
        newPedidos.push(pedido1);//1 pedido
        break;
      }
    }
  }

  return newPedidos;
}

export default function ModalPed({setOpenPopup, setPedidos}){
  const [ped, setPed] = useState({codigo: '', cantidad: '', ciudad: ''});
  const [ciudades, setCiudades] = useState([]);

  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');

  useEffect(() => {
    const ciud = JSON.parse(LZString.decompress(window.localStorage.getItem("ciudades")))
      ciud.forEach(ciudad => {
        setCiudades(ciudades=>[...ciudades,{
          'label': `${ciudad.ubigeo}    ${ciudad.departamento}, ${ciudad.ciudad}`,
          'ciudad': ciudad,
        }])
      })
  }, []);

  useEffect(()=>{
    value && setPed({ ...ped,  ciudad: value.ciudad })
  }, [value])

  function hallarfechaEntrMax(fecha, ciudad){
    let maxDate = new Date(fecha);

    switch (ciudad.region){
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
    //maxDate = format(maxDate, 'yyyy-MM-dd hh:mm:ss');
    var aux = new Date(maxDate);
    //aux.setHours(aux.getHours() - 5);
    var ahora = aux.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    return ahora;
  }

  const handleClick = async e => {
    //Creamos el pedido
    var aux = new Date();
    //aux.setHours(aux.getHours() - 5);
    var ahora = aux.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    let newPed = {
        "id_padre": 0,
        "codigo": ped.codigo,
        "fecha_registro": ahora,
        "fecha_entrega_max": hallarfechaEntrMax(new Date(), ped.ciudad),
        "fecha_entrega": null,
        "cliente": 1,
        "cantidad": ped.cantidad,
        "ciudad": ped.ciudad,
        "almacen": ped.ciudad,
        "ruta": null,
        "estado": 1
    }
    //EVALUAMOS SI EL PEDIDO EXCEDE LA CANTIDAD
    let flag = 0;
    if(newPed.cantidad > 90){  //HAY PARCIALES
      newPed = { ...newPed,  estado: 3 };
      const respNewPed = await PedidoService.insertPedido(newPed)
      setPedidos(pedidos => [...pedidos, respNewPed]);
      
      const newPedidos = await isOverCharged(respNewPed);
      for(let newParcial of newPedidos){
        const respPed = await PedidoService.insertPedido(newParcial)
        if(respPed) {
          setPedidos(pedidos => [...pedidos, respPed]);
        }
        else{
          flag = 1;
          break;
        }
      }
    }
    else{ //NO HAY PARCIALES
      const respPed = await PedidoService.insertPedido(newPed)
      if(respPed) {
        setPedidos(pedidos => [...pedidos, respPed]);
      }
      else{
        flag = 1;
      }
    }

    setOpenPopup(false);
  }

  return(
   <>
      <Grid container padding= "5px 0px 0px 0px" alignItems = "center">
        <Grid item xs = {12} sm = {12} align = "left" marginBottom = {'1rem'}>
        < Typography variant="b2" mb={2} fontFamily = "Roboto">
          llenar los campos para poder agregar un nuevo pedido.
        </Typography>
        </Grid>
        <Grid item xs = {2} sm = {2} align = "left">
          < Typography variant="body1_bold" mb={2} fontFamily = "Roboto">
              Código:
          </Typography>
        </Grid>
        <Grid item xs = {3} sm = {3} align = "left" >
          <CustomizedInputs value = {ped.codigo} label = "Codigo" readOnly = "false" onChange = {(e) => setPed({ ...ped,  codigo: e.target.value })}/>
        </Grid>
        <Grid item xs = {2} sm = {2} align = "left"></Grid>
        <Grid item xs = {2} sm = {2} align = "left">
          < Typography variant="body1_bold" mb={2} fontFamily = "Roboto">
              Cantidad:
          </Typography>
        </Grid>
        <Grid item xs = {3} sm = {3} align = "left" >
          <CustomizedInputs value = {ped.cantidad} label = "Cantidad" readOnly = "false" onChange = {(e) => setPed({ ...ped,  cantidad: e.target.value })}/>
        </Grid>
        <Grid item xs = {12} sm = {12} align = "left" paddingTop = {'1rem'}>
          < Typography variant="body1_bold" mb={2} fontFamily = "Roboto">
              Oficina de Recojo:
          </Typography>
        </Grid>
        { ciudades.length > 0 ?
          <Grid item xs = {12} sm = {12} align = "center" marginBottom = "1rem" paddingTop = {'1rem'}>
          <Autocomplete
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            sx = {{zIndex : 9999}}
            id="controllable-states-demo"
            options={ciudades}
            renderInput={(params) => <TextField {...params} label="Seleccionar oficina" />}
            disablePortal
            hover={true}
          />
          </Grid>
          :
          <Grid item xs = {12} sm = {12} align = "center" >
              <CircularProgress />
          </Grid>
        }
        <Grid item xs = {12} sm = {12} align = "right" >
          <Button variant = "contained" color = "primary" size = "large" type = "submit"  onClick = {handleClick}> 
            <Typography variant = "button_max" > Guardar </Typography>
            <SaveAltIcon sx={{ fontSize: 30, color:'primary' }}/>
          </Button>
        </Grid>
      </Grid>
    </>
  );
}