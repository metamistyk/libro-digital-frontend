import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { crearUsuario, obtenerRoles, obtenerUsuarios } from '../../api/usuariosApi'

const UsuariosPage = () => {
    const { getAccessTokenSilently } = useAuth0()

    const [usuarios, setUsuarios] = useState([])
    const [roles, setRoles] = useState([])

    const [formulario, setFormulario] = useState({
        nombre: '',
        apellido: '',
        email: '',
        rolId: ''
    })

    const [mensaje, setMensaje] = useState('')
    const [error, setError] = useState('')

    const obtenerToken = async () => {
        return await getAccessTokenSilently({
            authorizationParams: {
                audience: 'https://libro-digital-api'
            }
        })
    }

    const cargarDatos = async () => {
        try {
            setError('')

            const token = await obtenerToken()

            const rolesData = await obtenerRoles(token)
            const usuariosData = await obtenerUsuarios(token)

            setRoles(rolesData)
            setUsuarios(usuariosData)
        } catch (error) {
            console.error('Error al cargar usuarios o roles:', error)
            setError('No se pudieron cargar los usuarios o roles.')
        }
    }

    useEffect(() => {
        cargarDatos()
    }, [])

    const manejarCambio = (event) => {
        const { name, value } = event.target

        setFormulario({
            ...formulario,
            [name]: value
        })
    }

    const manejarSubmit = async (event) => {
        event.preventDefault()

        setMensaje('')
        setError('')

        try {
            const token = await obtenerToken()

            const usuario = {
                nombre: formulario.nombre,
                apellido: formulario.apellido,
                email: formulario.email,
                rolId: Number(formulario.rolId)
            }

            await crearUsuario(usuario, token)

            setFormulario({
                nombre: '',
                apellido: '',
                email: '',
                rolId: ''
            })

            setMensaje('Usuario creado correctamente.')

            await cargarDatos()
        } catch (error) {
            console.error('Error al crear usuario:', error)
            setError('No se pudo crear el usuario.')
        }
    }

    return (
        <div className="container mt-4">
            <h2>Gestión de Usuarios</h2>

            {mensaje && (
                <div className="alert alert-success">
                    {mensaje}
                </div>
            )}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="card mb-4">
                <div className="card-header">
                    Crear usuario
                </div>

                <div className="card-body">
                    <form onSubmit={manejarSubmit}>
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    className="form-control"
                                    value={formulario.nombre}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Apellido</label>
                                <input
                                    type="text"
                                    name="apellido"
                                    className="form-control"
                                    value={formulario.apellido}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={formulario.email}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Rol</label>
                                <select
                                    name="rolId"
                                    className="form-select"
                                    value={formulario.rolId}
                                    onChange={manejarCambio}
                                    required
                                >
                                    <option value="">Seleccione un rol</option>

                                    {roles.map((rol) => (
                                        <option key={rol.id} value={rol.id}>
                                            {rol.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Crear usuario
                        </button>
                    </form>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    Usuarios registrados
                </div>

                <div className="card-body">
                    <table className="table table-striped">
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
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>{usuario.id}</td>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.apellido}</td>
                                    <td>{usuario.email}</td>
                                    <td>{usuario.nombreRol}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {usuarios.length === 0 && (
                        <p className="text-muted">
                            No hay usuarios registrados.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UsuariosPage