import axios from 'axios';
import { format } from 'date-fns';

const url = 'http://inf226g8.inf.pucp.edu.pe:8000';
//const url = 'http://inf226g8.inf.pucp.edu.pe:8000';

const simSemanal = async (pedidos, camiones, hora_simulacion) => {
  console.log("Hola soy el inicio:", pedidos, camiones, hora_simulacion);
  var aux;
  for(const d of pedidos){
    //console.log(d.fecha_registro.toString() + "===" + new Date(d.fecha_registro).toString());
    if(d.fecha_registro.toString()===new Date(d.fecha_registro).toString()){
    //d.fecha_registro = format(d.fecha_registro, 'yyyy-MM-dd hh:mm:ss')
      aux = new Date( d.fecha_registro);
      aux.setHours(aux.getHours() - 5);
      d.fecha_registro = aux.toISOString().replace(/T/, ' ').replace(/\..+/, ''); 
      aux = new Date(d.fecha_entrega_max);
      aux.setHours(aux.getHours() - 5);
      d.fecha_entrega_max = aux.toISOString().replace(/T/, ' ').replace(/\..+/, ''); 
    //d.fecha_entrega_max = format(d.fecha_entrega_max, 'yyyy-MM-dd hh:mm:ss')
    }
    else{
      continue;
    }
  }
  //hora_simulacion = format(hora_simulacion, 'yyyy-MM-dd hh:mm:ss')
  aux = new Date(hora_simulacion);
  aux.setHours(aux.getHours() - 5);
  hora_simulacion = aux.toISOString().replace(/T/, ' ').replace(/\..+/, ''); 
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