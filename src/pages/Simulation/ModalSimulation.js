import React, {useState} from "react";
<<<<<<< Updated upstream
import { Typography, Button, Grid } from '@mui/material';
=======
import { Typography, Button, Grid, TextField, CircularProgress } from '@mui/material';
>>>>>>> Stashed changes

import DataExtractor from './DataExtractor';

export default function EliminarCursos({setOpenPopup, setData,setFechaActual}){
  const [myFile, setMyFile] = useState(null);
  const [myFileName, setMyFileName] = useState(null);

<<<<<<< Updated upstream
  const dataLoader = async () => {
    let allLines = myFile.split(/\r?\n|\r/);
    const results_prev = allLines.filter(element => {
      return element !== '';
=======
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
>>>>>>> Stashed changes
    });

    const results = results_prev.filter(result => {
      return parseInt(result.slice(0,2)) < 8;
    });
    let i = 0;

    let datasets = await Promise.all (results.map(async (lines) => {
      const line = lines.split(/[\\s,:= ]+/); //6 values in string
      
      const pedido = DataExtractor.dataExtractor(line, i+1, myFileName);
      i++;

      return pedido;
    }));
<<<<<<< Updated upstream
    // for(let lines = 0; lines < results.length; lines++){
    //   const line = results[lines].split(/[\\s,:= ]+/); //6 values in string
      
    //   const pedido = await DataExtractor.dataExtractor(line, lines+1, myFileName);
    //   pedidos.push(pedido);
    // }
    await setData(datasets);
    setOpenPopup(false);
    /*Funciontality -- for prev recurses*/
=======
    

    //Data set --> for simulation
    let futureDate = new Date(currentDate)
    futureDate.setDate(futureDate.getDate()+7)
    await setFechaActual(new Date(currentDate));
    currentDate = format(currentDate, 'yyyy-MM-dd hh:mm:ss')
    futureDate = format(futureDate, 'yyyy-MM-dd hh:mm:ss')

    const sim = { ini: currentDate, fin: futureDate, cant: i+1, data: datasets };
    
    await setSimData(simData => ({...simData, ...sim}));
>>>>>>> Stashed changes
  }

  const readFile = e => {
    const file = e.target.files[0];
    if( !file) return;

    if(file.type !== 'text/plain') return;

    const fileReader = new FileReader();

    fileReader.readAsText( file );
    fileReader.onload = () => {
      setMyFile(fileReader.result);
      const name = file.name.split(".")[1];
      setMyFileName(name);
    }

    fileReader.onerror = () => {
      console.log( fileReader.error );
    }
  }

  return(
    <Grid container  >
      <Grid item xs = {12} sm = {4} align = "right" marginTop = {3} marginRight = {2}>    
        < Typography variant="h6" mb={2} >
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
      { myFile !== null ?
        <Grid item xs = {12} sm = {12} align = "center" marginTop = {3}>
          <Button variant = "contained" color = "primary" size = "large" type = "submit" fullWidth onClick = {dataLoader}> Iniciar Simulación </Button>
        </Grid>
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