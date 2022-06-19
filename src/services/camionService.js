import axios from 'axios';


const url = 'http://localhost:8080';
//const url = 'https://teamwork-api-softbrilliance.herokuapp.com';

const getCamiones = async () => {
  try{
    const request = await axios.get(`${url}/camion/listar/`);

    return request.data;  
  }catch(exception){
    console.error(exception);
  }
}

const getCamion = async (id) => {
  try{
    const request = await axios.get(`${url}/ciudad/listar/${id}`);

    return request.data;  
  }catch(exception){
    console.error(exception);
  }
}

export default { getCamiones, getCamion }