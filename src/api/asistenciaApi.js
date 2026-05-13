import apiClient from './apiClient'

const ASISTENCIA_URL = 'http://localhost:8083/api/v1'

export const obtenerAsistencias = async (token) => {

    const client = apiClient(token)

    const response = await client.get(
        `${ASISTENCIA_URL}/asistencias`
    )

    return response.data
}