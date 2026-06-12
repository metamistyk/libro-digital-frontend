import apiClient from './apiClient'

const BFF_URL = 'http://localhost:8080/api/v1/bff'

// Lista todos los estudiantes a través del BFF
export const obtenerEstudiantesBff = async (token) => {
    const client = apiClient(token)
    const response = await client.get(`${BFF_URL}/estudiantes`)
    return response.data
}

// Obtiene el resumen completo de un estudiante (notas, asistencias, anotaciones, porcentajes)
export const obtenerResumenEstudiante = async (token, estudianteId) => {
    const client = apiClient(token)
    const response = await client.get(`${BFF_URL}/estudiantes/${estudianteId}/resumen`)
    return response.data
}

export const obtenerRankingEstudiantes = async (token) => {
    const client = apiClient(token)
    const response = await client.get(`${BFF_URL}/ranking/estudiantes`)
    return response.data
}