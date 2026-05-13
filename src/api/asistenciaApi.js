import apiClient from './apiClient'

const ASISTENCIA_URL = 'http://localhost:8083/api/v1'

// Asistencias

export const obtenerAsistencias = async (
    token,
    estudianteId
) => {

    const client = apiClient(token)

    const response = await client.get(
        `${ASISTENCIA_URL}/asistencias`,
        {
            params: {
                estudianteId
            }
        }
    )

    return response.data
}

export const crearAsistencia = async (
    token,
    asistencia
) => {

    const client = apiClient(token)

    const response = await client.post(
        `${ASISTENCIA_URL}/asistencias`,
        asistencia
    )

    return response.data
}