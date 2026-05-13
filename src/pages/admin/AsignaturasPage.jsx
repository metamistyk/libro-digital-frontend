import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

import {
    obtenerCursos,
    obtenerAsignaturas,
    crearAsignatura,
    actualizarAsignatura,
    eliminarAsignatura
} from '../../api/academicoApi'

function AsignaturasPage() {

    const { getAccessTokenSilently } = useAuth0()

    const [cursos, setCursos] = useState([])
    const [asignaturas, setAsignaturas] = useState([])
    const [editandoId, setEditandoId] = useState(null)
    const [error, setError] = useState('')

    const [formulario, setFormulario] = useState({
        nombre: '',
        codigo: '',
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
            const asignaturasData = await obtenerAsignaturas(token)

            setCursos(cursosData)
            setAsignaturas(asignaturasData)
            setError('')
        } catch (error) {
            console.error(error)
            setError('No se pudieron cargar las asignaturas.')
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
            codigo: '',
            cursoId: ''
        })

        setEditandoId(null)
    }

    const guardarAsignatura = async (event) => {
        event.preventDefault()

        if (!formulario.nombre || !formulario.codigo || !formulario.cursoId) {
            setError('Todos los campos son obligatorios.')
            return
        }

        try {
            const token = await obtenerToken()

            const payload = {
                nombre: formulario.nombre,
                codigo: formulario.codigo,
                cursoId: Number(formulario.cursoId)
            }

            if (editandoId) {
                await actualizarAsignatura(token, editandoId, payload)
            } else {
                await crearAsignatura(token, payload)
            }

            limpiarFormulario()
            await cargarDatos()
        } catch (error) {
            console.error(error)
            setError('No se pudo guardar la asignatura.')
        }
    }

    const prepararEdicion = (asignatura) => {
        setEditandoId(asignatura.id)

        setFormulario({
            nombre: asignatura.nombre,
            codigo: asignatura.codigo,
            cursoId: asignatura.cursoId
        })
    }

    const borrarAsignatura = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar esta asignatura?')) {
            return
        }

        try {
            const token = await obtenerToken()

            await eliminarAsignatura(token, id)
            await cargarDatos()
        } catch (error) {
            console.error(error)
            setError('No se pudo eliminar la asignatura. Puede tener asignaciones docentes asociadas.')
        }
    }

    return (
        <div className="container py-5">

            <div className="medieval-card mb-4">
                <h1 className="mb-4">Gestión de Asignaturas</h1>

                {error && <div className="alert alert-warning">{error}</div>}

                <form onSubmit={guardarAsignatura} className="row g-3">

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
                        <label className="form-label">Código</label>
                        <input
                            type="text"
                            name="codigo"
                            className="form-control"
                            value={formulario.codigo}
                            onChange={manejarCambio}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Curso</label>
                        <select
                            name="cursoId"
                            className="form-select"
                            value={formulario.cursoId}
                            onChange={manejarCambio}
                        >
                            <option value="">Seleccione un curso</option>

                            {cursos.map(curso => (
                                <option key={curso.id} value={curso.id}>
                                    {curso.nombre} - {curso.seccion}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-12 d-flex gap-2">
                        <button className="btn medieval-btn" type="submit">
                            {editandoId ? 'Actualizar Asignatura' : 'Crear Asignatura'}
                        </button>

                        {editandoId && (
                            <button
                                className="btn btn-secondary"
                                type="button"
                                onClick={limpiarFormulario}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>

                </form>
            </div>

            <div className="medieval-card">
                <h2 className="mb-4">Asignaturas Registradas</h2>

                <div className="table-responsive">
                    <table className="table table-dark table-striped align-middle">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Código</th>
                                <th>Curso</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {asignaturas.map(asignatura => (
                                <tr key={asignatura.id}>
                                    <td>{asignatura.id}</td>
                                    <td>{asignatura.nombre}</td>
                                    <td>{asignatura.codigo}</td>
                                    <td>{asignatura.nombreCurso}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-sm btn-warning"
                                                onClick={() => prepararEdicion(asignatura)}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => borrarAsignatura(asignatura.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default AsignaturasPage