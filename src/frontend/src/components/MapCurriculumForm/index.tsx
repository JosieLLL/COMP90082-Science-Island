import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    Form,
    Input,
    Divider,
    Button,
    Popover,
    message,
    Row,
    Col,
    Checkbox,
    Typography,
} from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import './index.scss'
import { PlusOutlined } from '@ant-design/icons'
import {
    setShowDrawer,
    setField,
    setFolders,
    selectedFolderSelector,
    setSelectedFolder,
    setRealms,
    selectedRealmSelector,
    setSelectedRealm,
    setTopics,
    selectedTopicSelector,
    setSelectedTopic,
    setPurposes,
    selectedPurposeSelector,
    setSelectedPurpose,
    setKeyConcepts,
    selectedKeyConceptSelector,
    setSelectedKeyConcept,
    setAgeRanges,
    selectedAgeRangeSelector,
    setSelectedAgeRange,
    setFields,
    selectedFieldSelector,
    setSelectedField,
    setCountries,
    selectedCountrySelector,
    setSelectedCountry,
    setInstitutions,
    selectedInstitutionSelector,
    setSelectedInstitution,
    setScientists,
    selectedScientistSelector,
    setSelectedScientist,
    setShowModal,
    selectedCurriculumsSelector,
    setSelectedCurriculums,
} from '../../store/reducers/mapping'
import MappingModal from '../MappingModal'
import MapCurriculumModal from '../MapCurriculumModal'
import {
    GetAgeRangeApi,
    GetFolderApi,
    GetKeyConceptApi,
    GetPurposeApi,
    GetRealmApi,
    GetTopicApi,
    GetCountryApi,
    GetInstitutionApi,
    GetFieldApi,
    GetScientistApi,
    MapCurriculumApi,
} from '../../api'
import {
    FOLDER,
    REALM,
    TOPIC,
    KEYCONCEPT,
    EDUCATIONALUSE,
    AGERANGE,
    SCIENTIST,
    FIELD,
    INSTITUTION,
    COUNTRY,
    YEAR_LEVEL,
    AUDIENCE_ROLE,
    QUEST_TYPE,
} from '../../utils/constants'
import TableMy from '../TableMy'
import { curriculumsType } from '../../api/apis/MapCurriculumAPI'
import { realmType } from '../../api/apis/GetMappingFormFields'

interface CustomizedState {
    activityId: number
    questName: string
    questTypes: string[]
    resourceUrl: string
    realm: realmType
    isNew: 0 | 1
}

