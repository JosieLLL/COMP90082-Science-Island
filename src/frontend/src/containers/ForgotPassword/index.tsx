import React from 'react'
import { Layout } from 'antd'
import './index.scss'
import ResetPasswordForm from '../../components/ResetPasswordForm'

const { Content } = Layout

const ForgotPassword = (): JSX.Element => (
    <div className="forgot-pwd-container">
        <Layout>
            <Content>
                <ResetPasswordForm />
            </Content>
        </Layout>
    </div>
)

export default ForgotPassword
