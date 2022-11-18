import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux' // import Provider，bind store to the App
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store' // store instance
import App from './App'

const rootElement = document.getElementById('root')!
const root = createRoot(rootElement!)
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </PersistGate>
        </Provider>
    </React.StrictMode>
)
