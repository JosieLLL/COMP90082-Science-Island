let API_SERVER_URL: string | undefined
switch (process.env.NODE_ENV) {
    case 'development':
        API_SERVER_URL = process.env.REACT_APP_API_SERVER
        break
    case 'production':
        API_SERVER_URL = process.env.REACT_APP_API_SERVER
        break
    default:
        API_SERVER_URL = 'http://3.90.204.186:3000/dev'
        break
}

export const API_SERVER = API_SERVER_URL
