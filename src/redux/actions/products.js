import {
GET_PRODUCTS_SUCCESS,
GET_PRODUCTS_FAIL,
GET_PRODUCTS_BY_ARRIVAL_SUCCESS,
GET_PRODUCTS_BY_ARRIVAL_FAIL,
GET_PRODUCTS_BY_SOLD_SUCCESS,
GET_PRODUCTS_BY_SOLD_FAIL,
GET_PRODUCT_SUCCESS,
GET_PRODUCT_FAIL,
SEARCH_PRODUCTS_SUCCESS,
SEARCH_PRODUCTS_FAIL,
RELATED_PRODUCTS_SUCCESS,
RELATED_PRODUCTS_FAIL,
FILTER_PRODUCTS_SUCCESS,
FILTER_PRODUCTS_FAIL,
} from './types'

import axios from 'axios';

export const get_products = () => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };

    try { 
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/get-products`, config);
    
        if (res.status === 200) {
            dispatch({
                type: GET_PRODUCTS_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: GET_PRODUCTS_FAIL
            });
        }

    } catch(err){
        dispatch({
            type: GET_PRODUCTS_FAIL
        });
    }
}

export const get_products_by_arrival = () => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/get-products?sortBy=date_created&order=desc&limit=4`, config);
    
        if (res.status === 200) {
            dispatch({
                type: GET_PRODUCTS_BY_ARRIVAL_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: GET_PRODUCTS_BY_ARRIVAL_FAIL
            });
        }
    } catch(err) {
        dispatch({
            type: GET_PRODUCTS_BY_ARRIVAL_FAIL
        });
    }
}

export const get_products_by_sold = () => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/get-products?sortBy=sold&order=desc&limit=3`, config);

        if (res.status === 200) {
            dispatch({
                type: GET_PRODUCTS_BY_SOLD_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: GET_PRODUCTS_BY_SOLD_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: GET_PRODUCTS_BY_SOLD_FAIL
        });
    }
}

export const get_product = (productId) => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/product/${productId}`, config);

        if (res.status === 200) {
            dispatch({
                type: GET_PRODUCT_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: GET_PRODUCT_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: GET_PRODUCT_FAIL
        });
    }
}

export const get_related_products = (productId) => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/related/${productId}`, config);

        if (res.status === 200 && !res.data.error) {
            dispatch({
                type: RELATED_PRODUCTS_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: RELATED_PRODUCTS_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: RELATED_PRODUCTS_FAIL
        });
    }
}


export const get_filtered_products = (category_id, price_range, sort_by, order) => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({
        category_id,
        price_range,
        sort_by,
        order
    });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/product/by/search`, body, config);

        if (res.status === 200 && !res.data.error) {
            dispatch({
                type: FILTER_PRODUCTS_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: FILTER_PRODUCTS_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: FILTER_PRODUCTS_FAIL
        });
    }
}

export const get_search_products = (category_id, search ) => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({
        category_id: category_id.trim(),
        search,
      
    });

    try {
        console.log("Solicitud enviada al servidor:", body); // Agrega un log para verificar los datos enviados

        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/product/search`, body, config);
        
        console.log("Respuesta del servidor:", res.data); // Agrega un log para verificar la respuesta del servidor

        if (res.status === 200) {
            dispatch({
                type: SEARCH_PRODUCTS_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: SEARCH_PRODUCTS_FAIL
            });
        }
    } catch (err) {
        console.error("Error en la solicitud:", err);
    
        if (err.response) {
            // La solicitud fue hecha y el servidor respondió con un código de estado fuera del rango 2xx
            console.error("Respuesta del servidor:", err.response.data);
            console.error("Código de estado HTTP:", err.response.status);
            console.error("Cabeceras de respuesta:", err.response.headers);
        } else if (err.request) {
            // La solicitud fue hecha pero no se recibió ninguna respuesta
            console.error("No se recibió respuesta del servidor");
        } else {
            // Algo sucedió en la configuración de la solicitud que desencadenó un error
            console.error("Error de configuración de la solicitud:", err.message);
        }
    
        dispatch({
            type: SEARCH_PRODUCTS_FAIL
        });
    }
    
}