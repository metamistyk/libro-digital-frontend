import apiClient from './apiClient'

const ASISTENCIA_URL = 'http://localhost:8083/api/v1'

export const enviarMensaje = async (token, mensaje) => {
    const client = apiClient(token)
    const response = await client.post(`${ASISTENCIA_URL}/mensajes`, mensaje)
    return response.data
}

export const obtenerRecibidos = async (token, destinatarioId) => {
    const client = apiClient(token)
    const response = await client.get(`${ASISTENCIA_URL}/mensajes/recibidos`, {
        params: { destinatarioId }
    })
    return response.data
}

export const obtenerConversacion = async (token, usuarioId1, usuarioId2) => {
    const client = apiClient(token)
    const response = await client.get(`${ASISTENCIA_URL}/mensajes/conversacion`, {
        params: { usuarioId1, usuarioId2 }
    })
    return response.data
}