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
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import ErrorNotice from './components/common/ErrorNotice.jsx';
import Loading from './components/common/Loading.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorNotice />
  },
  {
    path: "/interview",
    element: <InterviewPage />,
    errorElement: <ErrorNotice />
  },
  {
    path: "/question",
    element: <QuestionPage />,
    errorElement: <ErrorNotice />
  },
  {
    path: "/profile/:candidateId",
    element: <ProfilePage />,
    errorElement: <ErrorNotice />
  },
  {
    path: "*",
    element: <ErrorNotice />
  }
]);
createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>
    <PersistGate loading={<Loading />} persistor={persistor}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </PersistGate>
  </Provider>
  // </StrictMode>
)
