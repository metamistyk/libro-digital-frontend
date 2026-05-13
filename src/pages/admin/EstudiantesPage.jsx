import { useEffect, useState } from 'react'

import { useAuth0 } from '@auth0/auth0-react'

import { obtenerCursos } from '../../api/academicoApi'

import {
    obtenerEstudiantes,
    crearEstudiante
} from '../../api/usuariosApi'

function EstudiantesPage() {

    const { getAccessTokenSilently } = useAuth0()

    const [cursos, setCursos] = useState([])
    const [estudiantes, setEstudiantes] = useState([])

    const [error, setError] = useState('')

    const [formulario, setFormulario] = useState({
        nombre: '',
        apellido: '',
        email: '',
        cursoId: ''
    })

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

            const cursosData = await obtenerCursos(token)

            const estudiantesData = await obtenerEstudiantes(token)

            console.log('Cursos cargados:', cursosData)

            setCursos(cursosData)

            setEstudiantes(estudiantesData)

            setError('')

        } catch (error) {

            console.error(error)

            setError('No se pudieron cargar los estudiantes.')
        }
    }

    const manejarCambio = (event) => {

        const { name, value } = event.target

        setFormulario({
            ...formulario,
            [name]: value
        })
    }

    const limpiarFormulario = () => {

        setFormulario({
            nombre: '',
            apellido: '',
            email: '',
            cursoId: ''
        })
    }

    const guardarEstudiante = async (event) => {

        event.preventDefault()

        if (
            !formulario.nombre ||
            !formulario.apellido ||
            !formulario.email ||
            !formulario.cursoId
        ) {

            setError('Todos los campos son obligatorios.')

            return
        }

        try {

            const token = await obtenerToken()

            const payload = {
                nombre: formulario.nombre,
                apellido: formulario.apellido,
                email: formulario.email,
                cursoId: Number(formulario.cursoId)
            }

            await crearEstudiante(token, payload)

            limpiarFormulario()

            await cargarDatos()

        } catch (error) {

            console.error(error)

            setError('No se pudo crear el estudiante.')
        }
    }

    return (

        <div className="container py-5">

            <div className="medieval-card mb-4">

                <h1 className="mb-4">
                    Gestión de Estudiantes
                </h1>

                {
                    error && (
                        <div className="alert alert-warning">
                            {error}
                        </div>
                    )
                }

                <form
                    onSubmit={guardarEstudiante}
                    className="row g-3"
                >

                    <div className="col-md-3">

                        <label className="form-label">
                            Nombre
                        </label>

                        <input
                            type="text"
                            name="nombre"
                            className="form-control"
                            value={formulario.nombre}
                            onChange={manejarCambio}
                        />

                    </div>

                    <div className="col-md-3">

                        <label className="form-label">
                            Apellido
                        </label>

                        <input
                            type="text"
                            name="apellido"
                            className="form-control"
                            value={formulario.apellido}
                            onChange={manejarCambio}
                        />

                    </div>

                    <div className="col-md-3">

                        <label className="form-label">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formulario.email}
                            onChange={manejarCambio}
                        />

                    </div>

                    <div className="col-md-3">

                        <label className="form-label">
                            Curso
                        </label>

                        <select
                            name="cursoId"
                            className="form-select"
                            value={formulario.cursoId}
                            onChange={manejarCambio}
                        >

                            <option value="">
                                Seleccione curso
                            </option>

                            {
                                cursos.map(curso => (

                                    <option
                                        key={curso.id}
                                        value={curso.id}
                                    >
                                        {curso.nombre} - {curso.seccion}
                                    </option>
                                ))
                            }

                        </select>

                    </div>

                    <div className="col-12">

                        <button
                            className="btn medieval-btn"
                            type="submit"
                        >
                            Crear Estudiante
                        </button>

                    </div>

                </form>

            </div>

            <div className="medieval-card">

                <h2 className="mb-4">
                    Estudiantes Registrados
                </h2>

                <div className="table-responsive">

                    <table className="table table-dark table-striped align-middle">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Email</th>
                                <th>Curso ID</th>
                            </tr>

                        </thead>

                        <tbody>

                            {
                                estudiantes.map(estudiante => (

                                    <tr key={estudiante.id}>

                                        <td>{estudiante.id}</td>
                                        <td>{estudiante.nombre}</td>
                                        <td>{estudiante.apellido}</td>
                                        <td>{estudiante.email}</td>
                                        <td>{estudiante.cursoId}</td>

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

export default EstudiantesPage