import React, { FC, Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import { Layout, Spin } from 'antd'
import HeaderMy from './components/HeaderMy'
import './App.scss'
import './utils/common.scss'
import Routers from './routers'

const App: FC = () => {
    const router = useRoutes(Routers)
    return (
        <Layout className="App main_bg_color_grey">
            <HeaderMy />
            <Suspense fallback={<Spin size="large" />}>{router}</Suspense>
        </Layout>
    )
}

export default App
