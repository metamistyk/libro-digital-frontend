import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

import {
    obtenerUsuarios,
    crearUsuario
} from '../../api/usuariosApi'

function UsuariosPage() {

    const { getAccessTokenSilently } = useAuth0()

    const [usuarios, setUsuarios] = useState([])
    const [error, setError] = useState('')

    const [formulario, setFormulario] = useState({
        nombre: '',
        apellido: '',
        email: '',
        rolId: ''
    })

    useEffect(() => {
        cargarUsuarios()
    }, [])

    const obtenerToken = async () => {
        return await getAccessTokenSilently({
            authorizationParams: {
                audience: 'https://libro-digital-api'
            }
        })
    }

    const cargarUsuarios = async () => {
        try {
            const token = await obtenerToken()
            const data = await obtenerUsuarios(token)

            setUsuarios(data)
            setError('')
        } catch (error) {
            console.error(error)
            setError('No se pudieron cargar los usuarios.')
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
            rolId: ''
        })
    }

    const guardarUsuario = async (event) => {
        event.preventDefault()

        if (
            !formulario.nombre ||
            !formulario.apellido ||
            !formulario.email ||
            !formulario.rolId
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
                rolId: Number(formulario.rolId)
            }

            await crearUsuario(token, payload)

            limpiarFormulario()
            await cargarUsuarios()
        } catch (error) {
            console.error(error)
            setError('No se pudo crear el usuario.')
        }
    }

    return (
        <div className="container py-5">

            <div className="medieval-card mb-4">

                <h1 className="mb-4">
                    Gestión de Usuarios
                </h1>

                {error && <div className="alert alert-warning">{error}</div>}

                <form onSubmit={guardarUsuario} className="row g-3">

                    <div className="col-md-3">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            className="form-control"
                            value={formulario.nombre}
                            onChange={manejarCambio}
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Apellido</label>
                        <input
                            type="text"
                            name="apellido"
                            className="form-control"
                            value={formulario.apellido}
                            onChange={manejarCambio}
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formulario.email}
                            onChange={manejarCambio}
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Rol</label>
                        <select
                            name="rolId"
                            className="form-select"
                            value={formulario.rolId}
                            onChange={manejarCambio}
                        >
                            <option value="">Seleccione rol</option>
                            <option value="1">Admin</option>
                            <option value="2">Docente</option>
                            <option value="3">Estudiante</option>
                        </select>
                    </div>

                    <div className="col-12">
                        <button className="btn medieval-btn" type="submit">
                            Crear Usuario
                        </button>
                    </div>

                </form>

            </div>

            <div className="medieval-card">

                <h2 className="mb-4">
                    Usuarios Registrados
                </h2>

                <div className="table-responsive">

                    <table className="table table-dark table-striped align-middle">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Email</th>
                                <th>Rol</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                usuarios.map(usuario => (
                                    <tr key={usuario.id}>
                                        <td>{usuario.id}</td>
                                        <td>{usuario.nombre}</td>
                                        <td>{usuario.apellido}</td>
                                        <td>{usuario.email}</td>
                                        <td>{usuario.nombreRol}</td>
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

export default UsuariosPage