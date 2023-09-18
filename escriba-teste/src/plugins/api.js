import axios from 'axios';

export const apiPessoas = axios.create({
    baseURL: 'http://localhost:3000/pessoas',
});

export const apiPeodutos = axios.create({
    baseURL: 'http://localhost:3000/produtos',
});

export const apiPedidos = axios.create({
    baseURL: 'http://localhost:3000/pedidos',
});