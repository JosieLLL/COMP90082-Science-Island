import { request } from '../request'

export interface uploadFileParamsTypes {
    folderId?: number | null
    activityId: number
    fileIds: string
}

export interface uploadFileResponseTypes {
    Code: number
    Msg: string
    Data: {
        FileIDs: string
        ActivityID: string
    }
}

export const UploadFileApi = (
    params: uploadFileParamsTypes
): Promise<uploadFileResponseTypes> => {
    return request.post('/attach-files', params).then((res: any) => res)
}

export interface downloadFileParamsTypes {
    activityId: string
    fileId: number
}

export const DownloadFileApi = (
    params: downloadFileParamsTypes
): Promise<string> => {
    return request
        .get('/get-file', params, { responseType: 'arraybuffer' })
        .then((res: any) => res)
}
