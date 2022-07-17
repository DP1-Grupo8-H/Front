import axios from 'axios';


const url = 'http://localhost:8000';
//const url = 'http://inf226g8.inf.pucp.edu.pe:8000';

const getCiudades = async () => {
  try{
    const request = await axios.get(`${url}/ciudad/listar/`);
    console.log(request.data);
    return request.data;  
  }catch(exception){
    console.error(exception);
  }
}

const getCiudad = async (id) => {
  try{
    const request = await axios.get(`${url}/ciudad/listar/${id}`);

    return request.data;  
  }catch(exception){
    console.error(exception);
  }
}

export default { getCiudades, getCiudad }