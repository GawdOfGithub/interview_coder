import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
 import { createBrowserRouter } from "react-router";
    import { RouterProvider } from "react-router/dom";
    import InterviewPage from './pages/InterviewPage.jsx';
    import QuestionPage from './pages/QuestionPage.jsx';
    import { Provider } from 'react-redux';
    import { store, persistor } from './store';
    import { PersistGate } from 'redux-persist/integration/react';


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
    ]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
    
  </StrictMode>
)
