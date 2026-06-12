import { useEffect, useState, useCallback } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { obtenerRankingEstudiantes } from '../../api/bffApi'

function RankingPage() {

    const { getAccessTokenSilently } = useAuth0()
    const [ranking, setRanking] = useState([])
    const [error, setError] = useState('')

    const cargarRanking = useCallback(async () => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: { audience: 'https://libro-digital-api' }
            })
            const data = await obtenerRankingEstudiantes(token)
            setRanking(data)
        } catch (err) {
            console.error(err)
            setError('No se pudo cargar el ranking.')
        }
    }, [getAccessTokenSilently])

    useEffect(() => {
        const inicializar = async () => {
            await cargarRanking()
        }
        inicializar()
    }, [cargarRanking])

    return (
        <div className="container py-5">
            <div className="medieval-card mb-4">
                <h1 className="mb-3">Ranking de Estudiantes</h1>
                {error && <div className="alert alert-warning">{error}</div>}
            </div>

            <div className="medieval-card">
                <table className="table table-dark table-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Estudiante</th>
                            <th>Promedio</th>
                            <th>Asistencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ranking.map(e => (
                            <tr key={e.id}>
                                <td>{e.posicion}</td>
                                <td>{e.nombre} {e.apellido}</td>
                                <td>{e.promedioNotas.toFixed(1)}</td>
                                <td>{e.porcentajeAsistencia.toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default RankingPage