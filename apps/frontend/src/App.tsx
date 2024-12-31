import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Editor from './pages/Editor'
import Navbar from './components/Navbar'
import AllDocs from './pages/AllDocs'
import Signin from './pages/Signin'
import Signup from './pages/Signup'

function App() {
  return (
    <>
      <BrowserRouter>
          <Navbar/>
          <Routes>
            <Route path='/signin' element={<Signin/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/documents' element={<AllDocs/>}/>
            <Route path='/document/:slug/:id' element={<Editor/>}/>
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
