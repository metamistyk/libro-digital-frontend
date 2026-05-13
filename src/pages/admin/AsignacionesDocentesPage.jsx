import { useEffect, useState } from 'react'

import { useAuth0 } from '@auth0/auth0-react'

import {
    obtenerCursos,
    obtenerAsignaturas,
    obtenerPeriodos,
    obtenerAsignacionesDocentes,
    crearAsignacionDocente,
    eliminarAsignacionDocente
} from '../../api/academicoApi'

function AsignacionesDocentesPage() {

    const { getAccessTokenSilently } = useAuth0()

    const [cursos, setCursos] = useState([])
    const [asignaturas, setAsignaturas] = useState([])
    const [periodos, setPeriodos] = useState([])
    const [asignaciones, setAsignaciones] = useState([])

    const [error, setError] = useState('')

    const [formulario, setFormulario] = useState({
        docenteId: '',
        cursoId: '',
        asignaturaId: '',
        periodoAcademicoId: ''
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

            const [
                cursosData,
                asignaturasData,
                periodosData,
                asignacionesData
            ] = await Promise.all([
                obtenerCursos(token),
                obtenerAsignaturas(token),
                obtenerPeriodos(token),
                obtenerAsignacionesDocentes(token)
            ])

            setCursos(cursosData)
            setAsignaturas(asignaturasData)
            setPeriodos(periodosData)
            setAsignaciones(asignacionesData)

        } catch (error) {

            console.error(error)
            setError('No se pudieron cargar las asignaciones docentes.')
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
            docenteId: '',
            cursoId: '',
            asignaturaId: '',
            periodoAcademicoId: ''
        })
    }

    const guardarAsignacion = async (event) => {

        event.preventDefault()

        if (
            !formulario.docenteId ||
            !formulario.cursoId ||
            !formulario.asignaturaId ||
            !formulario.periodoAcademicoId
        ) {
            setError('Todos los campos son obligatorios.')
            return
        }

        try {

            const token = await obtenerToken()

            const payload = {
                docenteId: Number(formulario.docenteId),
                cursoId: Number(formulario.cursoId),
                asignaturaId: Number(formulario.asignaturaId),
                periodoAcademicoId: Number(formulario.periodoAcademicoId)
            }

            await crearAsignacionDocente(token, payload)

            limpiarFormulario()

            await cargarDatos()

        } catch (error) {

            console.error(error)
            setError('No se pudo crear la asignación docente.')
        }
    }

    const borrarAsignacion = async (id) => {

        if (!window.confirm('¿Eliminar asignación docente?')) {
            return
        }

        try {

            const token = await obtenerToken()

            await eliminarAsignacionDocente(token, id)

            await cargarDatos()

        } catch (error) {

            console.error(error)
            setError('No se pudo eliminar la asignación.')
        }
    }

    return (
        <div className="container py-5">

            <div className="medieval-card mb-4">

                <h1 className="mb-4">
                    Asignaciones Docentes
                </h1>

                {
                    error && (
                        <div className="alert alert-warning">
                            {error}
                        </div>
                    )
                }

                <form
                    onSubmit={guardarAsignacion}
                    className="row g-3"
                >

                    <div className="col-md-3">

                        <label className="form-label">
                            ID Docente
                        </label>

                        <input
                            type="number"
                            name="docenteId"
                            className="form-control"
                            value={formulario.docenteId}
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

                    <div className="col-md-3">

                        <label className="form-label">
                            Asignatura
                        </label>

                        <select
                            name="asignaturaId"
                            className="form-select"
                            value={formulario.asignaturaId}
                            onChange={manejarCambio}
                        >

                            <option value="">
                                Seleccione asignatura
                            </option>

                            {
                                asignaturas.map(asignatura => (
                                    <option
                                        key={asignatura.id}
                                        value={asignatura.id}
                                    >
                                        {asignatura.nombre}
                                    </option>
                                ))
                            }

                        </select>

                    </div>

                    <div className="col-md-3">

                        <label className="form-label">
                            Periodo
                        </label>

                        <select
                            name="periodoAcademicoId"
                            className="form-select"
                            value={formulario.periodoAcademicoId}
                            onChange={manejarCambio}
                        >

                            <option value="">
                                Seleccione periodo
                            </option>

                            {
                                periodos.map(periodo => (
                                    <option
                                        key={periodo.id}
                                        value={periodo.id}
                                    >
                                        {periodo.nombre}
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
                            Crear Asignación
                        </button>

                    </div>

                </form>

            </div>

            <div className="medieval-card">

                <h2 className="mb-4">
                    Asignaciones Registradas
                </h2>

                <div className="table-responsive">

                    <table className="table table-dark table-striped align-middle">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Docente</th>
                                <th>Curso</th>
                                <th>Asignatura</th>
                                <th>Periodo</th>
                                <th>Acciones</th>
                            </tr>

                        </thead>

                        <tbody>

                            {
                                asignaciones.map(asignacion => (

                                    <tr key={asignacion.id}>

                                        <td>{asignacion.id}</td>
                                        <td>{asignacion.docenteId}</td>
                                        <td>{asignacion.nombreCurso}</td>
                                        <td>{asignacion.nombreAsignatura}</td>
                                        <td>{asignacion.nombrePeriodoAcademico}</td>

                                        <td>

                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => borrarAsignacion(asignacion.id)}
                                            >
                                                Eliminar
                                            </button>

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

export default AsignacionesDocentesPage