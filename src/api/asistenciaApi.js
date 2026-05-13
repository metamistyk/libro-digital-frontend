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

// Notas

export const obtenerNotas = async (
    token,
    estudianteId
) => {

    const client = apiClient(token)

    const response = await client.get(
        `${ASISTENCIA_URL}/notas`,
        {
            params: {
                estudianteId
            }
        }
    )

    return response.data
}

export const crearNota = async (
    token,
    nota
) => {

    const client = apiClient(token)

    const response = await client.post(
        `${ASISTENCIA_URL}/notas`,
        nota
    )

    return response.data
}

// Anotaciones

export const obtenerAnotaciones = async (
    token,
    estudianteId
) => {

    const client = apiClient(token)

    const response = await client.get(
        `${ASISTENCIA_URL}/anotaciones`,
        {
            params: {
                estudianteId
            }
        }
    )

    return response.data
}

export const crearAnotacion = async (
    token,
    anotacion
) => {

    const client = apiClient(token)

    const response = await client.post(
        `${ASISTENCIA_URL}/anotaciones`,
        anotacion
    )

    return response.data
}

// Notificaciones

export const obtenerNotificaciones = async (
    token
) => {

    const client = apiClient(token)

    const response = await client.get(
        `${ASISTENCIA_URL}/notificaciones`
    )

    return response.data
}