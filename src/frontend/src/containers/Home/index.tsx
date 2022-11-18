import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout, Spin } from 'antd'
import BreadCrumbMy from '../../components/BreadCrumbMy'
import './index.scss'
import SideMenu from '../../components/SideMenu'

const { Sider, Content } = Layout

const Home = (): JSX.Element => {
    return (
        <Layout>
            <Sider className="main_bg_color">
                <SideMenu />
            </Sider>
            <Layout>
                <Content className="home-content main_bg_color_grey">
                    <BreadCrumbMy />
                    <Suspense fallback={<Spin size="large" />}>
                        <Outlet />
                    </Suspense>
                </Content>
            </Layout>
        </Layout>
    )
}

export default Home
