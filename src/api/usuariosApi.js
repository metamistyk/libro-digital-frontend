import apiClient from './apiClient'

const USUARIOS_URL = 'http://localhost:8082/api/v1'

// Estudiantes

export const obtenerEstudiantes = async (token) => {
    const client = apiClient(token)
    const response = await client.get(`${USUARIOS_URL}/estudiantes`)
    return response.data
}

export const crearEstudiante = async (token, estudiante) => {
    const client = apiClient(token)
    const response = await client.post(`${USUARIOS_URL}/estudiantes`, estudiante)
    return response.data
}

// Usuarios / Docentes

export const obtenerUsuarios = async (token) => {
    const client = apiClient(token)
    const response = await client.get(`${USUARIOS_URL}/usuarios`)
    return response.data
}

export const crearUsuario = async (token, usuario) => {
    const client = apiClient(token)
    const response = await client.post(`${USUARIOS_URL}/usuarios`, usuario)
    return response.data
}