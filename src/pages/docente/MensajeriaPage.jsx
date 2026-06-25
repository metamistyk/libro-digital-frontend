import { useEffect, useState, useCallback } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { enviarMensaje, obtenerRecibidos, obtenerConversacion } from '../../api/mensajeriaApi'
import { obtenerEstudiantesBff } from '../../api/bffApi'
import { obtenerUsuarioPorEmail } from '../../api/usuariosApi'

const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '—'
    try {
        const fecha = new Date(fechaStr)
        return fecha.toLocaleString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch {
        return fechaStr
    }
}

function MensajeriaPage() {

    const { getAccessTokenSilently, user } = useAuth0()

    const [usuarios, setUsuarios] = useState([])
    const [docenteId, setDocenteId] = useState(null)
    const [destinatarioId, setDestinatarioId] = useState('')
    const [destinatarioNombre, setDestinatarioNombre] = useState('')
    const [conversacion, setConversacion] = useState([])
    const [recibidos, setRecibidos] = useState([])
    const [contenido, setContenido] = useState('')
    const [error, setError] = useState('')
    const [mensaje, setMensaje] = useState('')

    const obtenerToken = useCallback(async () => {
        return await getAccessTokenSilently({
            authorizationParams: { audience: 'https://libro-digital-api' }
        })
    }, [getAccessTokenSilently])

    const obtenerNombreRemitente = (remitenteId) => {
        const encontrado = usuarios.find(u => u.id === remitenteId)
        return encontrado ? `${encontrado.nombre} ${encontrado.apellido}` : `ID: ${remitenteId}`
    }

    const cargarDatos = useCallback(async () => {
        try {
            const token = await obtenerToken()

            // Obtiene el docente autenticado por email
            const docente = await obtenerUsuarioPorEmail(token, user.email)
            if (docente) {
                setDocenteId(docente.id)
                const recibidosData = await obtenerRecibidos(token, docente.id)
                setRecibidos(recibidosData)
            }

            // Obtiene lista de estudiantes para mostrar como destinatarios
            const estudiantesData = await obtenerEstudiantesBff(token)
            setUsuarios(estudiantesData)

        } catch (err) {
            console.error(err)
            setError('No se pudieron cargar los datos.')
        }
    }, [obtenerToken, user])

    const seleccionarDestinatario = async (destinatario) => {
        if (!docenteId) return
        try {
            const token = await obtenerToken()
            setDestinatarioId(destinatario.id)
            setDestinatarioNombre(`${destinatario.nombre} ${destinatario.apellido}`)
            const data = await obtenerConversacion(token, docenteId, destinatario.id)
            setConversacion(data)
        } catch (err) {
            console.error(err)
            setError('No se pudo cargar la conversación.')
        }
    }

    const enviar = async (event) => {
        event.preventDefault()
        setError('')
        setMensaje('')

        if (!docenteId || !destinatarioId || !contenido) {
            setError('Selecciona un destinatario y escribe un mensaje.')
            return
        }

        try {
            const token = await obtenerToken()
            await enviarMensaje(token, {
                remitenteId: Number(docenteId),
                destinatarioId: Number(destinatarioId),
                contenido
            })
            setContenido('')
            setMensaje('Mensaje enviado.')
            const data = await obtenerConversacion(token, docenteId, destinatarioId)
            setConversacion(data)
        } catch (err) {
            console.error(err)
            setError('Error al enviar el mensaje.')
        }
    }

    useEffect(() => {
        const inicializar = async () => {
            await cargarDatos()
        }
        inicializar()
    }, [cargarDatos])

    return (
        <div className="container py-5">

            <div className="medieval-card mb-4">
                <h1 className="mb-3">Mensajería</h1>
                {mensaje && <div className="alert alert-success">{mensaje}</div>}
                {error && <div className="alert alert-warning">{error}</div>}
            </div>

            <div className="row">

                {/* Lista de estudiantes */}
                <div className="col-md-4">
                    <div className="medieval-card">
                        <h5 className="mb-3">Selecciona un destinatario</h5>
                        <ul className="list-group">
                            {usuarios.map(u => (
                                <li
                                    key={u.id}
                                    className={`list-group-item list-group-item-action ${
                                        destinatarioId === u.id ? 'active' : ''
                                    }`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => seleccionarDestinatario(u)}
                                >
                                    {u.nombre} {u.apellido}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Conversación */}
                <div className="col-md-8">
                    <div className="medieval-card">
                        <h5 className="mb-3">
                            {destinatarioNombre
                                ? `Conversación con ${destinatarioNombre}`
                                : 'Selecciona un destinatario'}
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
                                        m.remitenteId === docenteId
                                            ? 'text-end bg-secondary'
                                            : 'text-start bg-dark'
                                    }`}
                                >
                                    <p className="mb-1">{m.contenido}</p>
                                    <small className="text-muted">
                                        {formatearFecha(m.fechaEnvio)}
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
                                <button className="btn medieval-btn w-100" type="submit">
                                    Enviar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>

            {/* Bandeja de entrada */}
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
                                <td>{obtenerNombreRemitente(m.remitenteId)}</td>
                                <td>{m.contenido}</td>
                                <td>{formatearFecha(m.fechaEnvio)}</td>
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