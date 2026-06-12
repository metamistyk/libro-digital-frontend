import { useEffect, useState, useCallback } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { obtenerEstudiantesBff, obtenerResumenEstudiante } from '../../api/bffApi'
import { crearAsistencia, crearNota, crearAnotacion } from '../../api/asistenciaApi'

function DocenteDashboard() {

    const { getAccessTokenSilently } = useAuth0()

    const [estudiantes, setEstudiantes] = useState([])
    const [resumen, setResumen] = useState(null)
    const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null)
    const [asistenciasMarcadas, setAsistenciasMarcadas] = useState({})
    const [formularioNota, setFormularioNota] = useState({
        asignaturaId: '',
        nota: '',
        descripcion: ''
    })
    const [formularioAnotacion, setFormularioAnotacion] = useState({
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
            data.forEach(e => {
                estadosIniciales[e.id] = 'PRESENTE'
            })
            setAsistenciasMarcadas(estadosIniciales)

        } catch (err) {
            console.error(err)
            setError('No se pudieron cargar los estudiantes.')
        }
    }, [obtenerToken])

    const seleccionarEstudiante = async (estudiante) => {
        try {
            const token = await obtenerToken()
            setEstudianteSeleccionado(estudiante)
            const data = await obtenerResumenEstudiante(token, estudiante.id)
            setResumen(data)
        } catch (err) {
            console.error(err)
            setError('No se pudo cargar el resumen del estudiante.')
        }
    }

    const cambiarEstadoAsistencia = (estudianteId, estado) => {
        setAsistenciasMarcadas(prev => ({
            ...prev,
            [estudianteId]: estado
        }))
    }

    const guardarAsistencias = async () => {
        setError('')
        setMensaje('')
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

            if (estudianteSeleccionado) {
                const data = await obtenerResumenEstudiante(token, estudianteSeleccionado.id)
                setResumen(data)
            }

        } catch (err) {
            console.error(err)
            setError('Error al registrar asistencias.')
        }
    }

    const guardarNota = async (event) => {
        event.preventDefault()
        setError('')
        setMensaje('')

        if (!estudianteSeleccionado) {
            setError('Selecciona un estudiante primero.')
            return
        }

        try {
            const token = await obtenerToken()
            await crearNota(token, {
                estudianteId: estudianteSeleccionado.id,
                asignaturaId: Number(formularioNota.asignaturaId),
                nota: Number(formularioNota.nota),
                descripcion: formularioNota.descripcion
            })
            setMensaje('Nota registrada.')
            const data = await obtenerResumenEstudiante(token, estudianteSeleccionado.id)
            setResumen(data)
        } catch (err) {
            console.error(err)
            setError('Error al registrar nota.')
        }
    }

    const guardarAnotacion = async (event) => {
        event.preventDefault()
        setError('')
        setMensaje('')

        if (!estudianteSeleccionado) {
            setError('Selecciona un estudiante primero.')
            return
        }

        try {
            const token = await obtenerToken()
            await crearAnotacion(token, {
                estudianteId: estudianteSeleccionado.id,
                descripcion: formularioAnotacion.descripcion,
                tipo: formularioAnotacion.tipo
            })
            setMensaje('Anotación registrada.')
            const data = await obtenerResumenEstudiante(token, estudianteSeleccionado.id)
            setResumen(data)
        } catch (err) {
            console.error(err)
            setError('Error al registrar anotación.')
        }
    }

    useEffect(() => {
        const inicializar = async () => {
            await cargarEstudiantes()
        }

        inicializar()
    }, [cargarEstudiantes])

    return (
        <div className="container py-5">

            <div className="medieval-card mb-4">
                <h1 className="mb-3">Portal Docente</h1>
                {mensaje && <div className="alert alert-success">{mensaje}</div>}
                {error && <div className="alert alert-warning">{error}</div>}
            </div>

            <div className="medieval-card mb-4">
                <h2 className="mb-3">Registro de Asistencia</h2>
                <table className="table table-dark table-striped">
                    <thead>
                        <tr>
                            <th>Estudiante</th>
                            <th>Presente</th>
                            <th>Ausente</th>
                            <th>Atraso</th>
                            <th>Ver detalle</th>
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
                                    />
                                </td>
                                <td>
                                    <input
                                        type="radio"
                                        name={`asistencia-${e.id}`}
                                        checked={asistenciasMarcadas[e.id] === 'AUSENTE'}
                                        onChange={() => cambiarEstadoAsistencia(e.id, 'AUSENTE')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="radio"
                                        name={`asistencia-${e.id}`}
                                        checked={asistenciasMarcadas[e.id] === 'ATRASO'}
                                        onChange={() => cambiarEstadoAsistencia(e.id, 'ATRASO')}
                                    />
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm medieval-btn"
                                        onClick={() => seleccionarEstudiante(e)}
                                    >
                                        Ver
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="btn medieval-btn mt-2" onClick={guardarAsistencias}>
                    Guardar Asistencias
                </button>
            </div>

            {resumen && (
                <div className="medieval-card mb-4">
                    <h2 className="mb-3">
                        Resumen: {resumen.nombre} {resumen.apellido}
                    </h2>
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

                    <h4 className="mb-3">Registrar Nota</h4>
                    <form onSubmit={guardarNota} className="row g-3 mb-4">
                        <div className="col-md-3">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="ID Asignatura"
                                value={formularioNota.asignaturaId}
                                onChange={e => setFormularioNota({
                                    ...formularioNota,
                                    asignaturaId: e.target.value
                                })}
                            />
                        </div>
                        <div className="col-md-2">
                            <input
                                type="number"
                                step="0.1"
                                min="1"
                                max="7"
                                className="form-control"
                                placeholder="Nota"
                                value={formularioNota.nota}
                                onChange={e => setFormularioNota({
                                    ...formularioNota,
                                    nota: e.target.value
                                })}
                            />
                        </div>
                        <div className="col-md-5">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Descripción"
                                value={formularioNota.descripcion}
                                onChange={e => setFormularioNota({
                                    ...formularioNota,
                                    descripcion: e.target.value
                                })}
                            />
                        </div>
                        <div className="col-md-2">
                            <button className="btn medieval-btn w-100" type="submit">
                                Guardar
                            </button>
                        </div>
                    </form>

                    <h4 className="mb-3">Registrar Anotación</h4>
                    <form onSubmit={guardarAnotacion} className="row g-3 mb-4">
                        <div className="col-md-7">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Descripción"
                                value={formularioAnotacion.descripcion}
                                onChange={e => setFormularioAnotacion({
                                    ...formularioAnotacion,
                                    descripcion: e.target.value
                                })}
                            />
                        </div>
                        <div className="col-md-3">
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
                        <div className="col-md-2">
                            <button className="btn medieval-btn w-100" type="submit">
                                Guardar
                            </button>
                        </div>
                    </form>

                    <h4 className="mb-3">Historial de Notas</h4>
                    <table className="table table-dark table-striped mb-4">
                        <thead>
                            <tr>
                                <th>Asignatura ID</th>
                                <th>Nota</th>
                                <th>Descripción</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resumen.notas.map(n => (
                                <tr key={n.id}>
                                    <td>{n.asignaturaId}</td>
                                    <td>{n.nota}</td>
                                    <td>{n.descripcion}</td>
                                    <td>{n.fechaCreacion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h4 className="mb-3">Historial de Anotaciones</h4>
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
                                    <td>{a.tipo}</td>
                                    <td>{a.descripcion}</td>
                                    <td>{a.fechaCreacion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    )
}

export default DocenteDashboard