import { useEffect, useState, useCallback } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { obtenerEstudiantesBff, obtenerResumenEstudiante } from '../../api/bffApi'
import { crearAsistencia, crearNota, crearAnotacion } from '../../api/asistenciaApi'
import { obtenerUsuarioPorEmail } from '../../api/usuariosApi'
import { obtenerAsignacionesPorDocente } from '../../api/academicoApi'

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

function DocenteDashboard() {

    const { user, getAccessTokenSilently } = useAuth0()

    const [tabActiva, setTabActiva] = useState('asistencia')
    const [estudiantes, setEstudiantes] = useState([])
    const [asistenciasMarcadas, setAsistenciasMarcadas] = useState({})
    const [asistenciaYaRegistrada, setAsistenciaYaRegistrada] = useState(false)
    const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null)
    const [resumen, setResumen] = useState(null)
    const [asignaciones, setAsignaciones] = useState([])

    const [formularioNota, setFormularioNota] = useState({
        estudianteId: '',
        asignaturaId: '',
        nota: '',
        descripcion: ''
    })

    const [formularioAnotacion, setFormularioAnotacion] = useState({
        estudianteId: '',
        descripcion: '',
        tipo: 'POSITIVA'
    })

    const [mensaje, setMensaje] = useState('')
    const [error, setError] = useState('')

    const obtenerToken = useCallback(async () => {
        return await getAccessTokenSilently({
            authorizationParams: { audience: 'https://libro-digital-api' }
        })
    }, [getAccessTokenSilently])

    const cargarEstudiantes = useCallback(async () => {
        try {
            const token = await obtenerToken()
            const data = await obtenerEstudiantesBff(token)
            setEstudiantes(data)
            const estadosIniciales = {}
            data.forEach(e => { estadosIniciales[e.id] = 'PRESENTE' })
            setAsistenciasMarcadas(estadosIniciales)
        } catch (err) {
            console.error(err)
            setError('No se pudieron cargar los estudiantes.')
        }
    }, [obtenerToken])

    const cargarDocenteYAsignaciones = useCallback(async () => {
        try {
            const token = await obtenerToken()
            const docente = await obtenerUsuarioPorEmail(token, user.email)
            if (!docente) return
            const data = await obtenerAsignacionesPorDocente(token, docente.id)
            setAsignaciones(data)
        } catch (err) {
            console.error(err)
        }
    }, [obtenerToken, user])

    const verificarAsistenciaHoy = useCallback(async () => {
        try {
            const token = await obtenerToken()
            if (estudiantes.length === 0) return
            const { obtenerAsistencias } = await import('../../api/asistenciaApi')
            const asistenciasHoy = await obtenerAsistencias(token, estudiantes[0].id)
            const hoy = new Date().toISOString().split('T')[0]
            const yaRegistro = asistenciasHoy.some(a =>
                a.fechaHora && a.fechaHora.startsWith(hoy)
            )
            setAsistenciaYaRegistrada(yaRegistro)
        } catch (err) {
            console.error(err)
        }
    }, [obtenerToken, estudiantes])

    const seleccionarEstudianteResumen = async (estudiante) => {
        try {
            const token = await obtenerToken()
            setEstudianteSeleccionado(estudiante)
            const data = await obtenerResumenEstudiante(token, estudiante.id)
            setResumen(data)
        } catch (err) {
            console.error(err)
            setError('No se pudo cargar el resumen.')
        }
    }

    const cambiarEstadoAsistencia = (estudianteId, estado) => {
        setAsistenciasMarcadas(prev => ({ ...prev, [estudianteId]: estado }))
    }

    const guardarAsistencias = async () => {
        setError('')
        setMensaje('')
        if (asistenciaYaRegistrada) {
            setError('La asistencia de hoy ya fue registrada. No es posible volver a pasar lista.')
            return
        }
        try {
            const token = await obtenerToken()
            await Promise.all(
                estudiantes.map(e =>
                    crearAsistencia(token, {
                        estudianteId: e.id,
                        estado: asistenciasMarcadas[e.id] || 'PRESENTE'
                    })
                )
            )
            setMensaje('Asistencias registradas correctamente.')
            setAsistenciaYaRegistrada(true)
        } catch (err) {
            console.error(err)
            setError('Error al registrar asistencias.')
        }
    }

    const guardarNota = async (event) => {
        event.preventDefault()
        setError('')
        setMensaje('')
        if (!formularioNota.estudianteId) {
            setError('Selecciona un estudiante.')
            return
        }
        if (!formularioNota.asignaturaId) {
            setError('Selecciona una asignatura.')
            return
        }
        try {
            const token = await obtenerToken()
            await crearNota(token, {
                estudianteId: Number(formularioNota.estudianteId),
                asignaturaId: Number(formularioNota.asignaturaId),
                nota: Number(formularioNota.nota),
                descripcion: formularioNota.descripcion
            })
            setMensaje('Nota registrada correctamente.')
            setFormularioNota({
                estudianteId: formularioNota.estudianteId,
                asignaturaId: formularioNota.asignaturaId,
                nota: '',
                descripcion: ''
            })
            if (estudianteSeleccionado?.id === Number(formularioNota.estudianteId)) {
                const data = await obtenerResumenEstudiante(token, estudianteSeleccionado.id)
                setResumen(data)
            }
        } catch (err) {
            console.error(err)
            setError('Error al registrar nota.')
        }
    }

    const guardarAnotacion = async (event) => {
        event.preventDefault()
        setError('')
        setMensaje('')
        if (!formularioAnotacion.estudianteId) {
            setError('Selecciona un estudiante.')
            return
        }
        try {
            const token = await obtenerToken()
            await crearAnotacion(token, {
                estudianteId: Number(formularioAnotacion.estudianteId),
                descripcion: formularioAnotacion.descripcion,
                tipo: formularioAnotacion.tipo
            })
            setMensaje('Anotación registrada correctamente.')
            setFormularioAnotacion({
                estudianteId: formularioAnotacion.estudianteId,
                descripcion: '',
                tipo: 'POSITIVA'
            })
            if (estudianteSeleccionado?.id === Number(formularioAnotacion.estudianteId)) {
                const data = await obtenerResumenEstudiante(token, estudianteSeleccionado.id)
                setResumen(data)
            }
        } catch (err) {
            console.error(err)
            setError('Error al registrar anotación.')
        }
    }

    useEffect(() => {
        const inicializar = async () => {
            await cargarEstudiantes()
            await cargarDocenteYAsignaciones()
        }
        inicializar()
    }, [cargarEstudiantes, cargarDocenteYAsignaciones])

    useEffect(() => {
        if (estudiantes.length > 0) {
            const verificar = async () => {
                await verificarAsistenciaHoy()
            }
            verificar()
        }
    }, [estudiantes, verificarAsistenciaHoy])

    return (
        <div className="container py-5">

            <div className="medieval-card mb-4">
                <h1 className="mb-3">Portal Docente</h1>
                {mensaje && <div className="alert alert-success">{mensaje}</div>}
                {error && <div className="alert alert-warning">{error}</div>}
            </div>

            {/* Tabs */}
            <div className="medieval-card mb-4">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${tabActiva === 'asistencia' ? 'active' : ''}`}
                            onClick={() => setTabActiva('asistencia')}
                        >
                            Asistencia
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${tabActiva === 'notas' ? 'active' : ''}`}
                            onClick={() => setTabActiva('notas')}
                        >
                            Notas
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${tabActiva === 'anotaciones' ? 'active' : ''}`}
                            onClick={() => setTabActiva('anotaciones')}
                        >
                            Anotaciones
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${tabActiva === 'detalle' ? 'active' : ''}`}
                            onClick={() => setTabActiva('detalle')}
                        >
                            Detalle Estudiante
                        </button>
                    </li>
                </ul>
            </div>

            {/* TAB: ASISTENCIA */}
            {tabActiva === 'asistencia' && (
                <div className="medieval-card mb-4">
                    <h2 className="mb-3">Registro de Asistencia</h2>

                    {asistenciaYaRegistrada && (
                        <div className="alert alert-info">
                            La asistencia de hoy ya fue registrada.
                        </div>
                    )}

                    <table className="table table-dark table-striped">
                        <thead>
                            <tr>
                                <th>Estudiante</th>
                                <th>Presente</th>
                                <th>Ausente</th>
                                <th>Atraso</th>
                            </tr>
                        </thead>
                        <tbody>
                            {estudiantes.map(e => (
                                <tr key={e.id}>
                                    <td>{e.nombre} {e.apellido}</td>
                                    <td>
                                        <input
                                            type="radio"
                                            name={`asistencia-${e.id}`}
                                            checked={asistenciasMarcadas[e.id] === 'PRESENTE'}
                                            onChange={() => cambiarEstadoAsistencia(e.id, 'PRESENTE')}
                                            disabled={asistenciaYaRegistrada}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="radio"
                                            name={`asistencia-${e.id}`}
                                            checked={asistenciasMarcadas[e.id] === 'AUSENTE'}
                                            onChange={() => cambiarEstadoAsistencia(e.id, 'AUSENTE')}
                                            disabled={asistenciaYaRegistrada}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="radio"
                                            name={`asistencia-${e.id}`}
                                            checked={asistenciasMarcadas[e.id] === 'ATRASO'}
                                            onChange={() => cambiarEstadoAsistencia(e.id, 'ATRASO')}
                                            disabled={asistenciaYaRegistrada}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button
                        className="btn medieval-btn mt-2"
                        onClick={guardarAsistencias}
                        disabled={asistenciaYaRegistrada}
                    >
                        {asistenciaYaRegistrada ? 'Asistencia ya registrada hoy' : 'Guardar Asistencias'}
                    </button>
                </div>
            )}

            {/* TAB: NOTAS */}
            {tabActiva === 'notas' && (
                <div className="medieval-card mb-4">
                    <h2 className="mb-3">Registrar Nota</h2>

                    {asignaciones.length === 0 && (
                        <div className="alert alert-warning">
                            No tienes asignaturas asignadas. Contacta al administrador.
                        </div>
                    )}

                    <form onSubmit={guardarNota} className="row g-3 mb-4">
                        <div className="col-md-3">
                            <label className="form-label">Estudiante</label>
                            <select
                                className="form-select"
                                value={formularioNota.estudianteId}
                                onChange={e => setFormularioNota({
                                    ...formularioNota,
                                    estudianteId: e.target.value
                                })}
                            >
                                <option value="">Seleccionar...</option>
                                {estudiantes.map(e => (
                                    <option key={e.id} value={e.id}>
                                        {e.nombre} {e.apellido}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Asignatura</label>
                            <select
                                className="form-select"
                                value={formularioNota.asignaturaId}
                                onChange={e => setFormularioNota({
                                    ...formularioNota,
                                    asignaturaId: e.target.value
                                })}
                            >
                                <option value="">Seleccionar...</option>
                                {asignaciones.map(a => (
                                    <option key={a.asignaturaId} value={a.asignaturaId}>
                                        {a.nombreAsignatura} — {a.nombreCurso}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-2">
                            <label className="form-label">Nota (1.0 - 7.0)</label>
                            <input
                                type="number"
                                step="0.1"
                                min="1"
                                max="7"
                                className="form-control"
                                placeholder="6.5"
                                value={formularioNota.nota}
                                onChange={e => setFormularioNota({
                                    ...formularioNota,
                                    nota: e.target.value
                                })}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Descripción</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Prueba 1"
                                value={formularioNota.descripcion}
                                onChange={e => setFormularioNota({
                                    ...formularioNota,
                                    descripcion: e.target.value
                                })}
                            />
                        </div>

                        <div className="col-md-1 d-flex align-items-end">
                            <button className="btn medieval-btn w-100" type="submit">
                                Guardar
                            </button>
                        </div>
                    </form>

                    {formularioNota.estudianteId && (
                        <button
                            className="btn btn-sm medieval-btn"
                            onClick={() => {
                                const est = estudiantes.find(
                                    e => e.id === Number(formularioNota.estudianteId)
                                )
                                if (est) {
                                    seleccionarEstudianteResumen(est)
                                    setTabActiva('detalle')
                                }
                            }}
                        >
                            Ver historial de {estudiantes.find(
                                e => e.id === Number(formularioNota.estudianteId)
                            )?.nombre}
                        </button>
                    )}
                </div>
            )}

            {/* TAB: ANOTACIONES */}
            {tabActiva === 'anotaciones' && (
                <div className="medieval-card mb-4">
                    <h2 className="mb-3">Registrar Anotación</h2>
                    <form onSubmit={guardarAnotacion} className="row g-3 mb-4">
                        <div className="col-md-4">
                            <label className="form-label">Estudiante</label>
                            <select
                                className="form-select"
                                value={formularioAnotacion.estudianteId}
                                onChange={e => setFormularioAnotacion({
                                    ...formularioAnotacion,
                                    estudianteId: e.target.value
                                })}
                            >
                                <option value="">Seleccionar...</option>
                                {estudiantes.map(e => (
                                    <option key={e.id} value={e.id}>
                                        {e.nombre} {e.apellido}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-2">
                            <label className="form-label">Tipo</label>
                            <select
                                className="form-select"
                                value={formularioAnotacion.tipo}
                                onChange={e => setFormularioAnotacion({
                                    ...formularioAnotacion,
                                    tipo: e.target.value
                                })}
                            >
                                <option value="POSITIVA">POSITIVA</option>
                                <option value="NEGATIVA">NEGATIVA</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Descripción</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Descripción de la anotación"
                                value={formularioAnotacion.descripcion}
                                onChange={e => setFormularioAnotacion({
                                    ...formularioAnotacion,
                                    descripcion: e.target.value
                                })}
                            />
                        </div>

                        <div className="col-md-2 d-flex align-items-end">
                            <button className="btn medieval-btn w-100" type="submit">
                                Guardar
                            </button>
                        </div>
                    </form>

                    {formularioAnotacion.estudianteId && (
                        <button
                            className="btn btn-sm medieval-btn"
                            onClick={() => {
                                const est = estudiantes.find(
                                    e => e.id === Number(formularioAnotacion.estudianteId)
                                )
                                if (est) {
                                    seleccionarEstudianteResumen(est)
                                    setTabActiva('detalle')
                                }
                            }}
                        >
                            Ver historial de {estudiantes.find(
                                e => e.id === Number(formularioAnotacion.estudianteId)
                            )?.nombre}
                        </button>
                    )}
                </div>
            )}

            {/* TAB: DETALLE ESTUDIANTE */}
            {tabActiva === 'detalle' && (
                <div className="medieval-card mb-4">
                    <h2 className="mb-3">Detalle del Estudiante</h2>

                    {!resumen && (
                        <div className="mb-3">
                            <label className="form-label">Seleccionar estudiante</label>
                            <select
                                className="form-select w-auto"
                                onChange={e => {
                                    const est = estudiantes.find(
                                        s => s.id === Number(e.target.value)
                                    )
                                    if (est) seleccionarEstudianteResumen(est)
                                }}
                            >
                                <option value="">Seleccionar...</option>
                                {estudiantes.map(e => (
                                    <option key={e.id} value={e.id}>
                                        {e.nombre} {e.apellido}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {resumen && (
                        <>
                            <h4 className="mb-3">{resumen.nombre} {resumen.apellido}</h4>

                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <div className="medieval-card text-center">
                                        <h5>Asistencia</h5>
                                        <h2>{resumen.porcentajeAsistencia.toFixed(1)}%</h2>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="medieval-card text-center">
                                        <h5>Promedio de Notas</h5>
                                        <h2>{resumen.promedioNotas.toFixed(1)}</h2>
                                    </div>
                                </div>
                            </div>

                            <h5 className="mb-3">Historial de Notas</h5>
                            <table className="table table-dark table-striped mb-4">
                                <thead>
                                    <tr>
                                        <th>Asignatura</th>
                                        <th>Curso</th>
                                        <th>Nota</th>
                                        <th>Descripción</th>
                                        <th>Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resumen.notas.map(n => (
                                        <tr key={n.id}>
                                            <td>{n.nombreAsignatura || `ID: ${n.asignaturaId}`}</td>
                                            <td>{n.nombreCurso || '—'}</td>
                                            <td>{n.nota}</td>
                                            <td>{n.descripcion}</td>
                                            <td>{formatearFecha(n.fechaCreacion)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <h5 className="mb-3">Historial de Anotaciones</h5>
                            <table className="table table-dark table-striped">
                                <thead>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Descripción</th>
                                        <th>Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resumen.anotaciones.map(a => (
                                        <tr key={a.id}>
                                            <td>
                                                <span className={`badge ${a.tipo === 'POSITIVA' ? 'bg-success' : 'bg-danger'}`}>
                                                    {a.tipo}
                                                </span>
                                            </td>
                                            <td>{a.descripcion}</td>
                                            <td>{formatearFecha(a.fechaCreacion)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <button
                                className="btn btn-sm medieval-btn mt-3"
                                onClick={() => {
                                    setResumen(null)
                                    setEstudianteSeleccionado(null)
                                }}
                            >
                                Cambiar estudiante
                            </button>
                        </>
                    )}
                </div>
            )}

        </div>
    )
}

export default DocenteDashboard