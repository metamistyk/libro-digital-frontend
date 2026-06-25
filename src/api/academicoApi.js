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
    const response = await client.delete(`${ACADEMICO_URL}/cursos/${id}`)
    return response.data
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
    const response = await client.delete(`${ACADEMICO_URL}/asignaturas/${id}`)
    return response.data
}

// Periodos
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

export const actualizarPeriodo = async (token, id, periodo) => {
    const client = apiClient(token)
    const response = await client.put(`${ACADEMICO_URL}/periodos-academicos/${id}`, periodo)
    return response.data
}

export const eliminarPeriodo = async (token, id) => {
    const client = apiClient(token)
    const response = await client.delete(`${ACADEMICO_URL}/periodos-academicos/${id}`)
    return response.data
}

// Asignaciones docentes
export const obtenerAsignaciones = async (token) => {
    const client = apiClient(token)
    const response = await client.get(`${ACADEMICO_URL}/asignaciones-docentes`)
    return response.data
}

// Alias para compatibilidad con páginas existentes
export const obtenerAsignacionesDocentes = obtenerAsignaciones

export const crearAsignacion = async (token, asignacion) => {
    const client = apiClient(token)
    const response = await client.post(`${ACADEMICO_URL}/asignaciones-docentes`, asignacion)
    return response.data
}

// Alias para compatibilidad con páginas existentes
export const crearAsignacionDocente = crearAsignacion

export const eliminarAsignacion = async (token, id) => {
    const client = apiClient(token)
    const response = await client.delete(`${ACADEMICO_URL}/asignaciones-docentes/${id}`)
    return response.data
}

// Alias para compatibilidad con páginas existentes
export const eliminarAsignacionDocente = eliminarAsignacion

export const obtenerAsignacionesPorDocente = async (token, docenteId) => {
    const client = apiClient(token)
    const response = await client.get(
        `${ACADEMICO_URL}/asignaciones-docentes/por-docente`,
        { params: { docenteId } }
    )
    return response.data
}