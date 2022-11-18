import { request } from '../request'

export interface newActivityParamsTypes {
    folderId: number
    questName: string
    questTypes: string
    activityId: number
    realmId: number
    resourceUrl: string
    fileIds: string
}

export interface newActivityResponseTypes {
    Code: number
    Msg: string
    Data: {
        FileID: number
        FileName: string
    }
}

export const NewActivityApi = (
    params: newActivityParamsTypes
): Promise<newActivityResponseTypes> => {
    return request.post('/new-activity', params).then((res: any) => res)
}
