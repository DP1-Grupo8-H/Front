import axios from 'axios';


const url = 'http://localhost:8080';
//const url = 'https://teamwork-api-softbrilliance.herokuapp.com';

const getCiudades = async () => {
  try{
    const request = await axios.get(`${url}/ciudad/listar/`);

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