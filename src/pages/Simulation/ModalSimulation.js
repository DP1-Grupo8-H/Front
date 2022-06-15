import React, {useState} from "react";
import { Typography, Button, Grid } from '@mui/material';

import DataExtractor from './DataExtractor';

export default function EliminarCursos({setOpenPopup, setData}){
  const [myFile, setMyFile] = useState(null);
  const [myFileName, setMyFileName] = useState(null);

  const dataLoader = async () => {
    let allLines = myFile.split(/\r?\n|\r/);
    
    //Delimitacion de los datos que

    //Filtramos la ultima linea
    if(allLines.slice(-1) === '') allLines.pop();

    //Comenzamos a leer a partir del dia actual y hasta 7 dias.
    const currentDate = new Date();
    currentDate.setDate(1);
    currentDate.setHours(0);
    currentDate.setMinutes(0);
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
    await setData(datasets);
    setOpenPopup(false);
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