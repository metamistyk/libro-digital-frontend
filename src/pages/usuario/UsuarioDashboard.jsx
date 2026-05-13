import { useEffect, useState } from 'react'

import { useAuth0 } from '@auth0/auth0-react'

import {
    obtenerEstudiantes
} from '../../api/usuariosApi'

import {
    obtenerAsistencias
} from '../../api/asistenciaApi'

function UsuarioDashboard() {

    const { user, getAccessTokenSilently } = useAuth0()

    const [estudiante, setEstudiante] = useState(null)
    const [asistencias, setAsistencias] = useState([])

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

            const asistenciasData =
                await obtenerAsistencias(
                    token,
                    estudianteEncontrado.id
                )

            setAsistencias(asistenciasData)

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
                    Consulta de asistencias y actividades académicas.
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

            <div className="medieval-card">

                <h2 className="mb-4">
                    Historial de Asistencias
                </h2>

                <div className="table-responsive">

                    <table className="table table-dark table-striped align-middle">

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

                                        <td>
                                            {asistencia.id}
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

export default UsuarioDashboard