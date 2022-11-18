import React from 'react'
import { Layout } from 'antd'
import { Link } from 'react-router-dom'
import RegistrationForm from '../../components/RegistrationForm'
import './index.scss'

const { Content } = Layout
const Register = (): JSX.Element => (
    <Layout className="regi-layout">
        <Content>
            <div className="form-wrapper">
                <RegistrationForm />
                <p className="login-redirect">
                    Have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </Content>
    </Layout>
)

export default Register
