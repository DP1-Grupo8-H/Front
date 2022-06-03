import { FETCH_ALL, FETCH_CIUDAD} from '../constants/action_ciudad';

export default (state = [] ,action) => {
  switch (action.type) {
    case FETCH_ALL:
      return action.payload;
    case FETCH_CIUDAD:
      return {...state, topic: action.payload.ciudad};  //La carga retornada - []
    default:
      return state;
  }
} 