import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UsersContext' 
import { TrainingProvider } from './context/TrainingsContext'
import { AreaProvider } from './context/AreasContext'
import { ChatProvider } from './context/chatContext'
import ProtectedRoute from './ProtectedRoute'
import AdminPage from './pages/AdminPage'
import EmployeePage from './pages/EmployeePage' 
import UsersPage from './pages/UsersPage'
import RegisterUserPage from './pages/RegisterUserPage'
import Addinformation from './pages/AddInformation'
import EditUserPage from './pages/EditUserPage'
import TrainingsPage from './pages/TrainingsPage'
import AreasPage from './pages/AreasPage'
import ChatPage from './pages/ChatPage'
import HistoryChat from "./pages/HistoryChat";
import RecoverPassword from './pages/RecoverPassword'
import ResetPassword from './pages/ResetPassword'



function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <TrainingProvider>
          <AreaProvider>
            <ChatProvider>
              <BrowserRouter>
                <Routes>
                  <Route path='/' element={<LoginPage />} />   
                  <Route path="/recoverPassword" element={<RecoverPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />         
                <Route element={<ProtectedRoute />}>
                  <Route path='/admin' element={<AdminPage />} />
                  <Route path='/users' element={<UsersPage />} />
                  <Route path='/register' element={<RegisterUserPage/>}/>
                  <Route path='/user/trainings/:id' element={<Addinformation/>}/>
                  <Route path="/user/:id" element={<EditUserPage />} />
                  <Route path="/trainings" element={<TrainingsPage />} />
                  <Route path="/areas" element={<AreasPage/>}/>
                  <Route path='/chat' element={<ChatPage />} />
                  <Route path='/chat/:id_chat' element={<HistoryChat/>}/>
                  <Route path='/employee' element={<EmployeePage />} />
                </Route>
                </Routes>
              </BrowserRouter>
            </ChatProvider>
          </AreaProvider>
        </TrainingProvider>
      </UserProvider>
    </AuthProvider>
  )
}

export default App
