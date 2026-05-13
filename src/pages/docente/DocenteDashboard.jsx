import { useEffect, useState } from 'react'

import { useAuth0 } from '@auth0/auth0-react'

import {
    obtenerEstudiantes
} from '../../api/usuariosApi'

import {
    obtenerAsistencias,
    crearAsistencia
} from '../../api/asistenciaApi'

function DocenteDashboard() {

    const { getAccessTokenSilently } = useAuth0()

    const [estudiantes, setEstudiantes] = useState([])
    const [asistencias, setAsistencias] = useState([])

    const [error, setError] = useState('')
    const [mensaje, setMensaje] = useState('')

    const [formulario, setFormulario] = useState({
        estudianteId: '',
        estado: 'PRESENTE'
    })

    useEffect(() => {
        cargarEstudiantes()
    }, [])

    const obtenerToken = async () => {

        return await getAccessTokenSilently({
            authorizationParams: {
                audience: 'https://libro-digital-api'
            }
        })
    }

    const cargarEstudiantes = async () => {

        try {

            const token = await obtenerToken()

            const estudiantesData =
                await obtenerEstudiantes(token)

            setEstudiantes(estudiantesData)

        } catch (error) {

            console.error(error)

            setError('No se pudieron cargar los estudiantes.')
        }
    }

    const cargarAsistencias = async (estudianteId) => {

        try {

            const token = await obtenerToken()

            const asistenciasData =
                await obtenerAsistencias(
                    token,
                    estudianteId
                )

            setAsistencias(asistenciasData)

        } catch (error) {

            console.error(error)

            setError('No se pudieron cargar las asistencias.')
        }
    }

    const manejarCambio = async (event) => {

        const { name, value } = event.target

        const nuevoFormulario = {
            ...formulario,
            [name]: value
        }

        setFormulario(nuevoFormulario)

        if (name === 'estudianteId' && value) {
            await cargarAsistencias(value)
        }
    }

    const guardarAsistencia = async (event) => {

        event.preventDefault()

        setError('')
        setMensaje('')

        try {

            const token = await obtenerToken()

            const payload = {
                estudianteId: Number(formulario.estudianteId),
                estado: formulario.estado
            }

            await crearAsistencia(token, payload)

            setMensaje('Asistencia registrada correctamente.')

            await cargarAsistencias(
                formulario.estudianteId
            )

        } catch (error) {

            console.error(error)

            setError('No se pudo registrar la asistencia.')
        }
    }

    return (

        <div className="container py-5">

            <div className="medieval-card mb-4">

                <h1 className="mb-4">
                    Portal Docente
                </h1>

                {
                    mensaje && (
                        <div className="alert alert-success">
                            {mensaje}
                        </div>
                    )
                }

                {
                    error && (
                        <div className="alert alert-warning">
                            {error}
                        </div>
                    )
                }

                <form
                    onSubmit={guardarAsistencia}
                    className="row g-3"
                >

                    <div className="col-md-6">

                        <label className="form-label">
                            Estudiante
                        </label>

                        <select
                            name="estudianteId"
                            className="form-select"
                            value={formulario.estudianteId}
                            onChange={manejarCambio}
                        >

                            <option value="">
                                Seleccione estudiante
                            </option>

                            {
                                estudiantes.map(estudiante => (
                                    <option
                                        key={estudiante.id}
                                        value={estudiante.id}
                                    >
                                        {estudiante.nombre} {estudiante.apellido}
                                    </option>
                                ))
                            }

                        </select>

                    </div>

                    <div className="col-md-6">

                        <label className="form-label">
                            Estado
                        </label>

                        <select
                            name="estado"
                            className="form-select"
                            value={formulario.estado}
                            onChange={manejarCambio}
                        >

                            <option value="PRESENTE">
                                PRESENTE
                            </option>

                            <option value="AUSENTE">
                                AUSENTE
                            </option>

                            <option value="ATRASO">
                                ATRASO
                            </option>

                        </select>

                    </div>

                    <div className="col-12">

                        <button
                            className="btn medieval-btn"
                            type="submit"
                        >
                            Registrar Asistencia
                        </button>

                    </div>

                </form>

            </div>

            <div className="medieval-card">

                <h2 className="mb-4">
                    Historial de Asistencias
                </h2>

                <div className="table-responsive">

                    <table className="table table-dark table-striped align-middle">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Estudiante ID</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                            </tr>

                        </thead>

                        <tbody>

                            {
                                asistencias.map(asistencia => (

                                    <tr key={asistencia.id}>

                                        <td>{asistencia.id}</td>

                                        <td>
                                            {asistencia.estudianteId}
                                        </td>

                                        <td>
                                            {asistencia.fechaHora}
                                        </td>

                                        <td>
                                            {asistencia.estado}
                                        </td>

                                    </tr>
                                ))
                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    )
}

export default DocenteDashboard