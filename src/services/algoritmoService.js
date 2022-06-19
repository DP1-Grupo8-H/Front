import axios from 'axios';
import { format } from 'date-fns';

const url = 'http://localhost:8080';
//const url = 'https://teamwork-api-softbrilliance.herokuapp.com';

const testAlgorithm = async (data) => {
  for(const d of data){
    d.fecha_registro = format(d.fecha_registro, 'yyyy-MM-dd hh:mm:ss')
    d.fecha_entrega_max = format(d.fecha_entrega_max, 'yyyy-MM-dd hh:mm:ss')
  }
  try{
    const request = await axios.post(`${url}/algoritmo/simulacion/`, data);
    // console.log(request.data);
    return request.data;  
  }catch(exception){
    console.error(exception);
  }
}


export default { testAlgorithm }