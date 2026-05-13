import { Link } from 'react-router-dom'

function AdminDashboard() {
    return (
        <div className="container py-5">

            <div className="medieval-card">

                <h1 className="mb-4">
                    Panel Administrativo
                </h1>

                <p>
                    Administración central del Libro Digital.
                </p>

                <div className="row g-4 mt-3">

                    <div className="col-md-4">
                        <div className="medieval-card h-100">
                            <h3>Cursos</h3>
                            <p>Gestionar cursos.</p>
                            <Link to="/admin/cursos" className="btn medieval-btn">
                                Gestionar
                            </Link>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="medieval-card h-100">
                            <h3>Asignaturas</h3>
                            <p>Gestionar asignaturas por curso.</p>
                            <Link to="/admin/asignaturas" className="btn medieval-btn">
                                Gestionar
                            </Link>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="medieval-card h-100">
                            <h3>Periodos</h3>
                            <p>Gestionar periodos académicos.</p>
                            <Link to="/admin/periodos" className="btn medieval-btn">
                                Gestionar
                            </Link>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="medieval-card h-100">
                            <h3>Usuarios</h3>
                            <p>Crear usuarios y docentes.</p>
                            <Link to="/admin/usuarios" className="btn medieval-btn">
                                Gestionar
                            </Link>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="medieval-card h-100">
                            <h3>Estudiantes</h3>
                            <p>Crear estudiantes y asignarlos a cursos.</p>
                            <Link to="/admin/estudiantes" className="btn medieval-btn">
                                Gestionar
                            </Link>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="medieval-card h-100">
                            <h3>Docentes</h3>
                            <p>Asignar docentes a cursos y asignaturas.</p>
                            <Link to="/admin/asignaciones-docentes" className="btn medieval-btn">
                                Gestionar
                            </Link>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default AdminDashboard