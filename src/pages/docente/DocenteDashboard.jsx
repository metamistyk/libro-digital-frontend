import { useEffect, useState } from 'react'

import { useAuth0 } from '@auth0/auth0-react'

import {
    obtenerEstudiantes
} from '../../api/usuariosApi'

import {
    obtenerAsignaturas
} from '../../api/academicoApi'

import {
    obtenerAsistencias,
    crearAsistencia,
    obtenerNotas,
    crearNota,
    obtenerAnotaciones,
    crearAnotacion
} from '../../api/asistenciaApi'

function DocenteDashboard() {

    const { getAccessTokenSilently } = useAuth0()

    const [estudiantes, setEstudiantes] = useState([])
    const [asignaturas, setAsignaturas] = useState([])

    const [asistencias, setAsistencias] = useState([])
    const [notas, setNotas] = useState([])
    const [anotaciones, setAnotaciones] = useState([])

    const [error, setError] = useState('')
    const [mensaje, setMensaje] = useState('')

    const [formularioAsistencia, setFormularioAsistencia] = useState({
        estudianteId: '',
        estado: 'PRESENTE'
    })

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

    useEffect(() => {
        cargarDatosIniciales()
    }, [])

    const obtenerToken = async () => {

        return await getAccessTokenSilently({
            authorizationParams: {
                audience: 'https://libro-digital-api'
            }
        })
    }

    const cargarDatosIniciales = async () => {

        try {

            const token = await obtenerToken()

            const [
                estudiantesData,
                asignaturasData
            ] = await Promise.all([
                obtenerEstudiantes(token),
                obtenerAsignaturas(token)
            ])

            setEstudiantes(estudiantesData)
            setAsignaturas(asignaturasData)

        } catch (error) {

            console.error(error)

            setError('No se pudieron cargar los datos.')
        }
    }

    const cargarDatosEstudiante = async (estudianteId) => {

        try {

            const token = await obtenerToken()

            const [
                asistenciasData,
                notasData,
                anotacionesData
            ] = await Promise.all([
                obtenerAsistencias(token, estudianteId),
                obtenerNotas(token, estudianteId),
                obtenerAnotaciones(token, estudianteId)
            ])

            setAsistencias(asistenciasData)
            setNotas(notasData)
            setAnotaciones(anotacionesData)

        } catch (error) {

            console.error(error)
        }
    }

    const manejarCambioAsistencia = async (event) => {

        const { name, value } = event.target

        const nuevoFormulario = {
            ...formularioAsistencia,
            [name]: value
        }

        setFormularioAsistencia(nuevoFormulario)

        if (name === 'estudianteId' && value) {
            await cargarDatosEstudiante(value)
        }
    }

    const manejarCambioNota = async (event) => {

        const { name, value } = event.target

        const nuevoFormulario = {
            ...formularioNota,
            [name]: value
        }

        setFormularioNota(nuevoFormulario)

        if (name === 'estudianteId' && value) {
            await cargarDatosEstudiante(value)
        }
    }

    const manejarCambioAnotacion = async (event) => {

        const { name, value } = event.target

        const nuevoFormulario = {
            ...formularioAnotacion,
            [name]: value
        }

        setFormularioAnotacion(nuevoFormulario)

        if (name === 'estudianteId' && value) {
            await cargarDatosEstudiante(value)
        }
    }

    const guardarAsistencia = async (event) => {

        event.preventDefault()

        setError('')
        setMensaje('')

        try {

            const token = await obtenerToken()

            const payload = {
                estudianteId: Number(formularioAsistencia.estudianteId),
                estado: formularioAsistencia.estado
            }

            await crearAsistencia(token, payload)

            setMensaje('Asistencia registrada.')

            await cargarDatosEstudiante(
                formularioAsistencia.estudianteId
            )

        } catch (error) {

            console.error(error)

            setError('No se pudo registrar asistencia.')
        }
    }

    const guardarNota = async (event) => {

        event.preventDefault()

        setError('')
        setMensaje('')

        try {

            const token = await obtenerToken()

            const payload = {
                estudianteId: Number(formularioNota.estudianteId),
                asignaturaId: Number(formularioNota.asignaturaId),
                nota: Number(formularioNota.nota),
                descripcion: formularioNota.descripcion
            }

            await crearNota(token, payload)

            setMensaje('Nota registrada.')

            await cargarDatosEstudiante(
                formularioNota.estudianteId
            )

        } catch (error) {

            console.error(error)

            setError('No se pudo registrar la nota.')
        }
    }

    const guardarAnotacion = async (event) => {

        event.preventDefault()

        setError('')
        setMensaje('')

        try {

            const token = await obtenerToken()

            const payload = {
                estudianteId: Number(formularioAnotacion.estudianteId),
                descripcion: formularioAnotacion.descripcion,
                tipo: formularioAnotacion.tipo
            }

            await crearAnotacion(token, payload)

            setMensaje('Anotación registrada.')

            await cargarDatosEstudiante(
                formularioAnotacion.estudianteId
            )

        } catch (error) {

            console.error(error)

            setError('No se pudo registrar la anotación.')
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

            </div>

            <div className="medieval-card mb-4">

                <h2 className="mb-4">
                    Registrar Asistencia
                </h2>

                <form
                    onSubmit={guardarAsistencia}
                    className="row g-3"
                >

                    <div className="col-md-6">

                        <select
                            name="estudianteId"
                            className="form-select"
                            value={formularioAsistencia.estudianteId}
                            onChange={manejarCambioAsistencia}
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

                    <div className="col-md-4">

                        <select
                            name="estado"
                            className="form-select"
                            value={formularioAsistencia.estado}
                            onChange={manejarCambioAsistencia}
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

                    <div className="col-md-2">

                        <button
                            className="btn medieval-btn w-100"
                            type="submit"
                        >
                            Guardar
                        </button>

                    </div>

                </form>

            </div>

            <div className="medieval-card mb-4">

                <h2 className="mb-4">
                    Registrar Nota
                </h2>

                <form
                    onSubmit={guardarNota}
                    className="row g-3"
                >

                    <div className="col-md-3">

                        <select
                            name="estudianteId"
                            className="form-select"
                            value={formularioNota.estudianteId}
                            onChange={manejarCambioNota}
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

                    <div className="col-md-3">

                        <select
                            name="asignaturaId"
                            className="form-select"
                            value={formularioNota.asignaturaId}
                            onChange={manejarCambioNota}
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

                    <div className="col-md-2">

                        <input
                            type="number"
                            step="0.1"
                            min="1"
                            max="7"
                            name="nota"
                            className="form-control"
                            placeholder="Nota"
                            value={formularioNota.nota}
                            onChange={manejarCambioNota}
                        />

                    </div>

                    <div className="col-md-2">

                        <input
                            type="text"
                            name="descripcion"
                            className="form-control"
                            placeholder="Descripción"
                            value={formularioNota.descripcion}
                            onChange={manejarCambioNota}
                        />

                    </div>

                    <div className="col-md-2">

                        <button
                            className="btn medieval-btn w-100"
                            type="submit"
                        >
                            Guardar
                        </button>

                    </div>

                </form>

            </div>

            <div className="medieval-card mb-4">

                <h2 className="mb-4">
                    Registrar Anotación
                </h2>

                <form
                    onSubmit={guardarAnotacion}
                    className="row g-3"
                >

                    <div className="col-md-3">

                        <select
                            name="estudianteId"
                            className="form-select"
                            value={formularioAnotacion.estudianteId}
                            onChange={manejarCambioAnotacion}
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

                    <div className="col-md-5">

                        <input
                            type="text"
                            name="descripcion"
                            className="form-control"
                            placeholder="Descripción"
                            value={formularioAnotacion.descripcion}
                            onChange={manejarCambioAnotacion}
                        />

                    </div>

                    <div className="col-md-2">

                        <select
                            name="tipo"
                            className="form-select"
                            value={formularioAnotacion.tipo}
                            onChange={manejarCambioAnotacion}
                        >

                            <option value="POSITIVA">
                                POSITIVA
                            </option>

                            <option value="NEGATIVA">
                                NEGATIVA
                            </option>

                        </select>

                    </div>

                    <div className="col-md-2">

                        <button
                            className="btn medieval-btn w-100"
                            type="submit"
                        >
                            Guardar
                        </button>

                    </div>

                </form>

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
                                    <td>{asistencia.fechaHora}</td>
                                    <td>{asistencia.estado}</td>
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
                                    <td>{nota.asignaturaId}</td>
                                    <td>{nota.nota}</td>
                                    <td>{nota.descripcion}</td>
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
                                    <td>{anotacion.tipo}</td>
                                    <td>{anotacion.descripcion}</td>
                                    <td>{anotacion.fechaCreacion}</td>
                                </tr>
                            ))
                        }

                    </tbody>

                </table>

            </div>

        </div>
    )
}

export default DocenteDashboard