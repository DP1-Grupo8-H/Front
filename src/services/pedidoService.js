import axios from 'axios';


const url = 'http://localhost:8000';
//const url = 'http://localhost:8000';

const getPedidos = async () => {
  try{
    const request = await axios.get(`${url}/pedido/listar/`);

    return request.data;  
  }catch(exception){
    console.error(exception);
  }
}

const getActualPedidos = async (date) => {
  try{
    const request = await axios.get(`${url}/pedido/listarActual/${date}`);

    return request.data;  
  }catch(exception){
    console.error(exception);
  }
}

const insertPedido = async (object) => {
  try{
    console.log(object);
    const request = await axios.post(`${url}/pedido/insertar/`, object);

    return request.data;  
  }catch(exception){
    console.error(exception);
  }
}

export default { getPedidos,getActualPedidos,insertPedido }