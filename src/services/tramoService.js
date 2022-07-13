import axios from 'axios';


const url = 'http://localhost:8000';
//const url = 'http://localhost:8000';

const getTramos = async () => {
  try{
    const request = await axios.get(`${url}/tramo/listar/`);

    return request.data;  
  }catch(exception){
    console.error(exception);
  }
}

export default { getTramos }