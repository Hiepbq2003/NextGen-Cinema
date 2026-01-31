import './App.css'
import {AuthProvider} from "./context/AuthContext.jsx";
import { BrowserRouter } from 'react-router-dom';
import AppRouter from "./router/AppRouter.jsx";


function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
