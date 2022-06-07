import React, {useState} from "react";
import { Typography, Button, Grid } from '@mui/material';

import DataExtractor from './DataExtractor';

export default function EliminarCursos({setOpenPopup, setData}){
  const [myFile, setMyFile] = useState(null);
  const [myFileName, setMyFileName] = useState(null);

  const dataLoader = async () => {
    let allLines = myFile.split(/\r?\n|\r/);
    const results_prev = allLines.filter(element => {
      return element !== '';
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
    // for(let lines = 0; lines < results.length; lines++){
    //   const line = results[lines].split(/[\\s,:= ]+/); //6 values in string
      
    //   const pedido = await DataExtractor.dataExtractor(line, lines+1, myFileName);
    //   pedidos.push(pedido);
    // }
    await setData(datasets);
    setOpenPopup(false);
    /*Funciontality -- for prev recurses*/
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
        <></>
      }
    </Grid>
    )
} 