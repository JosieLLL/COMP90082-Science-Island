import React from 'react'
import { Button, Form, Input, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { ResetPwdApi } from '../../api'
import './index.scss'

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8, offset: 0 },
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
            span: 10,
            offset: 8,
        },
    },
}

const ResetPasswordForm = (): JSX.Element => {
    const [form] = Form.useForm()
    const history = useNavigate()
    const onFinish = (values: any): void => {
        console.log('Received values of form: ', values)
        ResetPwdApi(values).then((res) => {
            console.log(res)
            if (res.Code === 200) {
                message.success(res.Msg)
                history('/login')
            } else {
                message.info(res.Msg)
            }
        })
    }
    return (
        <div className="reset-pwd-container">
            <p className="title">Reset your password</p>
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
                    name="oldPassword"
                    label="Old Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your current password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your new password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm New Password"
                    dependencies={['newPassword']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your new password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue('newPassword') === value
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
                        Reset Password
                    </Button>
                    <Link to="/login"> Return to Login</Link>
                </Form.Item>
            </Form>
        </div>
    )
}

export default ResetPasswordForm
