import './App.css'
import {AuthProvider} from "./context/AuthContext.jsx";
import { BrowserRouter } from 'react-router-dom';
import AppRouter from "./router/AppRouter.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRouter />
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
