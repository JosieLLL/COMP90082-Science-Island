import { RouteObject, Navigate } from 'react-router-dom'
import React, { lazy } from 'react'
import PrivateRoute from '../components/PrivateRoute'

const Login = lazy(() => import('../containers/Login'))
const Home = lazy(() => import('../containers/Home'))
const NotFound = lazy(() => import('../containers/NotFound'))
const Register = lazy(() => import('../containers/Register'))
const ForgotPassword = lazy(() => import('../containers/ForgotPassword'))
const MappingResults = lazy(() => import('../components/MappingResults'))
const ActivityPool = lazy(() => import('../components/ActivityPool'))
const NewActivity = lazy(() => import('../components/NewActivity'))
const MapCurriculum = lazy(() => import('../components/MapCurriculum'))
const UploadContent = lazy(() => import('../components/UploadContent'))
const DefaultHome = lazy(() => import('../components/DefaultHome'))

type RoutersType = RouteObject[]

const Routes: RoutersType = [
    {
        path: '/',
        element: (
            <PrivateRoute>
                <Home />
            </PrivateRoute>
        ),
        children: [
            {
                path: '/',
                element: <DefaultHome />,
            },
            {
                path: '/activity-pool',
                element: <ActivityPool />,
            },
            {
                path: '/new-activity',
                element: <NewActivity />,
            },
            {
                path: '/map-curriculum',
                element: <MapCurriculum />,
            },
            {
                path: '/upload-content',
                element: <UploadContent />,
            },
            {
                path: '/activity-pool/mapping-results',
                element: <MappingResults />,
            },
        ],
    },
    {
        path: '/home',
        element: <Navigate to="/" replace />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/password',
        element: <ForgotPassword />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '*',
        element: <NotFound />,
    },
]

export default Routes
