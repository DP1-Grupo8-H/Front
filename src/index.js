//Archivo donde conectaremos nuestro React app to index.html
import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
 
//-------Aqui vamos a inicializar REDUX-------//
// import { Provider } from 'react-redux';

// import { createStore, applyMiddleware, compose } from 'redux';
// import thunk from 'redux-thunk';

// import reducers from './reducers';
import './index.css';
import App from './App';

//const store = createStore(reducers, compose(applyMiddleware(thunk)));

//Tenemos que actualizar la aplicacion para usar REDUX
ReactDOM.render(<App />, document.getElementById('root'));
// ReactDOM.render(
//   <Provider store = {store}>
//     <App />
//   </Provider>, document.getElementById('root'));