import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '..'
import { setToken, setUid, removeUid, removeToken } from '../../utils/helper'

type userType = {
    user: {
        uid: string
        user_token: string
    } | null
    isLogin: boolean
}
const initialState: userType = {
    user: null,
    isLogin: false,
}

const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<userType['user']>) => {
            state.user = action.payload
        },
        setLoginStatus: (state, action: PayloadAction<userType['isLogin']>) => {
            state.isLogin = action.payload
        },
        authLogin: (state, action: PayloadAction<userType['user']>) => {
            state.user = action.payload
            state.isLogin = true
            if (state.user !== null) {
                setToken(state.user.user_token)
                setUid(state.user.uid)
            }
        },
        authLogout: (state) => {
            state.user = null
            state.isLogin = false
            removeToken()
            removeUid()
            localStorage.clear()
        },
    },
})

export const { setCurrentUser, setLoginStatus, authLogin, authLogout } =
    UserSlice.actions

export const userSelector = (state: RootState): userType['user'] =>
    state.user.user

export const isLoginSelector = (state: RootState): userType['isLogin'] =>
    state.user.isLogin

export default UserSlice.reducer
