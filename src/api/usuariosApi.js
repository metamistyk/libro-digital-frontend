import apiClient from './apiClient'

const USUARIOS_URL = 'http://localhost:8082/api/v1'

// Usuarios

export const obtenerUsuarios = async (token) => {
    const client = apiClient(token)
    const response = await client.get(`${USUARIOS_URL}/usuarios`)
    return response.data
}

export const obtenerUsuarioPorEmail = async (token, email) => {
    const client = apiClient(token)
    const response = await client.get(`${USUARIOS_URL}/usuarios`)
    const usuarios = response.data
    return usuarios.find(u => u.email === email) || null
}

export const crearUsuario = async (usuario, token) => {
    const client = apiClient(token)
    const response = await client.post(`${USUARIOS_URL}/usuarios`, usuario)
    return response.data
}

// Roles

export const obtenerRoles = async (token) => {
    const client = apiClient(token)
    const response = await client.get(`${USUARIOS_URL}/roles`)
    return response.data
}

export const crearRol = async (rol, token) => {
    const client = apiClient(token)
    const response = await client.post(`${USUARIOS_URL}/roles`, rol)
    return response.data
}

// Estudiantes

export const obtenerEstudiantes = async (token) => {
    const client = apiClient(token)
    const response = await client.get(`${USUARIOS_URL}/estudiantes`)
    return response.data
}

export const crearEstudiante = async (estudiante, token) => {
    const client = apiClient(token)
    const response = await client.post(`${USUARIOS_URL}/estudiantes`, estudiante)
    return response.data
}

// Apoderados

export const crearApoderado = async (apoderado, token) => {
    const client = apiClient(token)
    const response = await client.post(`${USUARIOS_URL}/apoderados`, apoderado)
    return response.data
}