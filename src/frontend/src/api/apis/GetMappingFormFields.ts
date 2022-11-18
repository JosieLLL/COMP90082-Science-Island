import { request } from '../request'

export interface folderType {
    FolderID: number
    FolderName: string
}

export interface createFolderReqType {
    folderName: string
}

interface folderResponseTypes {
    Code: number
    Msg: string
    Data: {
        Folders: folderType[]
    }
}

export const GetFolderApi = (): Promise<folderResponseTypes> => {
    return request.get('/new-activity/get-exist-folder').then((res: any) => res)
}

export const CreateFolderApi = (
    params: createFolderReqType
): Promise<folderResponseTypes> => {
    return request
        .post('/new-activity/new-folder', params)
        .then((res: any) => res)
}

export interface realmType {
    RealmID: number
    RealmName: string
}

interface realmResponseTypes {
    Code: number
    Msg: string
    Data: {
        Realms: realmType[]
    }
}

export interface createRealmReqType {
    realmName: string
}

export const GetRealmApi = (): Promise<realmResponseTypes> => {
    return request.get('/new-activity/get-exist-realm').then((res: any) => res)
}

export const CreateRealmApi = (
    params: createRealmReqType
): Promise<realmResponseTypes> => {
    return request
        .post('/new-activity/new-realm', params)
        .then((res: any) => res)
}

export interface topicType {
    TopicID: number
    TopicName: string
}

interface topicResponseTypes {
    Code: number
    Msg: string
    Data: {
        Topics: topicType[]
    }
}

export interface createTopicReqType {
    topicName: string
}

export const GetTopicApi = (): Promise<topicResponseTypes> => {
    return request.get('/new-activity/get-exist-topic').then((res: any) => res)
}

export const CreateTopicApi = (
    params: createTopicReqType
): Promise<topicResponseTypes> => {
    return request
        .post('/new-activity/new-topic', params)
        .then((res: any) => res)
}

export interface keyConceptType {
    KeyConceptID: number
    KeyConceptName: string
}

interface keyConceptResponseTypes {
    Code: number
    Msg: string
    Data: {
        KeyConcepts: keyConceptType[]
    }
}

export interface createKeyConceptReqType {
    keyConceptName: string
}

export const GetKeyConceptApi = (): Promise<keyConceptResponseTypes> => {
    return request
        .get('/new-activity/get-exist-keyConcept')
        .then((res: any) => res)
}

export const CreateKeyConceptApi = (
    params: createKeyConceptReqType
): Promise<keyConceptResponseTypes> => {
    return request
        .post('/new-activity/new-keyConcept', params)
        .then((res: any) => res)
}

export interface purposeType {
    PurposeID: number
    PurposeName: string
}

interface purposeResponseTypes {
    Code: number
    Msg: string
    Data: {
        Purposes: purposeType[]
    }
}

export interface createPurposeReqType {
    purposeName: string
}

export const GetPurposeApi = (): Promise<purposeResponseTypes> => {
    return request
        .get('/new-activity/get-exist-purpose')
        .then((res: any) => res)
}

export const CreatePurposeApi = (
    params: createPurposeReqType
): Promise<purposeResponseTypes> => {
    return request
        .post('/new-activity/new-purpose', params)
        .then((res: any) => res)
}

export interface ageRangeType {
    AgeRangeID: number
    AgeRangeName: string
}

interface ageRangeResponseTypes {
    Code: number
    Msg: string
    Data: {
        AgeRanges: ageRangeType[]
    }
}

export interface createAgeRangeReqType {
    ageRangeName: string
}

export const GetAgeRangeApi = (): Promise<ageRangeResponseTypes> => {
    return request
        .get('/new-activity/get-exist-ageRange')
        .then((res: any) => res)
}

export const CreateAgeRangeApi = (
    params: createAgeRangeReqType
): Promise<ageRangeResponseTypes> => {
    return request
        .post('/new-activity/new-ageRange', params)
        .then((res: any) => res)
}

export interface scientistType {
    ScientistID: number
    ScientistName: string
}

interface scientistResponseTypes {
    Code: number
    Msg: string
    Data: {
        Scientists: scientistType[]
    }
}

export interface createScientistReqType {
    scientistName: string
}

export const GetScientistApi = (): Promise<scientistResponseTypes> => {
    return request
        .get('/new-activity/get-exist-scientist')
        .then((res: any) => res)
}

export const CreateScientistApi = (
    params: createScientistReqType
): Promise<scientistResponseTypes> => {
    return request
        .post('/new-activity/new-scientist', params)
        .then((res: any) => res)
}

export interface institutionType {
    InstitutionID: number
    InstitutionName: string
}

interface institutionResponseTypes {
    Code: number
    Msg: string
    Data: {
        Institutions: institutionType[]
    }
}

export interface createInstitutionReqType {
    institutionName: string
}

export const GetInstitutionApi = (): Promise<institutionResponseTypes> => {
    return request
        .get('/new-activity/get-exist-institution')
        .then((res: any) => res)
}

export const CreateInstitutionApi = (
    params: createInstitutionReqType
): Promise<institutionResponseTypes> => {
    return request
        .post('/new-activity/new-institution', params)
        .then((res: any) => res)
}

export interface fieldType {
    FieldID: number
    FieldName: string
}

interface fieldResponseTypes {
    Code: number
    Msg: string
    Data: {
        Fields: fieldType[]
    }
}

export interface createFieldReqType {
    fieldName: string
}

export const GetFieldApi = (): Promise<fieldResponseTypes> => {
    return request.get('/new-activity/get-exist-field').then((res: any) => res)
}

export const CreateFieldApi = (
    params: createFieldReqType
): Promise<fieldResponseTypes> => {
    return request
        .post('/new-activity/new-field', params)
        .then((res: any) => res)
}

export interface countryType {
    CountryID: number
    CountryName: string
}

interface countryResponseTypes {
    Code: number
    Msg: string
    Data: {
        Countries: countryType[]
    }
}

export interface createCountryReqType {
    countryName: string
}

export const GetCountryApi = (): Promise<countryResponseTypes> => {
    return request
        .get('/new-activity/get-exist-country')
        .then((res: any) => res)
}

export const CreateCountryApi = (
    params: createCountryReqType
): Promise<countryResponseTypes> => {
    return request
        .post('/new-activity/new-country', params)
        .then((res: any) => res)
}
