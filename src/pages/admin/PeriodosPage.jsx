import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

import {
    obtenerPeriodos,
    crearPeriodo
} from '../../api/academicoApi'

function PeriodosPage() {

    const { getAccessTokenSilently } = useAuth0()

    const [periodos, setPeriodos] = useState([])
    const [error, setError] = useState('')

    const [formulario, setFormulario] = useState({
        nombre: '',
        fechaInicio: '',
        fechaFin: ''
    })

    useEffect(() => {
        cargarPeriodos()
    }, [])

    const obtenerToken = async () => {
        return await getAccessTokenSilently({
            authorizationParams: {
                audience: 'https://libro-digital-api'
            }
        })
    }

    const cargarPeriodos = async () => {

        try {
            const token = await obtenerToken()

            const data = await obtenerPeriodos(token)

            setPeriodos(data)
            setError('')
        } catch (error) {
            console.error(error)
            setError('No se pudieron cargar los periodos.')
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
            fechaInicio: '',
            fechaFin: ''
        })
    }

    const guardarPeriodo = async (event) => {

        event.preventDefault()

        if (
            !formulario.nombre ||
            !formulario.fechaInicio ||
            !formulario.fechaFin
        ) {
            setError('Todos los campos son obligatorios.')
            return
        }

        try {

            const token = await obtenerToken()

            await crearPeriodo(token, formulario)

            limpiarFormulario()
            await cargarPeriodos()

        } catch (error) {

            console.error(error)
            setError('No se pudo guardar el periodo.')
        }
    }

    return (
        <div className="container py-5">

            <div className="medieval-card mb-4">

                <h1 className="mb-4">
                    Gestión de Periodos Académicos
                </h1>

                {
                    error && (
                        <div className="alert alert-warning">
                            {error}
                        </div>
                    )
                }

                <form
                    onSubmit={guardarPeriodo}
                    className="row g-3"
                >

                    <div className="col-md-4">

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

                    <div className="col-md-4">

                        <label className="form-label">
                            Fecha Inicio
                        </label>

                        <input
                            type="date"
                            name="fechaInicio"
                            className="form-control"
                            value={formulario.fechaInicio}
                            onChange={manejarCambio}
                        />

                    </div>

                    <div className="col-md-4">

                        <label className="form-label">
                            Fecha Fin
                        </label>

                        <input
                            type="date"
                            name="fechaFin"
                            className="form-control"
                            value={formulario.fechaFin}
                            onChange={manejarCambio}
                        />

                    </div>

                    <div className="col-12">

                        <button
                            className="btn medieval-btn"
                            type="submit"
                        >
                            Crear Periodo
                        </button>

                    </div>

                </form>

            </div>

            <div className="medieval-card">

                <h2 className="mb-4">
                    Periodos Registrados
                </h2>

                <div className="table-responsive">

                    <table className="table table-dark table-striped align-middle">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Fecha Inicio</th>
                                <th>Fecha Fin</th>
                            </tr>

                        </thead>

                        <tbody>

                            {
                                periodos.map(periodo => (
                                    <tr key={periodo.id}>

                                        <td>{periodo.id}</td>
                                        <td>{periodo.nombre}</td>
                                        <td>{periodo.fechaInicio}</td>
                                        <td>{periodo.fechaFin}</td>

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

export default PeriodosPage