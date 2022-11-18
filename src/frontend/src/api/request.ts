import axios, {
    AxiosInstance,
    AxiosRequestHeaders,
    AxiosResponse,
    AxiosRequestConfig,
    AxiosError,
} from 'axios'
import { message } from 'antd'
import qs from 'qs'
import { store } from '../store'
import { authLogout } from '../store/reducers/user'
import { API_SERVER } from '../settings'
import { setToken, setUid, getToken, getUid } from '../utils/helper'

export const baseURL = API_SERVER

const timeout = 100000
const serviceInstance: AxiosInstance = axios.create({
    timeout,
    baseURL,
    withCredentials: true,
})
message.config({
    maxCount: 1,
})
serviceInstance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const Token = getToken()
        const Userid: string = getUid() === null ? '' : getUid()!
        const headers: AxiosRequestHeaders = Token
            ? {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  Token,
                  Userid,
              }
            : {
                  'Content-Type': 'application/x-www-form-urlencoded',
              }
        config.data = qs.stringify(config.data)
        config.headers = { ...headers, ...config.headers }
        return config
    },
    (error) => {
        console.log(error)
        Promise.reject(error)
    }
)

serviceInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.headers.token && response.headers.userid) {
            setToken(response.headers.token)
            setUid(response.headers.userid)
        }
        if (response.config.method === 'post') {
            message.info(response.data.Msg)
        }
        return response
    },
    (error: AxiosError) => {
        const { response } = error
        if (response?.status === 401) {
            store.dispatch(authLogout())
            window.location.href = '/login'
        }
        message.info(response?.data.Msg)
        return Promise.reject(response)
    }
)
interface axiosTypes<T> {
    data: T
    status: number
    statusText: string
}

const requestHandler = <T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    params: object = {},
    config: AxiosRequestConfig = {}
): Promise<T> => {
    let response: Promise<axiosTypes<T>>
    switch (method) {
        case 'get':
            response = serviceInstance.get(url, {
                params: { ...params },
                ...config,
            })
            break
        case 'post':
            response = serviceInstance.post(url, { ...params }, { ...config })
            break
        case 'put':
            response = serviceInstance.put(url, { ...params }, { ...config })
            break
        case 'delete':
            response = serviceInstance.delete(url, {
                params: { ...params },
                ...config,
            })
            break
        default:
            response = serviceInstance.get(url, {
                params: { ...params },
                ...config,
            })
            break
    }

    return new Promise<T>((resolve, reject) => {
        response
            .then((res) => {
                resolve(res.data)
            })
            .catch((error) => {
                const e = JSON.stringify(error)
                console.log('error', e)
                reject(error)
            })
    })
}

const request = {
    get: <T>(url: string, params?: object, config?: AxiosRequestConfig) =>
        requestHandler<T>('get', url, params, config),
    post: <T>(url: string, params?: object, config?: AxiosRequestConfig) =>
        requestHandler<T>('post', url, params, config),
    put: <T>(url: string, params?: object, config?: AxiosRequestConfig) =>
        requestHandler<T>('put', url, params, config),
    delete: <T>(url: string, params?: object, config?: AxiosRequestConfig) =>
        requestHandler<T>('delete', url, params, config),
}

export { request }
