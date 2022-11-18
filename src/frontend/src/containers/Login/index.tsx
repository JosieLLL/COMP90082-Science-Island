// @flow
import React from 'react'
import './index.scss'
import { Image, Col, Row, Layout } from 'antd'
import LoginForm from '../../components/LoginForm'

const { Content } = Layout

const Login = (): JSX.Element => {
    return (
        <div className="login-container">
            <Layout className="layout-container">
                <Content>
                    <div className="topTitle">
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col span={4} offset={10}>
                                <Image
                                    alt="ScienceIsland Logo"
                                    src={`${process.env.PUBLIC_URL}/img/ScienceIsland_Logo.png`}
                                    preview={false}
                                />
                            </Col>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col span={12} offset={6} className="title">
                                Currirulum Mapping System
                            </Col>
                        </Row>
                    </div>
                    <LoginForm />
                    <div className="office-woman-pic">
                        <Image
                            alt="Decorative Picture"
                            src={`${process.env.PUBLIC_URL}/img/login_decorate.png`}
                            preview={false}
                        />
                    </div>
                </Content>
            </Layout>
        </div>
    )
}

export default Login
