import { request } from '../request'

interface registrationParamsTypes {
    email: string
    password: string
}

interface registrationResponseTypes {
    Code: number
    Msg: string
    Data: {
        UserID: string
        Token: string
    }
}

export const RegistrationApi = (
    params: registrationParamsTypes
): Promise<registrationResponseTypes> => {
    return request.post('/register', params).then((res: any) => res)
}
