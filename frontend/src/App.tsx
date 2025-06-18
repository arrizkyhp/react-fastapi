import { Outlet } from 'react-router-dom'
import './App.css'
import AppSidebar from './components/layouts/AppSidebar'

function App() {

    return (
        <div className="app-container">
            <AppSidebar />
            <main className="main-content">
               <Outlet />
            </main>
       </div>
  )
}

export default App
