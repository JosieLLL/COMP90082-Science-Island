import React, { ChangeEvent, useEffect, useState } from 'react'
import { Modal, Button, Input, Row, Col, Select, message } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import './index.scss'
import {
    showDrawerSelector,
    setShowDrawer,
    fieldSelector,
    folderSelector,
    setSelectedFolder,
    setFolders,
    realmSelector,
    setRealms,
    setSelectedRealm,
    setTopics,
    setSelectedTopic,
    topicSelector,
    setKeyConcepts,
    keyConceptsSelector,
    setSelectedKeyConcept,
    setPurposes,
    setSelectedPurpose,
    purposeSelector,
    setSelectedAgeRange,
    setAgeRanges,
    ageRangeSelector,
    setScientists,
    scientistsSelector,
    setFields,
    fieldsSelector,
    setCountries,
    countriesSelector,
    setInstitutions,
    institutionsSelector,
    setSelectedScientist,
    setSelectedField,
    setSelectedInstitution,
    setSelectedCountry,
} from '../../store/reducers/mapping'
import {
    AGERANGE,
    COUNTRY,
    EDUCATIONALUSE,
    FIELD,
    FOLDER,
    NEW_ACTIVITY_FOLDER,
    UPLOAD_CONTENT_FOLDER,
    INSTITUTION,
    KEYCONCEPT,
    REALM,
    SCIENTIST,
    TOPIC,
} from '../../utils/constants'
import {
    GetFolderApi,
    GetRealmApi,
    GetTopicApi,
    GetKeyConceptApi,
    GetAgeRangeApi,
    GetPurposeApi,
    CreateFolderApi,
    CreateRealmApi,
    CreateTopicApi,
    CreateAgeRangeApi,
    CreatePurposeApi,
    CreateKeyConceptApi,
    CreateScientistApi,
    GetScientistApi,
    CreateFieldApi,
    GetFieldApi,
    CreateInstitutionApi,
    GetInstitutionApi,
    CreateCountryApi,
    GetCountryApi,
} from '../../api'
import {
    setNewActivitySelectedFolder,
    setUploadContentSelectedFolder,
} from '../../store/reducers/newActivity'

