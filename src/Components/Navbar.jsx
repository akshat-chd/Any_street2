import { NavLink } from "react-router-dom";
import './Navbar.css';
function Navbar(){
    return (
    
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    {/* <a className="navbar-brand" href="#">Navbar</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button> */}
    
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <NavLink className="navbar-brand" to="/">🐾 AnyStreet</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/Adopt">Adopt</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to='/Pages/Sightings'>Sightings</NavLink>
        </li>
         <li className="nav-item">
          <NavLink className="nav-link" to='/Pages/Resources'>Resources</NavLink>
        </li>
      </ul>
     
    </div>
  </div>
</nav>
    
    )
}
export default Navbar;