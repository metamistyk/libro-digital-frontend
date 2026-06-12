import { useEffect, useState, useCallback } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { obtenerEstudiantes } from '../../api/usuariosApi'
import {
    obtenerAsistencias,
    obtenerNotas,
    obtenerAnotaciones,
    obtenerNotificaciones
} from '../../api/asistenciaApi'
import { obtenerRecibidos, enviarMensaje, obtenerConversacion } from '../../api/mensajeriaApi'

function UsuarioDashboard() {

    const { user, getAccessTokenSilently } = useAuth0()

    const [estudiante, setEstudiante] = useState(null)
    const [asistencias, setAsistencias] = useState([])
    const [notas, setNotas] = useState([])
    const [anotaciones, setAnotaciones] = useState([])
    const [notificaciones, setNotificaciones] = useState([])
    const [recibidos, setRecibidos] = useState([])
    const [conversacion, setConversacion] = useState([])
    const [destinatarioId, setDestinatarioId] = useState('')
    const [contenido, setContenido] = useState('')
    const [mensajeEnviado, setMensajeEnviado] = useState('')
    const [error, setError] = useState('')

    const obtenerToken = useCallback(async () => {
        return await getAccessTokenSilently({
            authorizationParams: { audience: 'https://libro-digital-api' }
        })
    }, [getAccessTokenSilently])

    const cargarDatos = useCallback(async () => {
        try {
            const token = await obtenerToken()

            const estudiantesData = await obtenerEstudiantes(token)

            const estudianteEncontrado = estudiantesData.find(
                e => e.email === user.email
            )

            if (!estudianteEncontrado) {
                setError('No existe un estudiante asociado a este usuario.')
                return
            }

            setEstudiante(estudianteEncontrado)

            const [
                asistenciasData,
                notasData,
                anotacionesData,
                notificacionesData,
                recibidosData
            ] = await Promise.all([
                obtenerAsistencias(token, estudianteEncontrado.id),
                obtenerNotas(token, estudianteEncontrado.id),
                obtenerAnotaciones(token, estudianteEncontrado.id),
                obtenerNotificaciones(token),
                obtenerRecibidos(token, estudianteEncontrado.id)
            ])

            setAsistencias(asistenciasData)
            setNotas(notasData)
            setAnotaciones(anotacionesData)
            setRecibidos(recibidosData)

            const notificacionesFiltradas = notificacionesData.filter(
                n => n.destinatarioId === estudianteEncontrado.id
            )
            setNotificaciones(notificacionesFiltradas)

        } catch (err) {
            console.error(err)
            setError('No se pudo cargar la información del estudiante.')
        }
    }, [obtenerToken, user])

    const cargarConversacion = async (otroId) => {
        if (!estudiante || !otroId) return
        try {
            const token = await obtenerToken()
            const data = await obtenerConversacion(token, estudiante.id, otroId)
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
        setMensajeEnviado('')

        if (!destinatarioId || !contenido) {
            setError('Completa todos los campos.')
            return
        }

        try {
            const token = await obtenerToken()
            await enviarMensaje(token, {
                remitenteId: estudiante.id,
                destinatarioId: Number(destinatarioId),
                contenido
            })
            setContenido('')
            setMensajeEnviado('Mensaje enviado.')
            await cargarConversacion(destinatarioId)
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
                <h1>Portal de Usuario</h1>
                <p>Consulta de asistencias, notas, anotaciones y notificaciones.</p>

                {estudiante && (
                    <div className="mt-4">
                        <h4>Información del estudiante</h4>
                        <p><strong>Nombre:</strong> {estudiante.nombre} {estudiante.apellido}</p>
                        <p><strong>Email:</strong> {estudiante.email}</p>
                        <p><strong>Curso ID:</strong> {estudiante.cursoId}</p>
                    </div>
                )}

                {error && (
                    <div className="alert alert-warning mt-3">{error}</div>
                )}
            </div>

            {/* Mensajería */}
            <div className="medieval-card mb-4">
                <h2 className="mb-4">Mensajería</h2>

                {mensajeEnviado && (
                    <div className="alert alert-success">{mensajeEnviado}</div>
                )}

                <div className="row mb-3">
                    <div className="col-md-4">
                        <label className="form-label">ID del destinatario</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="ID del docente o apoderado"
                            value={destinatarioId}
                            onChange={e => setDestinatarioId(e.target.value)}
                            onBlur={() => cargarConversacion(destinatarioId)}
                        />
                    </div>
                </div>

                <div
                    className="mb-3 p-2 bg-dark rounded"
                    style={{ minHeight: '150px', maxHeight: '300px', overflowY: 'auto' }}
                >
                    {conversacion.length === 0 && (
                        <p className="text-muted">Sin mensajes en esta conversación.</p>
                    )}
                    {conversacion.map(m => (
                        <div
                            key={m.id}
                            className={`mb-2 p-2 rounded ${
                                m.remitenteId === estudiante?.id
                                    ? 'text-end bg-secondary'
                                    : 'text-start'
                            }`}
                        >
                            <p className="mb-1">{m.contenido}</p>
                            <small className="text-muted">{m.fechaEnvio}</small>
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

                <h5 className="mt-4 mb-3">Bandeja de entrada</h5>
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

            {/* Notificaciones */}
            <div className="medieval-card mb-4">
                <h2 className="mb-4">Notificaciones Kafka</h2>
                <table className="table table-dark table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Mensaje</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notificaciones.map(n => (
                            <tr key={n.id}>
                                <td>{n.id}</td>
                                <td>{n.mensaje}</td>
                                <td>{n.estado}</td>
                                <td>{n.fechaCreacion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Asistencias */}
            <div className="medieval-card mb-4">
                <h2 className="mb-4">Historial de Asistencias</h2>
                <table className="table table-dark table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {asistencias.map(a => (
                            <tr key={a.id}>
                                <td>{a.id}</td>
                                <td>{a.fechaHora}</td>
                                <td>{a.estado}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Notas */}
            <div className="medieval-card mb-4">
                <h2 className="mb-4">Historial de Notas</h2>
                <table className="table table-dark table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Asignatura ID</th>
                            <th>Nota</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notas.map(n => (
                            <tr key={n.id}>
                                <td>{n.id}</td>
                                <td>{n.asignaturaId}</td>
                                <td>{n.nota}</td>
                                <td>{n.descripcion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Anotaciones */}
            <div className="medieval-card">
                <h2 className="mb-4">Historial de Anotaciones</h2>
                <table className="table table-dark table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tipo</th>
                            <th>Descripción</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {anotaciones.map(a => (
                            <tr key={a.id}>
                                <td>{a.id}</td>
                                <td>{a.tipo}</td>
                                <td>{a.descripcion}</td>
                                <td>{a.fechaCreacion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default UsuarioDashboard