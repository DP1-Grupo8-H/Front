import React, {useState} from "react";
import { Typography, Button, Grid, TextField, CircularProgress } from '@mui/material';

import DataExtractor from '../DataExtractor';
import CustomizedInputs from "../../../components/utils/CustomizedInputs";
import CiudadService from '../../../services/ciudadService.js'

import { format } from 'date-fns';

export default function EliminarCursos({setOpenPopup, setData,setFechaActual}){
  const [myFile, setMyFile] = useState(null);
  const [simData, setSimData] = 
    useState({ini: '', fin: '', cant: '', data: []});
    
  const dataLoader = async (myFile) => {
    let allLines = myFile.split(/\r?\n|\r/);
    console.log("LLEGAMOS");
    
    //Delimitacion de los datos que

    //Filtramos la ultima linea
    if(allLines.slice(-1) === '') allLines.pop();

    //Comenzamos a leer a partir del dia actual y hasta 7 dias.
    let currentDate = new Date();
    // currentDate.setDate(1);
    // currentDate.setHours(0);
    // currentDate.setMinutes(0);
    currentDate.setSeconds(0);

    let i = 0;
    const ciudades = await CiudadService.getCiudades();
    let year = '',  month = '';
    let datasets = await Promise.all (allLines.map(async (lines) => {
      const line = lines.split(/[\\s,:= ]+/); //6 values in string
      let pedido = null;
      if(line[0].includes("VENTAS")){
        year = line[0].slice(6,-2);
        month = line[0].slice(-2);
      }
      else{
        if(year == '2022' && month == '07'){
          //Continue if the value is not in the range of the current Date
          const lineDate = new Date();
          lineDate.setFullYear(parseInt(year));
          lineDate.setMonth(parseInt(month)-1);
          lineDate.setDate(parseInt(line[0]));
          lineDate.setHours(parseInt(line[1]));
          lineDate.setMinutes(parseInt(line[2]));
          lineDate.setSeconds(0);

          if(lineDate >= currentDate){
            pedido = DataExtractor.dataExtractor(line, i+1, ciudades, year, month);
            i++;
          }
        }
        else{
          pedido = DataExtractor.dataExtractor(line, i+1, ciudades, year, month);
          i++;
        }
      }
      return pedido;
    }));
    
    const results_2 = datasets.filter(result => {
      return (result !== null);
    });
    
    console.log(results_2);
    //Data set --> for simulation
    await setFechaActual(new Date(currentDate));
    currentDate = format(currentDate, 'yyyy-MM-dd hh:mm:ss')

    const sim = { ini: currentDate, cant: i, data: results_2 };
    
    await setSimData(simData => ({...simData, ...sim}));
  }

  const readFile =  e => {
    const file = e.target.files[0];
    if( !file) return;

    if(file.type !== 'text/plain') return;

    const fileReader = new FileReader();

    fileReader.readAsText( file );
    fileReader.onload = async () => {
      await setMyFile(fileReader.result);
      dataLoader(fileReader.result);
    }

    fileReader.onerror = () => {
      console.log( fileReader.error );
    }
  }

  const handleClick = async e => {
    await setData(simData.data);
    setOpenPopup(false);
  }

  return(
    <Grid container  >
      <Grid item xs = {12} sm = {4} align = "right" marginTop = {3} marginRight = {2}>    
        < Typography variant="b1" mb={2} >
            Ingrese el archivo de pedidos:
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
      { (myFile !== null && simData.ini !== '') ?
        <>
        <Grid container padding= "20px 0px 0px 0px" alignItems = "center">
          <Grid item xs = {1.3} sm = {1.3} align = "right">
            < Typography variant="body1_bold" mb={2} fontFamily = "Roboto">
                Fecha inicio:
            </Typography>
          </Grid>
          <Grid item xs = {3} sm = {3} align = "left" >
            <CustomizedInputs value = {simData.ini} readOnly = "true"/>
          </Grid>
        </Grid>
        <Grid item xs = {12} sm = {12} align = "center" marginTop = {3}>
          <Button variant = "contained" color = "primary" size = "large" type = "submit" fullWidth onClick = {handleClick}> <Typography variant = "button_max" > Iniciar Simulación </Typography></Button>
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