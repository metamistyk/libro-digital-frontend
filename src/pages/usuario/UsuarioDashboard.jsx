import { useEffect, useState } from 'react'

import { useAuth0 } from '@auth0/auth0-react'

import {
    obtenerEstudiantes
} from '../../api/usuariosApi'

import {
    obtenerAsistencias,
    obtenerNotas,
    obtenerAnotaciones,
    obtenerNotificaciones
} from '../../api/asistenciaApi'

function UsuarioDashboard() {

    const { user, getAccessTokenSilently } = useAuth0()

    const [estudiante, setEstudiante] = useState(null)

    const [asistencias, setAsistencias] = useState([])
    const [notas, setNotas] = useState([])
    const [anotaciones, setAnotaciones] = useState([])
    const [notificaciones, setNotificaciones] = useState([])

    const [error, setError] = useState('')

    useEffect(() => {
        cargarDatos()
    }, [])

    const obtenerToken = async () => {

        return await getAccessTokenSilently({
            authorizationParams: {
                audience: 'https://libro-digital-api'
            }
        })
    }

    const cargarDatos = async () => {

        try {

            const token = await obtenerToken()

            const estudiantesData =
                await obtenerEstudiantes(token)

            const estudianteEncontrado =
                estudiantesData.find(
                    estudiante =>
                        estudiante.email === user.email
                )

            if (!estudianteEncontrado) {

                setError(
                    'No existe un estudiante asociado a este usuario.'
                )

                return
            }

            setEstudiante(estudianteEncontrado)

            const [
                asistenciasData,
                notasData,
                anotacionesData,
                notificacionesData
            ] = await Promise.all([
                obtenerAsistencias(
                    token,
                    estudianteEncontrado.id
                ),
                obtenerNotas(
                    token,
                    estudianteEncontrado.id
                ),
                obtenerAnotaciones(
                    token,
                    estudianteEncontrado.id
                ),
                obtenerNotificaciones(token)
            ])

            setAsistencias(asistenciasData)
            setNotas(notasData)
            setAnotaciones(anotacionesData)

            const notificacionesFiltradas =
                notificacionesData.filter(
                    notificacion =>
                        notificacion.destinatarioId ===
                        estudianteEncontrado.id
                )

            setNotificaciones(
                notificacionesFiltradas
            )

        } catch (error) {

            console.error(error)

            setError(
                'No se pudo cargar la información del estudiante.'
            )
        }
    }

    return (

        <div className="container py-5">

            <div className="medieval-card mb-4">

                <h1>
                    Portal de Usuario
                </h1>

                <p>
                    Consulta de asistencias, notas, anotaciones y notificaciones.
                </p>

                {
                    estudiante && (
                        <div className="mt-4">

                            <h4>
                                Información del estudiante
                            </h4>

                            <p>
                                <strong>Nombre:</strong>{' '}
                                {estudiante.nombre} {estudiante.apellido}
                            </p>

                            <p>
                                <strong>Email:</strong>{' '}
                                {estudiante.email}
                            </p>

                            <p>
                                <strong>Curso ID:</strong>{' '}
                                {estudiante.cursoId}
                            </p>

                        </div>
                    )
                }

                {
                    error && (
                        <div className="alert alert-warning mt-3">
                            {error}
                        </div>
                    )
                }

            </div>

            <div className="medieval-card mb-4">

                <h2 className="mb-4">
                    Notificaciones Kafka
                </h2>

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

                        {
                            notificaciones.map(notificacion => (

                                <tr key={notificacion.id}>

                                    <td>
                                        {notificacion.id}
                                    </td>

                                    <td>
                                        {notificacion.mensaje}
                                    </td>

                                    <td>
                                        {notificacion.estado}
                                    </td>

                                    <td>
                                        {notificacion.fechaCreacion}
                                    </td>

                                </tr>
                            ))
                        }

                    </tbody>

                </table>

            </div>

            <div className="medieval-card mb-4">

                <h2 className="mb-4">
                    Historial de Asistencias
                </h2>

                <table className="table table-dark table-striped">

                    <thead>

                        <tr>
                            <th>ID</th>
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

            <div className="medieval-card mb-4">

                <h2 className="mb-4">
                    Historial de Notas
                </h2>

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

                        {
                            notas.map(nota => (

                                <tr key={nota.id}>

                                    <td>{nota.id}</td>

                                    <td>
                                        {nota.asignaturaId}
                                    </td>

                                    <td>
                                        {nota.nota}
                                    </td>

                                    <td>
                                        {nota.descripcion}
                                    </td>

                                </tr>
                            ))
                        }

                    </tbody>

                </table>

            </div>

            <div className="medieval-card">

                <h2 className="mb-4">
                    Historial de Anotaciones
                </h2>

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

                        {
                            anotaciones.map(anotacion => (

                                <tr key={anotacion.id}>

                                    <td>{anotacion.id}</td>

                                    <td>
                                        {anotacion.tipo}
                                    </td>

                                    <td>
                                        {anotacion.descripcion}
                                    </td>

                                    <td>
                                        {anotacion.fechaCreacion}
                                    </td>

                                </tr>
                            ))
                        }

                    </tbody>

                </table>

            </div>

        </div>
    )
}

export default UsuarioDashboard