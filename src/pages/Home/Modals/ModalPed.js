import React, {useState, useEffect} from "react";
import { Typography, Button, Grid, TextField, CircularProgress, Box, Autocomplete } from '@mui/material';


import { format } from 'date-fns';
import CustomizedInputs from "../../../components/utils/CustomizedInputs";
import CiudadService from '../../../services/ciudadService.js'
import PedidoService from '../../../services/pedidoService.js'

import SaveAltIcon from '@mui/icons-material/SaveAlt';

import LZString from 'lz-string';


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

  function handleClick () {
    //Creamos el pedido
    var aux = new Date();
    //aux.setHours(aux.getHours() - 5);
    var ahora = aux.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const newPed = {
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

    PedidoService.insertPedido(newPed)
    .then(respPed => {
      //SE ENVIA AL BACK -> EL NUEVO PEDIDO RETORNA CON SU ID -> LUEGO EVALUAR SI LA CANTIDAD SOBREPASA DE LOS CAMIONES PARA HACER PEDIDOS PARCIALES -> ESTADO DEL PEDIDO ORIGINAL = 3 - ID=1 -- DE LOS PARCIALES ESTADO = 1 ID_PADRE = 
      if(respPed) {
        setPedidos(pedidos => [...pedidos, respPed]);
        setOpenPopup(false);
      }
    });
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
            renderInput={(params) => <TextField {...params} label="Controllable" />}
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