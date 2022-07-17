import React, {useState} from "react";
import { Typography, Button, Grid, TextField, CircularProgress, List, ListItem, ListItemText, ListItemButton, Box } from '@mui/material';
import Divider from '@mui/material/Divider';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';

import CustomizedInputs from "../../../components/utils/CustomizedInputs";
import CiudadService from '../../../services/ciudadService.js'
import PedidoService from '../../../services/pedidoService.js'

import { format } from 'date-fns';

import LZString from 'lz-string';

function isOverCharged (pedido) {
  //Funcion para evaluar si un pedido está sobrecargado de estos mismos.

  //console.log(pedido);
  let newPedidos = [];
  if(pedido.cantidad > 30){
    let cantPedidos = pedido.cantidad;
    while(1){
      let pedido1 = structuredClone(pedido);      pedido1.id_padre = pedido.id_pedido;      pedido1.estado = 1;       pedido1.id_pedido = undefined;
      //Le reducimos la cantidad del pedido a un MOD del promedio
      cantPedidos -= 30;
      if(cantPedidos >= 0) {
        pedido1.cantidad = 30;
        newPedidos.push(pedido1);//1 pedido
      }
      else{
        pedido1.cantidad = 30-cantPedidos;
        newPedidos.push(pedido1);//1 pedido
        break;
      }
    }
  }
  console.log(newPedidos);

  return newPedidos;
}


export default function ModalListaPed({setOpenPopup, setPedidos}){
  const [myFile, setMyFile] = useState(null);
  const [data, setData] = 
    useState({cant: '', data: []});
    
  const dataLoader = async (myFile, myFileName) => {
    let allLines = myFile.split(/\r?\n|\r/);
    
    //Delimitacion de los datos que

    //Filtramos la ultima linea
    if(allLines.slice(-1) === '') allLines.pop();

    let i = 0;
    const ciudades = await JSON.parse(LZString.decompress(window.localStorage.getItem("ciudades")));
    const currentDate =  new Date();//format(new Date(), 'yyyy-MM-dd hh:mm:ss');
    let datasets = await Promise.all (allLines.map(async (lines) => {
      const line = lines.split(/[\\s,:= ]+/); //3 values in string

      //DATA EXTRACTOR -- FOR PED

      const ciudad = await ciudades.find(c => {
        return (c.ubigeo === parseInt(line[0].trim()))
      })

      //Obtain the date   -- THIS NEEDS TO CHANGE -- TO A GLOBAL STATE
      const maxDate = new Date(currentDate);

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
      const newPed = {
          "id_padre": 0,
          "codigo": line[2].trim(),
          "fecha_registro": currentDate.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
          "fecha_entrega_max": maxDate.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
          "fecha_entrega": null,
          "cliente": 1,
          "cantidad": parseInt(line[1]),
          "ciudad": ciudad,
          "almacen": ciudad,
          "ruta": null,
          "estado": 1
      }
      i++;
      return newPed;
    }));

    const results_2 = datasets.filter(result => {
      return (result !== null);
    });

    //Data set --> for simulation
    const sim = { cant: i, data: results_2 };
    
    await setData(data => ({...data, ...sim}));
  }

  const readFile =  e => {
    const file = e.target.files[0];
    if( !file) return;

    if(file.type !== 'text/plain') return;

    const fileReader = new FileReader();

    fileReader.readAsText( file );
    fileReader.onload = async () => {
      await setMyFile(fileReader.result);
      dataLoader(fileReader.result, file.name.split(".")[1]);
    }

    fileReader.onerror = () => {
      console.log( fileReader.error );
    }
  }

  const handleClick = async e => {
    //CLICK WHEN FINISHED
    //preventDefault(e);
    let flag = 0;
    for(let newPed of data.data){
      //EVALUAMOS SI EL PEDIDO EXCEDE LA CANTIDAD
      console.log(newPed);
      if(newPed.cantidad > 30){  //HAY PARCIALES
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
    }
    setOpenPopup(false);
  }

  return(
    <Grid container  >
      <Grid item xs = {12} sm = {4} align = "right" marginTop = {3} marginRight = {2}>    
        < Typography variant="b1" mb={2} >
            Ingrese el archivo de nuevos pedidos:
        </Typography>
      </Grid>
      <Grid item xs = {12} sm = {6} align = "left" marginTop = {3}>    
        <input type = 'file' multiple = {false} onChange = {readFile}>

        </input>
      </Grid>
      <Grid item xs = {12} sm = {12} align = "right" marginTop = {0} color = 'neutral.contrastText'>    
        < Typography variant="b2" mb={2} >
            El archivo de pedidos debe estar en el formato .txt
        </Typography>
      </Grid>

      { (myFile !== null && data.cant > 0) ?
        <>
        <Grid container padding= "20px 0px 0px 0px" alignItems = "center">
          <Grid item xs = {12} sm = {12} align = "center">
        <Box sx={{ display: 'flex' }}>
        <ThemeProvider
          theme={createTheme({
            components: {
              MuiListItemButton: {
                defaultProps: {
                  disableTouchRipple: true,
                },
              },
            },
            palette: {
              mode: 'dark',
              primary: { main: 'rgb(102, 157, 246)' },
              background: { paper: 'rgb(5, 30, 52)' },
            },
          })}
          ></ThemeProvider>

          <List
            sx={{
              width: '100%',
              maxWidth: 'auto',
              margin: '0rem 1rem 0rem 1rem',
              bgcolor: 'neutral.main',
              position: 'relative',
              overflow: 'auto',
              maxHeight: 200,
              '& ul': { padding: 0 },
            }}
          >
          {data.data.map((item) => (
                  <ListItemButton
                    key={item.codigo}
                    sx={{ py: 0, minHeight: 32, color: 'primary.main' }}
                  > 
                    <ListItemText
                      primary={`CODIGO-${item.codigo}          Cantidad:${item.cantidad}     ->     Oficina: ${item.ciudad.ciudad}`}
                      primaryTypographyProps={{ fontSize: 16, fontWeight: 'medium' }}
                      />
                  </ListItemButton>
                  
          ))}
          </List>
        </Box>
          </Grid>
          <Grid item xs = {8.6} sm = {8.6} align = "right"></Grid>
          <Grid item xs = {1.8} sm = {1.8} align = "right">
            < Typography variant="body1_bold" mb={2} fontFamily = "Roboto">
                # Pedidos:
            </Typography>
          </Grid>
          <Grid item xs = {0.7} sm = {0.7} align = "left" >
            <CustomizedInputs value = {data.cant} readOnly = "true"/>
          </Grid>
        </Grid>
        <Grid item xs = {12} sm = {12} align = "center" marginTop = {3}>
          <Button variant = "contained" color = "primary" size = "large" type = "submit" fullWidth onClick = {handleClick}> <Typography variant = "button_max" > Guardar Pedidos </Typography></Button>
        </Grid>
        </>
        :
        <>
        {(myFile !== null) && 
        <Grid item xs = {12} sm = {12} align = "center" >
            <CircularProgress />
        </Grid>
        }
        </>
      }
    </Grid>
    )
} 