import axios from 'axios';
import { format } from 'date-fns';

const url = 'http://localhost:8080';
//const url = 'https://teamwork-api-softbrilliance.herokuapp.com';

const simSemanal = async (pedidos, camiones, hora_simulacion) => {
  // console.log("Hola soy el inicio");
  // console.log(hora_simulacion);
  for(const d of pedidos){
    //console.log(d.fecha_registro.toString() + "===" + new Date(d.fecha_registro).toString());
    if(d.fecha_registro.toString()===new Date(d.fecha_registro).toString()){
    d.fecha_registro = format(d.fecha_registro, 'yyyy-MM-dd hh:mm:ss')
    d.fecha_entrega_max = format(d.fecha_entrega_max, 'yyyy-MM-dd hh:mm:ss')
    }
    else{
      continue;
    }
  }
  hora_simulacion = format(hora_simulacion, 'yyyy-MM-dd hh:mm:ss')
  
  try{
    const request = await axios.post(`${url}/algoritmo/simulacionSemana/`, {pedidos, camiones, hora_simulacion});
    // console.log("Llegue a entregar el servicio");
    // console.log(request.data);
    return request.data;  
  }catch(exception){
    console.error(exception);
  }
}


export default { simSemanal }