import apiClient from './apiClient'

const ACADEMICO_URL = 'http://localhost:8081/api/v1'

// Cursos

export const obtenerCursos = async (token) => {
    const client = apiClient(token)
    const response = await client.get(`${ACADEMICO_URL}/cursos`)
    return response.data
}

export const crearCurso = async (token, curso) => {
    const client = apiClient(token)
    const response = await client.post(`${ACADEMICO_URL}/cursos`, curso)
    return response.data
}

export const actualizarCurso = async (token, id, curso) => {
    const client = apiClient(token)
    const response = await client.put(`${ACADEMICO_URL}/cursos/${id}`, curso)
    return response.data
}

export const eliminarCurso = async (token, id) => {
    const client = apiClient(token)
    await client.delete(`${ACADEMICO_URL}/cursos/${id}`)
}

// Asignaturas

export const obtenerAsignaturas = async (token) => {
    const client = apiClient(token)
    const response = await client.get(`${ACADEMICO_URL}/asignaturas`)
    return response.data
}

export const crearAsignatura = async (token, asignatura) => {
    const client = apiClient(token)
    const response = await client.post(`${ACADEMICO_URL}/asignaturas`, asignatura)
    return response.data
}

export const actualizarAsignatura = async (token, id, asignatura) => {
    const client = apiClient(token)
    const response = await client.put(`${ACADEMICO_URL}/asignaturas/${id}`, asignatura)
    return response.data
}

export const eliminarAsignatura = async (token, id) => {
    const client = apiClient(token)
    await client.delete(`${ACADEMICO_URL}/asignaturas/${id}`)
}

// Periodos académicos

export const obtenerPeriodos = async (token) => {
    const client = apiClient(token)
    const response = await client.get(`${ACADEMICO_URL}/periodos-academicos`)
    return response.data
}

export const crearPeriodo = async (token, periodo) => {
    const client = apiClient(token)
    const response = await client.post(`${ACADEMICO_URL}/periodos-academicos`, periodo)
    return response.data
}

// Asignaciones docentes

export const obtenerAsignacionesDocentes = async (token) => {
    const client = apiClient(token)
    const response = await client.get(`${ACADEMICO_URL}/asignaciones-docentes`)
    return response.data
}

export const crearAsignacionDocente = async (token, asignacion) => {
    const client = apiClient(token)
    const response = await client.post(`${ACADEMICO_URL}/asignaciones-docentes`, asignacion)
    return response.data
}

export const eliminarAsignacionDocente = async (token, id) => {
    const client = apiClient(token)
    await client.delete(`${ACADEMICO_URL}/asignaciones-docentes/${id}`)
}