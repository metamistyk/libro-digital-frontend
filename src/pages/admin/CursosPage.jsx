import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

import {
    obtenerCursos,
    crearCurso,
    actualizarCurso,
    eliminarCurso
} from '../../api/academicoApi'

function CursosPage() {

    const { getAccessTokenSilently } = useAuth0()

    const [cursos, setCursos] = useState([])
    const [editandoId, setEditandoId] = useState(null)
    const [error, setError] = useState('')
    const [formulario, setFormulario] = useState({
        nombre: '',
        nivel: '',
        seccion: ''
    })

    useEffect(() => {
        cargarCursos()
    }, [])

    const obtenerToken = async () => {
        return await getAccessTokenSilently({
            authorizationParams: {
                audience: 'https://libro-digital-api'
            }
        })
    }

    const cargarCursos = async () => {

        try {
            const token = await obtenerToken()
            const data = await obtenerCursos(token)

            setCursos(data)
            setError('')
        } catch (error) {
            console.error('Error cargando cursos:', error)
            setError('No se pudieron cargar los cursos. Verifica que academico-service esté activo y que el token Auth0 sea válido.')
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
            nivel: '',
            seccion: ''
        })

        setEditandoId(null)
    }

    const guardarCurso = async (event) => {
        event.preventDefault()

        if (!formulario.nombre || !formulario.nivel || !formulario.seccion) {
            setError('Todos los campos son obligatorios.')
            return
        }

        try {
            const token = await obtenerToken()

            if (editandoId) {
                await actualizarCurso(token, editandoId, formulario)
            } else {
                await crearCurso(token, formulario)
            }

            limpiarFormulario()
            await cargarCursos()
            setError('')
        } catch (error) {
            console.error('Error guardando curso:', error)
            setError('No se pudo guardar el curso.')
        }
    }

    const prepararEdicion = (curso) => {
        setEditandoId(curso.id)

        setFormulario({
            nombre: curso.nombre,
            nivel: curso.nivel,
            seccion: curso.seccion
        })
    }

    const borrarCurso = async (id) => {
        const confirmar = window.confirm('¿Seguro que deseas eliminar este curso?')

        if (!confirmar) {
            return
        }

        try {
            const token = await obtenerToken()

            await eliminarCurso(token, id)
            await cargarCursos()
            setError('')
        } catch (error) {
            console.error('Error eliminando curso:', error)
            setError('No se pudo eliminar el curso. Puede tener asignaturas asociadas.')
        }
    }

    return (
        <div className="container py-5">

            <div className="medieval-card mb-4">

                <h1 className="mb-4">
                    Gestión de Cursos
                </h1>

                {
                    error && (
                        <div className="alert alert-warning">
                            {error}
                        </div>
                    )
                }

                <form onSubmit={guardarCurso} className="row g-3">

                    <div className="col-md-4">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            className="form-control"
                            value={formulario.nombre}
                            onChange={manejarCambio}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Nivel</label>
                        <input
                            type="text"
                            name="nivel"
                            className="form-control"
                            value={formulario.nivel}
                            onChange={manejarCambio}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Sección</label>
                        <input
                            type="text"
                            name="seccion"
                            className="form-control"
                            value={formulario.seccion}
                            onChange={manejarCambio}
                        />
                    </div>

                    <div className="col-12 d-flex gap-2">
                        <button className="btn medieval-btn" type="submit">
                            {editandoId ? 'Actualizar Curso' : 'Crear Curso'}
                        </button>

                        {
                            editandoId && (
                                <button
                                    className="btn btn-secondary"
                                    type="button"
                                    onClick={limpiarFormulario}
                                >
                                    Cancelar
                                </button>
                            )
                        }
                    </div>

                </form>

            </div>

            <div className="medieval-card">

                <h2 className="mb-4">
                    Cursos Registrados
                </h2>

                <div className="table-responsive">

                    <table className="table table-dark table-striped align-middle">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Nivel</th>
                                <th>Sección</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                cursos.map(curso => (
                                    <tr key={curso.id}>
                                        <td>{curso.id}</td>
                                        <td>{curso.nombre}</td>
                                        <td>{curso.nivel}</td>
                                        <td>{curso.seccion}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-sm btn-warning"
                                                    onClick={() => prepararEdicion(curso)}
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => borrarCurso(curso.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
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

export default CursosPage