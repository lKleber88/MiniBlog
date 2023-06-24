
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
import Search from './pages/Search/Search';
import Post from './pages/Post/Post';
import EditPost from './pages/EditPost/EditPost';
import Logo from "./Imagens blog/Stillo_black_logo.jpg"

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
    return <p>Carregando...</p>
  }

  return (
    <div className="App">
      <AuthProvider value={{user}}>
       <BrowserRouter>
         <img className='logo' src={Logo} alt="logo Stillo estilo preto" />
          <Navbar/>
            <div className='container'>
            <Routes>
              <Route path='/' element={user ? <Inicio/> : <Navigate to="/login" /> } />
              <Route path='/about' element={<About/>} />
              <Route path='/search' element={<Search/>}/>
              <Route path='/posts/:id' element={<Post/>}/>
              <Route path='/login' element={!user ? <Login/> : <Navigate to= "/"/>} />
              <Route path='/register' element={!user ? <Register/> : <Navigate to= "/"/>} />
              <Route path='/posts/create' element={user ? <CreatePost/> : <Navigate to= "/login"/>} />
              <Route path='/posts/edit/:id' element={user ? <EditPost/> : <Navigate to="/login" /> }/>
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
