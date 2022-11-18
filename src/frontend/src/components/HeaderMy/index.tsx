import * as React from 'react'
import './index.scss'
import { Button, Image, Layout } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { authLogout, isLoginSelector } from '../../store/reducers/user'

const { Header } = Layout

const HeaderMy = (): JSX.Element => {
    const history = useNavigate()
    const dispatch = useDispatch()
    const isLogin = useSelector(isLoginSelector)
    const logout = (): void => {
        dispatch(authLogout())
        history('/login')
    }
    return (
        <Header className="header main_bg_color">
            <Image
                alt="Gate Logo"
                src={`${process.env.PUBLIC_URL}/img/gate_logo.png`}
                preview={false}
            />
            <div className="loginBtnBox">
                {isLogin ? (
                    <Button onClick={logout}>Logout</Button>
                ) : (
                    <Button>
                        <Link to="/login">Login</Link>
                    </Button>
                )}
            </div>
        </Header>
    )
}

export default HeaderMy
