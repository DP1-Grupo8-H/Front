import * as api from '../api';
import { FETCH_CIUDAD, FETCH_ALL} from '../constants/action_ciudad';

export const getCiudad = (id) => async (dispatch) => {
  try {
    const { data } = await api.fetchCiudad(id);

    dispatch( { type: FETCH_CIUDAD, payload: { Ciudad: data } } );
  } catch (error) {
    console.log(error);
  }
} 

export const getCiudades = () => async (dispatch) => {
  try {
    const { data } = await api.fetchCiudades();

    dispatch( { type: FETCH_ALL, payload: { Ciudad: data } } );
  } catch (error) {
    console.log(error);
  }
}