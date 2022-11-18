import { poolType } from '../store/reducers/activityPool'
import { activityPoolParamsTypes } from '../api/apis/GetActivityPoolAPI'

export const getToken = (): string | null => {
    return localStorage.getItem('user_token')
}

export const getUid = (): string | null => {
    return localStorage.getItem('userid')
}

export const setToken = (token: string): void => {
    localStorage.setItem('user_token', token)
}

export const setUid = (uid: string): void => {
    localStorage.setItem('userid', uid)
}

export const removeUid = (): void => {
    localStorage.removeItem('userid')
}

export const removeToken = (): void => {
    localStorage.removeItem('user_token')
}

export const filterParams = (
    ft: poolType['filters']
): activityPoolParamsTypes => {
    const res: activityPoolParamsTypes = {}
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(ft)) {
        if (key === 'status') {
            let paramStr = ''
            value.checkedList.forEach((item) => {
                paramStr = paramStr.concat(item === 'Unmapped' ? '0,' : '1,')
            })
            res[key] = paramStr.slice(0, -1)
        } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            res[key] = value.checkedList.join(',')
        }
    }
    return res
}
