
import './App.css';

import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"

// Serve para mapear se a autenticaçao do usuário foi feita com sucesso
// Por isso se consegue controlar a autenticação do usuário sem outros recursos.
import { onAuthStateChanged } from 'firebase/auth';

// hooks
import { useState, useEffect } from 'react';
import { useAuthentication } from './hooks/useAuthentication';


// Context
import { AuthProvider } from './context/AuthContext';


//pages
import Inicio from './pages/Inicio/Inicio';
import About from './pages/About/About';
import Navbar from './componentes/Navbar';
import Footer from './componentes/Footer';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import CreatePost from './pages/CreatePost/CreatePost';

function App() {

  // Iniciando a lógica de como chamar o usuário ou como monitorar o status dele na função

  const [user, setUSer] = useState(undefined)
  const { auth }  = useAuthentication()

  const loadingUser = user === undefined
  // atribuo a esse estado de loading do usuário o valor do usuário comparado com o undefined
  // ou seja, se for undefined, quer dizer que esta carregando de alguma maneira

  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      setUSer(user)
    } )

  }, [auth])

  if (loadingUser) {
    return <p>Carragando...</p>
  }

  return (
    <div className="App">
      <AuthProvider value={{user}}>
       <BrowserRouter>
         <h1>Miniblog</h1>
          <Navbar/>
            <div className='container'>
            <Routes>
              <Route path='/' element={<Inicio/>} />
              <Route path='/about' element={<About/>} />
              <Route path='/login' element={!user ? <Login/> : <Navigate to= "/"/>} />
              <Route path='/register' element={!user ? <Register/> : <Navigate to= "/"/>} />
              <Route path='/posts/create' element={user ? <CreatePost/> : <Navigate to= "/login"/>} />
              <Route path='/dashboard' element={user ? <Dashboard/> : <Navigate to= "/login"/>} />
            </Routes>
      </div> 
      <Footer/>     
       </BrowserRouter>
      </AuthProvider>
    
    </div>
  );
}

export default App;
