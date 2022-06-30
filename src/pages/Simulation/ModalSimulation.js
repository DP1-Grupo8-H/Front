import React, {useState} from "react";
import { Typography, Button, Grid, TextField, CircularProgress } from '@mui/material';

import DataExtractor from './DataExtractor';
import CustomizedInputs from "../../components/utils/CustomizedInputs";

import { format } from 'date-fns';

export default function EliminarCursos({setOpenPopup, setData,setFechaActual}){
  const [myFile, setMyFile] = useState(null);
  const [simData, setSimData] = 
    useState({ini: '', fin: '', cant: '', data: []});
    
  const dataLoader = async (myFile, myFileName) => {
    let allLines = myFile.split(/\r?\n|\r/);
    console.log("LLEGAMOS");
    
    //Delimitacion de los datos que

    //Filtramos la ultima linea
    if(allLines.slice(-1) === '') allLines.pop();

    //Comenzamos a leer a partir del dia actual y hasta 7 dias.
    let currentDate = new Date();
    currentDate.setDate(1);
    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);
    const results = allLines.filter(result => {
      const data = result.slice(0,2);
      return (data >= currentDate.getDate() && data < currentDate.getDate() + 8);
    });

    let i = 0;

    let datasets = await Promise.all (results.map(async (lines) => {
      const line = lines.split(/[\\s,:= ]+/); //6 values in string
      
      const pedido = DataExtractor.dataExtractor(line, i+1, myFileName);
      i++;

      return pedido;
    }));
    

    //Data set --> for simulation
    let futureDate = new Date(currentDate)
    futureDate.setDate(futureDate.getDate()+7)
    await setFechaActual(new Date(currentDate));
    currentDate = format(currentDate, 'yyyy-MM-dd hh:mm:ss')
    futureDate = format(futureDate, 'yyyy-MM-dd hh:mm:ss')

    const sim = { ini: currentDate, fin: futureDate, cant: i+1, data: datasets };
    
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
      dataLoader(fileReader.result, file.name.split(".")[1]);
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
      { (myFile !== null && simData.cant > 0) ?
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
          <Grid item xs = {1.8} sm = {1.8} align = "right">
            < Typography variant="body1_bold" mb={2} fontFamily = "Roboto">
                Fecha fin:
            </Typography>
          </Grid>
          <Grid item xs = {3} sm = {3} align = "left" >
            <CustomizedInputs value = {simData.fin} readOnly = "true"/>
          </Grid>
          <Grid item xs = {1.8} sm = {1.8} align = "right">
            < Typography variant="body1_bold" mb={2} fontFamily = "Roboto">
                Pedidos:
            </Typography>
          </Grid>
          <Grid item xs = {0.7} sm = {0.7} align = "left" >
            <CustomizedInputs value = {simData.cant} readOnly = "true"/>
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