const MapCurriculumForm = (): JSX.Element => {
    const { Text } = Typography
    const location = useLocation()
    const history = useNavigate()
    const state = location.state as CustomizedState
    const [paramsFromCard] = useState<CustomizedState | null>(state)
    const [form] = Form.useForm()
    const { TextArea } = Input
    const [popOverVisible, setPopOverVisible] = useState(false)
    const selectedFolder = useSelector(selectedFolderSelector)
    const selectedRealm = useSelector(selectedRealmSelector)
    const selectedTopic = useSelector(selectedTopicSelector)
    const selectedPurpose = useSelector(selectedPurposeSelector)
    const selectedKeyConcept = useSelector(selectedKeyConceptSelector)
    const selectedAgeRange = useSelector(selectedAgeRangeSelector)
    const selectedScientist = useSelector(selectedScientistSelector)
    const selectedField = useSelector(selectedFieldSelector)
    const selectedInstitution = useSelector(selectedInstitutionSelector)
    const selectedCountry = useSelector(selectedCountrySelector)
    const selectedCurriculums = useSelector(selectedCurriculumsSelector)
    const dispatch = useDispatch()
    const columns: ColumnsType<curriculumsType> = [
        {
            title: 'Code',
            dataIndex: 'Code',
            key: 'Code',
            width: '11%',
            align: 'center',
            render: (text) => <span style={{ color: '#0F8AB0' }}>{text}</span>,
        },
        {
            title: 'Learning Area',
            dataIndex: 'LearningArea',
            key: 'LearningArea',
            width: '15%',
            align: 'center',
        },
        {
            title: 'General Capability',
            dataIndex: 'GeneralCapability',
            key: 'GeneralCapability',
            width: '30%',
            render: (text) => (
                <div>
                    {text.split(',').map((item: string) => (
                        <p key={item} style={{ color: '#0F8AB0' }}>
                            {item}
                        </p>
                    ))}
                </div>
            ),
        },
        {
            title: 'Curriculum Content Description',
            dataIndex: 'Description',
            key: 'Description',
            width: '44%',
        },
    ]
    const data: curriculumsType[] = selectedCurriculums
    useEffect(() => {
        form.setFieldsValue({
            isNew: paramsFromCard === null ? 1 : paramsFromCard.isNew,
            activityId: paramsFromCard?.activityId,
            questName: paramsFromCard?.questName,
            questTypes: paramsFromCard?.questTypes,
            resourceUrl: paramsFromCard?.resourceUrl,
            realmId: paramsFromCard?.realm.RealmID,
        })
        if (paramsFromCard && paramsFromCard.realm) {
            dispatch(setSelectedRealm(paramsFromCard.realm))
        }
    }, [paramsFromCard])
    useEffect(() => {
        form.setFieldsValue({
            folderId: selectedFolder?.FolderID,
            realmId: selectedRealm?.RealmID,
            topicId: selectedTopic?.TopicID,
            keyConceptId: selectedKeyConcept?.KeyConceptID,
            purposeId: selectedPurpose?.PurposeID,
            ageRangeId: selectedAgeRange?.AgeRangeID,
            scientistId: selectedScientist?.ScientistID,
            fieldId: selectedField?.FieldID,
            institutionId: selectedInstitution?.InstitutionID,
            countryId: selectedCountry?.CountryID,
            curriculumIds: selectedCurriculums
                .map((item) => item.CurriculumID)
                .join(','),
        })
    }, [
        selectedFolder,
        selectedRealm,
        selectedTopic,
        selectedKeyConcept,
        selectedAgeRange,
        selectedPurpose,
        selectedScientist,
        selectedField,
        selectedInstitution,
        selectedCountry,
        selectedCurriculums,
    ])
    const resetFormData = (): void => {
        dispatch(setSelectedFolder(null))
        dispatch(setSelectedRealm(null))
        dispatch(setSelectedTopic(null))
        dispatch(setSelectedPurpose(null))
        dispatch(setSelectedAgeRange(null))
        dispatch(setSelectedKeyConcept(null))
        dispatch(setSelectedScientist(null))
        dispatch(setSelectedCountry(null))
        dispatch(setSelectedField(null))
        dispatch(setSelectedInstitution(null))
        dispatch(setSelectedCurriculums([]))
        form.resetFields()
    }
    const onPopoverClick = (): void => {
        setPopOverVisible(true)
    }
    const handleVisibleChange = (newVisible: boolean): void => {
        setPopOverVisible(newVisible)
    }
    const onMappingPopoverLinkClick = (index: number): void => {
        if (index === 0) {
            setPopOverVisible(false)
            dispatch(setShowModal(true))
        } else {
            message.info('Functionality under development.')
        }
    }
    const content = (
        <div>
            <div>
                <Button
                    style={{ width: '100%' }}
                    onClick={() => {
                        onMappingPopoverLinkClick(0)
                    }}
                >
                    Australian Curriculum
                </Button>
            </div>
            <div>
                <Button
                    style={{ width: '100%' }}
                    onClick={() => {
                        onMappingPopoverLinkClick(1)
                    }}
                >
                    Other International Curriculum
                </Button>
            </div>
        </div>
    )
    const showDrawer = (field: string): void => {
        dispatch(setField(field))
        switch (field) {
            case FOLDER:
                GetFolderApi().then((res) => {
                    dispatch(setFolders(res.Data.Folders))
                })
                break
            case REALM:
                GetRealmApi().then((res) => {
                    dispatch(setRealms(res.Data.Realms))
                })
                break
            case TOPIC:
                GetTopicApi().then((res) => {
                    dispatch(setTopics(res.Data.Topics))
                })
                break
            case KEYCONCEPT:
                GetKeyConceptApi().then((res) => {
                    dispatch(setKeyConcepts(res.Data.KeyConcepts))
                })
                break
            case EDUCATIONALUSE:
                GetPurposeApi().then((res) => {
                    dispatch(setPurposes(res.Data.Purposes))
                })
                break
            case AGERANGE:
                GetAgeRangeApi().then((res) => {
                    dispatch(setAgeRanges(res.Data.AgeRanges))
                })
                break
            case SCIENTIST:
                GetScientistApi().then((res) => {
                    dispatch(setScientists(res.Data.Scientists))
                })
                break
            case FIELD:
                GetFieldApi().then((res) => {
                    dispatch(setFields(res.Data.Fields))
                })
                break
            case INSTITUTION:
                GetInstitutionApi().then((res) => {
                    dispatch(setInstitutions(res.Data.Institutions))
                })
                break
            case COUNTRY:
                GetCountryApi().then((res) => {
                    dispatch(setCountries(res.Data.Countries))
                })
                break
            default:
                break
        }
        dispatch(setShowDrawer(true))
    }
    const onFinish = (values: any): void => {
        console.log('Success:', values)
        const params = {
            ...values,
            yearLevelIds: values.yearLevelIds.join(','),
            questTypes: values.questTypes.join(','),
            audienceRoleIds: values.audienceRoleIds.join(','),
        }
        MapCurriculumApi(params).then((res) => {
            console.log(res)
            if (res.Code === 200) {
                resetFormData()
                history('/activity-pool')
            }
        })
    }
    const onFinishFailed = (errorInfo: any): void => {
        console.log(errorInfo)
        message.info(errorInfo.errorFields[0].errors)
    }
    return (
        <div className="map-curriculum-form-container">
            <MappingModal />
            <MapCurriculumModal />
            <Form
                form={form}
                name="mapCurriculumForm"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                labelAlign="left"
                labelWrap
                colon={false}
            >
                <Form.Item
                    colon={false}
                    label="Identification"
                    className="fw_bold"
                />
                <Form.Item name="isNew" style={{ display: 'none' }}>
                    <Text>{paramsFromCard?.isNew || 1}</Text>
                </Form.Item>
                <Form.Item
                    label="Activity ID"
                    name="activityId"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your activity ID!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Quest Name"
                    name="questName"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your quest name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Quest Types"
                    name="questTypes"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your quest type!',
                        },
                    ]}
                >
                    <Checkbox.Group
                        style={{ width: '100%' }}
                        disabled={paramsFromCard !== null}
                    >
                        <Row>
                            {QUEST_TYPE.map((item) => (
                                <Col span={3} key={item.id}>
                                    <Checkbox value={item.name}>
                                        {item.name.replace(/^\S/, (s) =>
                                            s.toUpperCase()
                                        )}
                                    </Checkbox>
                                </Col>
                            ))}
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
                <Form.Item
                    label="Resource URL"
                    name="resourceUrl"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your resource Url!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="In-game Link"
                    name="ingameLink"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your in-game link !',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Divider dashed={false} className="ft_color_000" />
                </Form.Item>
                <Form.Item
                    colon={false}
                    label="My Activity Pool"
                    className="fw_bold"
                />
                <Form.Item label="Folder">
                    <div className="itemContentWrapper">
                        <Form.Item name="folderId">
                            <Text>{selectedFolder?.FolderName}</Text>
                        </Form.Item>
                        <Button
                            type="primary"
                            onClick={() => showDrawer('Folder')}
                            icon={<PlusOutlined />}
                        >
                            Select Folder
                        </Button>
                    </div>
                </Form.Item>
                <Form.Item>
                    <Divider dashed={false} className="ft_color_000" />
                </Form.Item>
                <Form.Item
                    colon={false}
                    label="Content Description"
                    className="fw_bold"
                />
                <Form.Item
                    label="Question Spoken"
                    name="questionSpoken"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your question spoken!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Realm" required>
                    <div className="itemContentWrapper">
                        <Form.Item
                            name="realmId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your realm!',
                                },
                            ]}
                        >
                            <span>{selectedRealm?.RealmName}</span>
                        </Form.Item>
                        <Button
                            type="primary"
                            onClick={() => showDrawer('Realm')}
                            icon={<PlusOutlined />}
                        >
                            Select Realm
                        </Button>
                    </div>
                </Form.Item>
                <Form.Item label="Topic" required>
                    <div className="itemContentWrapper">
                        <Form.Item
                            name="topicId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your topic!',
                                },
                            ]}
                        >
                            <span>{selectedTopic?.TopicName}</span>
                        </Form.Item>
                        <Button
                            type="primary"
                            onClick={() => showDrawer('Topic')}
                            icon={<PlusOutlined />}
                        >
                            Select Topic
                        </Button>
                    </div>
                </Form.Item>
                <Form.Item label="Key Concepts" required>
                    <div className="itemContentWrapper">
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your key concepts!',
                                },
                            ]}
                            name="keyConceptId"
                        >
                            <span>{selectedKeyConcept?.KeyConceptName}</span>
                        </Form.Item>
                        <Button
                            type="primary"
                            onClick={() => showDrawer('Key Concept')}
                            icon={<PlusOutlined />}
                        >
                            Select Key Concept
                        </Button>
                    </div>
                </Form.Item>
                <Form.Item
                    label="Real World Connection"
                    name="realWorldConnection"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Content Description"
                    name="contentDescription"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your content description!',
                        },
                    ]}
                >
                    <TextArea />
                </Form.Item>
                <Form.Item
                    label="Learning Intentions / Outcomes"
                    name="outcomes"
                    rules={[
                        {
                            required: true,
                            message:
                                'Please input your learning intentions / outcomes!',
                        },
                    ]}
                >
                    <TextArea />
                </Form.Item>
                <Form.Item>
                    <Divider dashed={false} className="ft_color_000" />
                </Form.Item>

                <Form.Item
                    colon={false}
                    label="Educational Use"
                    className="fw_bold"
                />
                <Form.Item
                    label=" "
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                >
                    <div className="itemContentWrapper">
                        <Form.Item name="purposeId" noStyle>
                            <span>{selectedPurpose?.PurposeName}</span>
                        </Form.Item>
                        <Button
                            type="primary"
                            onClick={() => showDrawer('Educational Use')}
                            icon={<PlusOutlined />}
                        >
                            Select Purpose
                        </Button>
                    </div>
                </Form.Item>
                <Form.Item>
                    <Divider dashed={false} className="ft_color_000" />
                </Form.Item>
                <Form.Item colon={false} label="Audience" className="fw_bold" />
                <Form.Item
                    label="Year Level"
                    name="yearLevelIds"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your year level!',
                        },
                    ]}
                >
                    <Checkbox.Group style={{ width: '100%' }}>
                        <Row>
                            {YEAR_LEVEL.map((item) => (
                                <Col span={8} key={item.id}>
                                    <Checkbox value={item.id}>
                                        {item.name}
                                    </Checkbox>
                                </Col>
                            ))}
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
                <Form.Item label="Age Range" required>
                    <div className="itemContentWrapper">
                        <Form.Item
                            name="ageRangeId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your age range!',
                                },
                            ]}
                        >
                            <span>{selectedAgeRange?.AgeRangeName}</span>
                        </Form.Item>
                        <Button
                            type="primary"
                            onClick={() => showDrawer('Age Range')}
                            icon={<PlusOutlined />}
                        >
                            Add Age Range
                        </Button>
                    </div>
                </Form.Item>
                <Form.Item
                    label="Audience Role"
                    name="audienceRoleIds"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your audience role!',
                        },
                    ]}
                >
                    <Checkbox.Group style={{ width: '100%' }}>
                        <Row>
                            {AUDIENCE_ROLE.map((item) => (
                                <Col span={6} key={item.id}>
                                    <Checkbox value={item.id}>
                                        {item.name}
                                    </Checkbox>
                                </Col>
                            ))}
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
                <Form.Item>
                    <Divider dashed={false} className="ft_color_000" />
                </Form.Item>
                <Form.Item
                    colon={false}
                    label="Curriculum Consistency"
                    className="fw_bold"
                />
                <Popover
                    content={content}
                    title=""
                    visible={popOverVisible}
                    onVisibleChange={handleVisibleChange}
                    trigger="click"
                    placement="right"
                    getPopupContainer={() =>
                        document.getElementById('chooseCurriculumBtn') ||
                        document.body
                    }
                >
                    <Button
                        type="primary"
                        id="chooseCurriculumBtn"
                        onClick={onPopoverClick}
                    >
                        Choose a Curriculum
                    </Button>
                </Popover>
                <Form.Item
                    name="curriculumIds"
                    label="Curriculums"
                    rules={[
                        {
                            required: true,
                            message: 'Please select curriculums!',
                        },
                    ]}
                >
                    <TableMy
                        tableProps={{
                            columns,
                            dataSource: data,
                            rowKey: (record) => record.CurriculumID,
                            pagination: {
                                hideOnSinglePage: true,
                                pageSize: 4,
                            },
                        }}
                    />
                </Form.Item>
                <Form.Item>
                    <Divider dashed={false} className="ft_color_000" />
                </Form.Item>
                <Form.Item colon={false} label="Author" className="fw_bold" />
                <Form.Item label="Scientist" required>
                    <div className="itemContentWrapper">
                        <Form.Item
                            name="scientistId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input scientist!',
                                },
                            ]}
                        >
                            <span>{selectedScientist?.ScientistName}</span>
                        </Form.Item>
                        <Button
                            type="primary"
                            onClick={() => showDrawer('Scientist')}
                            icon={<PlusOutlined />}
                        >
                            Select Scientist
                        </Button>
                    </div>
                </Form.Item>
                <Form.Item label="Field of Expertise" required>
                    <div className="itemContentWrapper">
                        <Form.Item
                            name="fieldId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input field of expertise!',
                                },
                            ]}
                        >
                            <span>{selectedField?.FieldName}</span>
                        </Form.Item>
                        <Button
                            type="primary"
                            onClick={() => showDrawer('Field')}
                            icon={<PlusOutlined />}
                        >
                            Select Field
                        </Button>
                    </div>
                </Form.Item>
                <Form.Item label="Title / Position" name="authorTitle">
                    <Input />
                </Form.Item>
                <Form.Item label="Institution">
                    <div className="itemContentWrapper">
                        <Form.Item name="institutionId">
                            <span>{selectedInstitution?.InstitutionName}</span>
                        </Form.Item>
                        <Button
                            type="primary"
                            onClick={() => showDrawer('Institution')}
                            icon={<PlusOutlined />}
                        >
                            Select Institution
                        </Button>
                    </div>
                </Form.Item>
                <Form.Item label="Email" name="authorEmail">
                    <Input />
                </Form.Item>
                <Form.Item label="Phone" name="authorPhone">
                    <Input />
                </Form.Item>
                <Form.Item label="Country">
                    <div className="itemContentWrapper">
                        <Form.Item name="countryId">
                            <span>{selectedCountry?.CountryName}</span>
                        </Form.Item>
                        <Button
                            type="primary"
                            onClick={() => showDrawer('Country')}
                            icon={<PlusOutlined />}
                        >
                            Select Country
                        </Button>
                    </div>
                </Form.Item>
                <Form.Item>
                    <Divider dashed={false} className="ft_color_000" />
                </Form.Item>

                <Form.Item
                    colon={false}
                    label="Mapping Person"
                    className="fw_bold"
                />
                <Form.Item
                    label="Name"
                    name="mapName"
                    rules={[
                        {
                            required: true,
                            message: 'Please input name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="mapEmail"
                    rules={[
                        {
                            required: true,
                            message: 'Please input email!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Phone" name="mapPhone">
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Divider dashed={false} className="ft_color_000" />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
                    <Button
                        style={{ width: '100%' }}
                        type="primary"
                        danger
                        htmlType="submit"
                        shape="round"
                    >
                        Confirm
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default MapCurriculumForm
