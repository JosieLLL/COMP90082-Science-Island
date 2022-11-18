import React from 'react'
import './index.scss'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Form, Input, Button, message } from 'antd'
import { RegistrationApi } from '../../api'
import { getToken, getUid } from '../../utils/helper'
import { authLogin } from '../../store/reducers/user'

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4, offset: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
    },
}
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
}

const RegistrationForm = (): JSX.Element => {
    const [form] = Form.useForm()
    const history = useNavigate()
    const dispatch = useDispatch()
    const onFinish = (values: any): void => {
        RegistrationApi(values).then((res) => {
            if (getUid() && getToken()) {
                dispatch(
                    authLogin({
                        uid: getUid()!,
                        user_token: getToken()!,
                    })
                )
            }
            if (res.Code === 200) {
                message.info(res.Msg)
                history('/')
            } else {
                message.info(res.Msg)
            }
        })
    }

    return (
        <div className="reg-form-container">
            <p className="regi-label">Register Now</p>
            <Form
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue('password') === value
                                ) {
                                    return Promise.resolve()
                                }
                                return Promise.reject(
                                    new Error(
                                        'The two passwords that you entered do not match!'
                                    )
                                )
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default RegistrationForm
