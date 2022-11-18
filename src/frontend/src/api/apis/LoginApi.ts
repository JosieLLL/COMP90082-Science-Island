import { request } from '../request'

interface loginParamsTypes {
    email: string
    password: string | number
}

interface loginResponseTypes {
    Code: number
    Msg: string
    Data: {
        UserID: string
        Token: string
    }
}

export const LoginApi = (
    params: loginParamsTypes
): Promise<loginResponseTypes> => {
    return request.post('/login', params).then((res: any) => res)
}

interface resetParamsTypes {
    email: string
    oldPassword: string
    newPassword: string
}

interface resetResponseTypes {
    Code: number
    Msg: string
}

export const ResetPwdApi = (
    params: resetParamsTypes
): Promise<resetResponseTypes> => {
    return request.post('/reset-password', params).then((res: any) => res)
}
