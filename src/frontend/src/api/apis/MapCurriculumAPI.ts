import { request } from '../request'

export interface getSubjectParamsTypes {
    subjects?: string
    yearLevel?: number
    page?: number
    pageLimit?: number
    code?: string
}

export interface subjectType {
    Id: number
    Subject: string
    YearLevel: string
    Title: string
    SubTitle: string
    CurriculumInfors: curriculumsType[] | null
}

export interface curriculumsType {
    CurriculumID: string
    LearningArea: string
    GeneralCapability: string
    Code: string
    Description: string
}

export interface treeType {
    Title: string
    SubjectNum: number
    Level: number
    IsLeaf: boolean
    Children: treeType[] | null
}

interface getCurriculumsResponseTypes {
    Code: number
    Msg: string
    Data: {
        SubjectFilter: treeType[]
        StrandInfors: subjectType[]
        TotalNum: number
        PageSize: number
    }
}

export const GetCurriculumApi = (
    params?: getSubjectParamsTypes
): Promise<getCurriculumsResponseTypes> => {
    return request.get('/get-curriculum', params).then((res: any) => res)
}

export interface mapCurriculumType {
    isNew: number
    activityId: number
    questName: string
    questType: string
    resourceUrl: string
    ingameLink: string
    folderId: number
    questionSpoken: string
    realmId: number
    topicId: number
    keyConceptId: number
    realWorldConnection: string
    contentDescription: string
    outcomes: string
    purposeId: number
    yearLevelIds: number[]
    ageRangeId: number
    audienceRoleIds: number[]
    curriculumIds: number[]
    generalCapabilityIds: number[]
    scientistId: number
    fieldId: number
    authorTitle: string
    institutionId: number
    authorEmail: string
    authorPhone: string
    countryId: number
    mapName: string
    mapEmail: string
    mapPhone: string
}

interface mapCurriculumResponseTypes {
    Code: number
    Msg: string
    Data?: string
}

export const MapCurriculumApi = (
    params: mapCurriculumType
): Promise<mapCurriculumResponseTypes> => {
    return request.post('/map-curriculum', params).then((res: any) => res)
}