const { Option } = Select
interface optionDataType {
    id: number
    name: string
}
const MappingModal = (): JSX.Element => {
    const [selectedName, setSelectedName] = useState<string | undefined>(
        undefined
    )
    const [createName, setCreateName] = useState<string | undefined>(undefined)
    const [optionData, setOptionData] = useState<optionDataType[]>([])
    const visible = useSelector(showDrawerSelector)
    const fieldForDrawer = useSelector(fieldSelector)
    const folders = useSelector(folderSelector)
    const realms = useSelector(realmSelector)
    const topics = useSelector(topicSelector)
    const keyConcept = useSelector(keyConceptsSelector)
    const ageRange = useSelector(ageRangeSelector)
    const purpose = useSelector(purposeSelector)
    const scientists = useSelector(scientistsSelector)
    const fields = useSelector(fieldsSelector)
    const countries = useSelector(countriesSelector)
    const institutions = useSelector(institutionsSelector)
    const dispatch = useDispatch()
    useEffect(() => {
        const res: optionDataType[] = []
        switch (fieldForDrawer) {
            case NEW_ACTIVITY_FOLDER:
            case UPLOAD_CONTENT_FOLDER:
            case FOLDER:
                if (folders !== null) {
                    folders.forEach((item) => {
                        res.push({ id: item.FolderID, name: item.FolderName })
                    })
                    setOptionData(res)
                }
                break
            case REALM:
                if (realms !== null) {
                    realms.forEach((item) => {
                        res.push({ id: item.RealmID, name: item.RealmName })
                    })
                    setOptionData(res)
                }
                break
            case TOPIC:
                if (topics !== null) {
                    topics.forEach((item) => {
                        res.push({ id: item.TopicID, name: item.TopicName })
                    })
                    setOptionData(res)
                }
                break
            case KEYCONCEPT:
                if (keyConcept !== null) {
                    keyConcept.forEach((item) => {
                        res.push({
                            id: item.KeyConceptID,
                            name: item.KeyConceptName,
                        })
                    })
                    setOptionData(res)
                }
                break
            case EDUCATIONALUSE:
                if (purpose !== null) {
                    purpose.forEach((item) => {
                        res.push({ id: item.PurposeID, name: item.PurposeName })
                    })
                    setOptionData(res)
                }
                break
            case AGERANGE:
                if (ageRange !== null) {
                    ageRange.forEach((item) => {
                        res.push({
                            id: item.AgeRangeID,
                            name: item.AgeRangeName,
                        })
                    })
                    setOptionData(res)
                }
                break
            case SCIENTIST:
                if (scientists !== null) {
                    scientists.forEach((item) => {
                        res.push({
                            id: item.ScientistID,
                            name: item.ScientistName,
                        })
                    })
                    setOptionData(res)
                }
                break
            case FIELD:
                if (fields !== null) {
                    fields.forEach((item) => {
                        res.push({
                            id: item.FieldID,
                            name: item.FieldName,
                        })
                    })
                    setOptionData(res)
                }
                break
            case INSTITUTION:
                if (institutions !== null) {
                    institutions.forEach((item) => {
                        res.push({
                            id: item.InstitutionID,
                            name: item.InstitutionName,
                        })
                    })
                    setOptionData(res)
                }
                break
            case COUNTRY:
                if (countries !== null) {
                    countries.forEach((item) => {
                        res.push({
                            id: item.CountryID,
                            name: item.CountryName,
                        })
                    })
                    setOptionData(res)
                }
                break
            default:
                break
        }
    }, [
        folders,
        realms,
        topics,
        purpose,
        keyConcept,
        ageRange,
        scientists,
        fields,
        institutions,
        countries,
    ])
    const clearModalData = (): void => {
        setOptionData([])
        setCreateName(undefined)
        setSelectedName(undefined)
    }
    const onClose = (): void => {
        dispatch(setShowDrawer(false))
        clearModalData()
    }
    const filterObj = <T extends object = any>(
        objArr: T[],
        attributeName: keyof T,
        attributeValue: any
    ): T =>
        objArr &&
        objArr.filter((item) => item[attributeName] === attributeValue)[0]
    const handleOk = (): void => {
        switch (fieldForDrawer) {
            case NEW_ACTIVITY_FOLDER:
                dispatch(
                    setNewActivitySelectedFolder(
                        filterObj(folders, 'FolderName', selectedName)
                    )
                )
                break
            case UPLOAD_CONTENT_FOLDER:
                dispatch(
                    setUploadContentSelectedFolder(
                        filterObj(folders, 'FolderName', selectedName)
                    )
                )
                break
            case FOLDER:
                dispatch(
                    setSelectedFolder(
                        filterObj(folders, 'FolderName', selectedName)
                    )
                )
                break
            case REALM:
                dispatch(
                    setSelectedRealm(
                        filterObj(realms, 'RealmName', selectedName)
                    )
                )
                break
            case TOPIC:
                dispatch(
                    setSelectedTopic(
                        filterObj(topics, 'TopicName', selectedName)
                    )
                )
                break
            case KEYCONCEPT:
                dispatch(
                    setSelectedKeyConcept(
                        filterObj(keyConcept, 'KeyConceptName', selectedName)
                    )
                )
                break
            case EDUCATIONALUSE:
                dispatch(
                    setSelectedPurpose(
                        filterObj(purpose, 'PurposeName', selectedName)
                    )
                )
                break
            case AGERANGE:
                dispatch(
                    setSelectedAgeRange(
                        filterObj(ageRange, 'AgeRangeName', selectedName)
                    )
                )
                break
            case SCIENTIST:
                dispatch(
                    setSelectedScientist(
                        filterObj(scientists, 'ScientistName', selectedName)
                    )
                )
                break
            case FIELD:
                dispatch(
                    setSelectedField(
                        filterObj(fields, 'FieldName', selectedName)
                    )
                )
                break
            case INSTITUTION:
                dispatch(
                    setSelectedInstitution(
                        filterObj(institutions, 'InstitutionName', selectedName)
                    )
                )
                break
            case COUNTRY:
                dispatch(
                    setSelectedCountry(
                        filterObj(countries, 'CountryName', selectedName)
                    )
                )
                break
            default:
                break
        }
        dispatch(setShowDrawer(false))
        clearModalData()
    }
    const handleSelectChange = (value: string): void => {
        console.log(value)
        setSelectedName(value)
    }
    const onCreateInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setCreateName(e.target.value)
    }

    const createMappingField = (name: string | undefined): void => {
        if (name === '' || name === undefined) {
            message.info('Empty Content!')
        } else {
            switch (fieldForDrawer) {
                case NEW_ACTIVITY_FOLDER:
                case UPLOAD_CONTENT_FOLDER:
                case FOLDER:
                    CreateFolderApi({ folderName: name }).then((res) => {
                        if (res.Code === 200) {
                            GetFolderApi().then((res1) => {
                                dispatch(setFolders(res1.Data.Folders))
                                setSelectedName(name)
                            })
                        }
                    })
                    break
                case REALM:
                    CreateRealmApi({ realmName: name }).then((res) => {
                        if (res.Code === 200) {
                            GetRealmApi().then((res1) => {
                                dispatch(setRealms(res1.Data.Realms))
                                setSelectedName(name)
                            })
                        }
                    })
                    break
                case TOPIC:
                    CreateTopicApi({ topicName: name }).then((res) => {
                        if (res.Code === 200) {
                            GetTopicApi().then((res1) => {
                                dispatch(setTopics(res1.Data.Topics))
                                setSelectedName(name)
                            })
                        }
                    })
                    break
                case KEYCONCEPT:
                    CreateKeyConceptApi({ keyConceptName: name }).then(
                        (res) => {
                            if (res.Code === 200) {
                                GetKeyConceptApi().then((res1) => {
                                    dispatch(
                                        setKeyConcepts(res1.Data.KeyConcepts)
                                    )
                                    setSelectedName(name)
                                })
                            }
                        }
                    )
                    break
                case EDUCATIONALUSE:
                    CreatePurposeApi({ purposeName: name }).then((res) => {
                        if (res.Code === 200) {
                            GetPurposeApi().then((res1) => {
                                dispatch(setPurposes(res1.Data.Purposes))
                                setSelectedName(name)
                            })
                        }
                    })
                    break
                case AGERANGE:
                    CreateAgeRangeApi({ ageRangeName: name }).then((res) => {
                        if (res.Code === 200) {
                            GetAgeRangeApi().then((res1) => {
                                dispatch(setAgeRanges(res1.Data.AgeRanges))
                                setSelectedName(name)
                            })
                        }
                    })
                    break
                case SCIENTIST:
                    CreateScientistApi({ scientistName: name }).then((res) => {
                        if (res.Code === 200) {
                            GetScientistApi().then((res1) => {
                                dispatch(setScientists(res1.Data.Scientists))
                                setSelectedName(name)
                            })
                        }
                    })
                    break
                case FIELD:
                    CreateFieldApi({ fieldName: name }).then((res) => {
                        if (res.Code === 200) {
                            GetFieldApi().then((res1) => {
                                dispatch(setFields(res1.Data.Fields))
                                setSelectedName(name)
                            })
                        }
                    })
                    break
                case INSTITUTION:
                    CreateInstitutionApi({ institutionName: name }).then(
                        (res) => {
                            if (res.Code === 200) {
                                GetInstitutionApi().then((res1) => {
                                    dispatch(
                                        setInstitutions(res1.Data.Institutions)
                                    )
                                    setSelectedName(name)
                                })
                            }
                        }
                    )
                    break
                case COUNTRY:
                    CreateCountryApi({ countryName: name }).then((res) => {
                        if (res.Code === 200) {
                            GetCountryApi().then((res1) => {
                                dispatch(setCountries(res1.Data.Countries))
                                setSelectedName(name)
                            })
                        }
                    })
                    break
                default:
                    break
            }
            setCreateName(undefined)
        }
    }
    return (
        <Modal
            visible={visible}
            title={fieldForDrawer}
            onOk={handleOk}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose}>
                    Return
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Submit
                </Button>,
            ]}
        >
            <Row gutter={24}>
                <Col span={8}>
                    <Select
                        placeholder={`Please select ${fieldForDrawer}`}
                        onSelect={handleSelectChange}
                        value={selectedName}
                        style={{ width: '100%' }}
                    >
                        {optionData &&
                            optionData.map((item) => (
                                <Option key={item.id} value={item.name}>
                                    {item.name}
                                </Option>
                            ))}
                    </Select>
                </Col>
                <Col span={12}>
                    <Input
                        placeholder={`Create ${fieldForDrawer}`}
                        value={createName}
                        onChange={onCreateInputChange}
                    />
                </Col>
                <Col span={4}>
                    <Button
                        type="primary"
                        onClick={() => createMappingField(createName)}
                    >
                        Create
                    </Button>
                </Col>
            </Row>
        </Modal>
    )
}
export default MappingModal
