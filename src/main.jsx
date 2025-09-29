import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
    import InterviewPage from './pages/InterviewPage.jsx';
    import QuestionPage from './pages/QuestionPage.jsx';
    import { Provider } from 'react-redux';
    import { store, persistor } from './store';
    import { PersistGate } from 'redux-persist/integration/react';
    import ProfilePage from './pages/ProfilePage.jsx';


   // Retype the spaces manually
const router = createBrowserRouter([
      {
        path: "/",
        element: <App/>
      },
      {
        path: "/interview",
        element: <InterviewPage/>
      },
      {
        path: "/question",
        element: <QuestionPage/>
      },
      {
        path: "/profile/:candidateId",
        element: <ProfilePage />
      }
    ]);


createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
    
  // </StrictMode>
)
