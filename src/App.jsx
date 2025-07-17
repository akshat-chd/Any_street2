

// import './App.css'
import Navbar from './Components/Navbar'
import AdoptionList from './Pages/Adopt'
import Home from './Pages/Home'
import Sightings from './Pages/Sightings'
import Resources from './Pages/Resources'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
function App() {
 

  return (
    <>
     
    
    <Navbar/>
    <Routes>
     
        <Route path='/' element={<Home />} />
       <Route path ='/Adopt' element ={<AdoptionList/>}></Route>
        <Route path='/Pages/Sightings' element={<Sightings />} />

        <Route path='/Pages/Resources' element={<Resources />} />
      

    </Routes>
    
 
    
      
    </>
  )
}

export default App
