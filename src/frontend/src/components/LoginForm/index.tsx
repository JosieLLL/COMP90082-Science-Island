import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Form, Input, Button, Checkbox, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { authLogin } from '../../store/reducers/user'
import { LoginApi } from '../../api'
import './index.scss'
import { getUid, getToken } from '../../utils/helper'

const LoginForm = (): JSX.Element => {
    const dispatch = useDispatch()
    const history = useNavigate()
    const onFinish = (values: any): void => {
        LoginApi(values).then((res) => {
            console.log('check:', res)
            if (res.Code === 200) {
                message.info(res.Msg)
                dispatch(
                    authLogin({
                        uid: getUid() || '',
                        user_token: getToken() || '',
                    })
                )
                history('/')
            } else {
                message.info(res.Msg)
            }
        })
    }
    return (
        <div className="login-form-container">
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Email!',
                        },
                    ]}
                >
                    <Input
                        prefix={
                            <UserOutlined className="site-form-item-icon" />
                        }
                        placeholder="Email"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                    ]}
                >
                    <Input
                        prefix={
                            <LockOutlined className="site-form-item-icon" />
                        }
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    <Link className="login-form-forgot" to="/password">
                        Reset password
                    </Link>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                    >
                        Log in
                    </Button>
                    Or <Link to="/register">register now!</Link>
                </Form.Item>
            </Form>
        </div>
    )
}

export default LoginForm
