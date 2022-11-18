import { request } from '../request'
import { realmType } from './GetMappingFormFields'

export interface activityPoolParamsTypes {
    page?: number
    pageLimit?: number
    status?: string
    questTypes?: string
    learningAreas?: string
    generalCapabilities?: string
    folderIds?: string
}

export interface fileType {
    FileID: number
    FileName: string
    DiskName: string
}

export interface CurriculumType {
    CurriculumID: string
    EducationLevel: string
    Description: string
    Code: string
    Subject: string
    Title: string
    StatementLabel: string
    LearningArea: string
}

export interface YearLevelType {
    YearLevelName: string
    YearLevelID: number
}

export interface AudienceRoleType {
    AudienceRoleName: string
    AudienceRoleID: number
}

export interface GeneralCapabilityType {
    GeneralCapabilityName: string
    GeneralCapabilityID: number
}

export interface activityTypes {
    ActivityID: number
    QuestName: string
    QuestTypes: string[]
    ImageSrc?: string
    ResourceUrl?: string
    Link?: string
    CreateDate: string
    QuestionSpoken?: string
    RealmName?: string
    Realm?: realmType
    TopicName?: string
    KeyConceptName?: string
    ContentDescription?: string
    Outcomes?: string
    AgeRangeName?: string
    ScientistName?: string
    FieldName?: string
    MappingPersonName?: string
    MappingPersonEmail?: string
    FolderName: string
    RealWorldConnection?: string
    PurposeName?: string
    AuthorTitle?: string
    InstitutionName?: string
    AuthorEmail?: string
    AuthorPhone?: string
    CountryName?: string
    MappingPersonPhone?: string
    MapDate?: string
    MapStatus: string
    Curriculums?: CurriculumType[] | null
    AudienceRoles?: AudienceRoleType[] | null
    GeneralCapabilities?: GeneralCapabilityType[] | null
    Files?: fileType[]
    YearLevels: YearLevelType[] | null
}

interface activityPoolResponseTypes {
    Code: number
    Msg: string
    Data: {
        PageSize: number
        TotalNum: number
        Activities: activityTypes[]
    }
}

export const GetActivityPoolApi = (
    params: activityPoolParamsTypes
): Promise<activityPoolResponseTypes> => {
    return request.get('/activity-pool', params).then((res: any) => res)
}

export interface activityParamsTypes {
    activityId: string
}

interface activityResponseTypes {
    Code: number
    Msg: string
    Data: activityTypes
}

export const GetActivityApi = (
    params: activityParamsTypes
): Promise<activityResponseTypes> => {
    return request
        .get(`/activity-pool/${params.activityId}`, params)
        .then((res: any) => res)
}
