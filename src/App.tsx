import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout/Layout';
import { Login } from './pages/Login/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Animais } from './pages/Animais/Animais';
import { FichaAnimal } from './pages/FichaAnimal/FichaAnimal';
import { Relatorios } from './pages/Relatorios/Relatorios';
import { Configuracoes } from './pages/Configuracoes/Configuracoes';
import { Chatbot } from './pages/Chatbot/Chatbot';
import { PosAdocao } from './pages/PosAdocao/PosAdocao';
import { BancoDados } from './pages/BancoDados/BancoDados';
import { NotFound } from './pages/NotFound/NotFound';
import './App.css';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
      
      <Route path="/" element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="animais" element={<Animais />} />
        <Route path="animais/:id" element={<FichaAnimal />} />
        <Route path="relatorios" element={<Relatorios />} />
        <Route path="configuracoes" element={<Configuracoes />} />
        <Route path="chatbot" element={<Chatbot />} />
        <Route path="pos-adocao" element={<PosAdocao />} />
        <Route path="banco-dados" element={<BancoDados />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
