//PARAMETROS PARA LA SIMULACIÓN A 7 DIAS, AL COLAPSO Y DIA a DIA
export const TA = 60; //En segundos -- no se usa
<<<<<<< Updated upstream
export const SA = 300; //En segundos -- 
=======
export const HORA_BATCH = 6;  //HORA_BATCH DE PEDIDOS -> SE AGARRA LOS PEDIDOS EN LAS 6 HORAS DE REGISTRO.
export const HORA_ITER = 1000*60;  //TIMER -> SE LANZARÁ DE NUEVO LA SIMULACIÓN CADA 6 HORAS SIMULADAS -- AHORA ES 1 MINUTO. 
>>>>>>> Stashed changes
export const K_DAY = 1; //En proporcion al tiempo 
export const K_7 = 14; //En proporcion al tiempo
export const K_COLAPSE = 75; //En proporcion al tiempo
export const PROM_CARG = (90+45+30)/3;