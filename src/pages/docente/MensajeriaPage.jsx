import { useEffect, useState, useCallback } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { enviarMensaje, obtenerRecibidos, obtenerConversacion } from '../../api/mensajeriaApi'
import { obtenerEstudiantesBff } from '../../api/bffApi'

function MensajeriaPage() {

    const { getAccessTokenSilently } = useAuth0()

    const [usuarios, setUsuarios] = useState([])
    const [destinatarioId, setDestinatarioId] = useState('')
    const [conversacion, setConversacion] = useState([])
    const [recibidos, setRecibidos] = useState([])
    const [contenido, setContenido] = useState('')
    const [remitenteId, setRemitenteId] = useState('')
    const [error, setError] = useState('')
    const [mensaje, setMensaje] = useState('')

    const obtenerToken = useCallback(async () => {
        return await getAccessTokenSilently({
            authorizationParams: { audience: 'https://libro-digital-api' }
        })
    }, [getAccessTokenSilently])

    const cargarUsuarios = useCallback(async () => {
        try {
            const token = await obtenerToken()
            const data = await obtenerEstudiantesBff(token)
            setUsuarios(data)
        } catch (err) {
            console.error(err)
            setError('No se pudieron cargar los usuarios.')
        }
    }, [obtenerToken])

    const cargarRecibidos = useCallback(async () => {
        if (!remitenteId) return
        try {
            const token = await obtenerToken()
            const data = await obtenerRecibidos(token, remitenteId)
            setRecibidos(data)
        } catch (err) {
            console.error(err)
        }
    }, [obtenerToken, remitenteId])

    const cargarConversacion = async (otroId) => {
        if (!remitenteId || !otroId) return
        try {
            const token = await obtenerToken()
            const data = await obtenerConversacion(token, remitenteId, otroId)
            setConversacion(data)
            setDestinatarioId(otroId)
        } catch (err) {
            console.error(err)
            setError('No se pudo cargar la conversación.')
        }
    }

    const enviar = async (event) => {
        event.preventDefault()
        setError('')
        setMensaje('')

        if (!remitenteId || !destinatarioId || !contenido) {
            setError('Completa todos los campos.')
            return
        }

        try {
            const token = await obtenerToken()
            await enviarMensaje(token, {
                remitenteId: Number(remitenteId),
                destinatarioId: Number(destinatarioId),
                contenido
            })
            setContenido('')
            setMensaje('Mensaje enviado.')
            await cargarConversacion(destinatarioId)
        } catch (err) {
            console.error(err)
            setError('Error al enviar el mensaje.')
        }
    }

    useEffect(() => {
        const inicializar = async () => {
            await cargarUsuarios()
        }
        inicializar()
    }, [cargarUsuarios])

    useEffect(() => {
        const inicializar = async () => {
            await cargarRecibidos()
        }
        inicializar()
    }, [cargarRecibidos])

    return (
        <div className="container py-5">

            <div className="medieval-card mb-4">
                <h1 className="mb-3">Mensajería</h1>
                {mensaje && <div className="alert alert-success">{mensaje}</div>}
                {error && <div className="alert alert-warning">{error}</div>}
            </div>

            {/* Configuración del remitente */}
            <div className="medieval-card mb-4">
                <h5 className="mb-3">Tu ID de usuario</h5>
                <input
                    type="number"
                    className="form-control"
                    placeholder="Ingresa tu ID de usuario"
                    value={remitenteId}
                    onChange={e => setRemitenteId(e.target.value)}
                />
            </div>

            <div className="row">

                {/* Lista de usuarios */}
                <div className="col-md-4">
                    <div className="medieval-card">
                        <h5 className="mb-3">Usuarios</h5>
                        <ul className="list-group">
                            {usuarios.map(u => (
                                <li
                                    key={u.id}
                                    className={`list-group-item list-group-item-action ${
                                        destinatarioId == u.id ? 'active' : ''
                                    }`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => cargarConversacion(u.id)}
                                >
                                    {u.nombre} {u.apellido}
                                    <small className="d-block text-muted">ID: {u.id}</small>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Conversación */}
                <div className="col-md-8">
                    <div className="medieval-card">
                        <h5 className="mb-3">
                            {destinatarioId
                                ? `Conversación con usuario #${destinatarioId}`
                                : 'Selecciona un usuario'}
                        </h5>

                        <div
                            className="mb-3"
                            style={{
                                minHeight: '200px',
                                maxHeight: '400px',
                                overflowY: 'auto'
                            }}
                        >
                            {conversacion.length === 0 && (
                                <p className="text-muted">Sin mensajes aún.</p>
                            )}
                            {conversacion.map(m => (
                                <div
                                    key={m.id}
                                    className={`mb-2 p-2 rounded ${
                                        m.remitenteId == remitenteId
                                            ? 'text-end bg-secondary'
                                            : 'text-start bg-dark'
                                    }`}
                                >
                                    <p className="mb-1">{m.contenido}</p>
                                    <small className="text-muted">
                                        {m.fechaEnvio}
                                    </small>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={enviar} className="row g-2">
                            <div className="col-9">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Escribe un mensaje..."
                                    value={contenido}
                                    onChange={e => setContenido(e.target.value)}
                                />
                            </div>
                            <div className="col-3">
                                <button
                                    className="btn medieval-btn w-100"
                                    type="submit"
                                >
                                    Enviar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>

            {/* Mensajes recibidos */}
            <div className="medieval-card mt-4">
                <h5 className="mb-3">Bandeja de entrada</h5>
                {recibidos.length === 0 && (
                    <p className="text-muted">Sin mensajes recibidos.</p>
                )}
                <table className="table table-dark table-striped">
                    <thead>
                        <tr>
                            <th>De</th>
                            <th>Mensaje</th>
                            <th>Fecha</th>
                            <th>Leído</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recibidos.map(m => (
                            <tr key={m.id}>
                                <td>ID: {m.remitenteId}</td>
                                <td>{m.contenido}</td>
                                <td>{m.fechaEnvio}</td>
                                <td>{m.leido ? 'Sí' : 'No'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default MensajeriaPage