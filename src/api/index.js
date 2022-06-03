import axios from 'axios';

const url = ''; //Point -> back

//Bearer para authentification si es necesario - Implementacion OAuth

//OBTENCION DE DATOS
export const fetchCiudad = (id) => axios.get(`${url}/ciudades/${id}`);
export const fetchCiudades = () => axios.get(`${url}/ciudades`);