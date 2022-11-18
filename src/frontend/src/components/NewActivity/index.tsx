import React, { useEffect, useState } from 'react'
import {
    Layout,
    Form,
    Input,
    Button,
    Upload,
    UploadProps,
    Typography,
    message,
    Row,
    Col,
    Checkbox,
} from 'antd'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { UploadFile } from 'antd/lib/upload/interface'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
    setField,
    setShowDrawer,
    setFolders,
    selectedRealmSelector,
    setRealms,
    setSelectedRealm,
} from '../../store/reducers/mapping'
import {
    newActivitySelectedFolderSelector,
    setNewActivitySelectedFolder,
} from '../../store/reducers/newActivity'
import { NEW_ACTIVITY_FOLDER, QUEST_TYPE, REALM } from '../../utils/constants'
import { GetFolderApi, GetRealmApi, NewActivityApi } from '../../api'
import MappingModel from '../MappingModal'
import { API_SERVER } from '../../settings'
import { getToken, getUid } from '../../utils/helper'
import {
    newActivityParamsTypes,
    newActivityResponseTypes,
} from '../../api/apis/NewActivity'
import './index.scss'

const { Text } = Typography
const NewActivity = (): JSX.Element => {
    const [form] = Form.useForm()
    const [uploadFileList, setUploadFileList] = useState<
        UploadFile<newActivityResponseTypes>[]
    >([])
    const dispatch = useDispatch()
    const history = useNavigate()
    const selectedFolder = useSelector(newActivitySelectedFolderSelector)
    const selectedRealm = useSelector(selectedRealmSelector)
    useEffect(() => {
        form.setFieldsValue({
            folder: selectedFolder?.FolderID,
            realmId: selectedRealm?.RealmID,
        })
    }, [selectedFolder, selectedRealm])
    const { Content } = Layout
    const showDrawer = (field: string): void => {
        dispatch(setField(field))
        switch (field) {
            case NEW_ACTIVITY_FOLDER:
                GetFolderApi().then((res) => {
                    dispatch(setFolders(res.Data.Folders))
                })
                break
            case REALM:
                GetRealmApi().then((res) => {
                    dispatch(setRealms(res.Data.Realms))
                })
                break
            default:
                break
        }
        dispatch(setShowDrawer(true))
    }
    const resetFormData = (): void => {
        dispatch(setNewActivitySelectedFolder(null))
        dispatch(setSelectedRealm(null))
        form.resetFields()
    }
    const onFinish = (values: any): void => {
        console.log('Success:', values)
        const fileIdsArr: Array<number> = []
        uploadFileList.forEach((item) => {
            const FileId = item.response?.Data.FileID
            if (FileId !== undefined) {
                fileIdsArr.push(FileId)
            }
        })
        const fileIds = fileIdsArr.join(',')
        const params: newActivityParamsTypes = {
            folderId: values.folder,
            questName: values.quest,
            questTypes: values.questTypes.join(','),
            activityId: Number.parseInt(values.activityID, 10),
            realmId: values.realmId,
            resourceUrl: values.resourceURL,
            fileIds,
        }
        NewActivityApi(params).then((res) => {
            if (res.Code === 200) {
                message.info(res.Msg)
                resetFormData()
                history('/activity-pool')
            } else {
                message.warn('Failed to new an activity.')
            }
        })
    }
    const onFinishFailed = (errorInfo: any): void => {
        console.log(errorInfo)
        message.info(errorInfo.errorFields[0].errors)
    }
    const Token = getToken()
    const Userid = getUid()
    const props: UploadProps<string> = {
        action: `${API_SERVER}/upload-file`,
        headers: {
            Token: Token === null ? '' : Token,
            Userid: Userid === null ? '' : Userid,
        },
        onChange({ file }) {
            if (file.status === 'done') {
                setUploadFileList([...uploadFileList, file as UploadFile])
            }
        },
    }
    const handleFile = (e: any): any => {
        if (Array.isArray(e)) return e
        return e && e.fileList
    }
    return (
        <div className="new-activity-container">
            <Layout style={{ padding: '0 0 0 24px' }}>
                <Content
                    className="site-layout-background thin-scroll-bar"
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                    }}
                >
                    <MappingModel />
                    <Form
                        name="newActivityForm"
                        form={form}
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 18 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        labelWrap
                        scrollToFirstError
                    >
                        <Form.Item label="Folder">
                            <div className="itemContentWrapper">
                                <Form.Item name="folder">
                                    <Text>{selectedFolder?.FolderName}</Text>
                                </Form.Item>
                                <Button
                                    type="primary"
                                    onClick={() =>
                                        showDrawer('New Activity Folder')
                                    }
                                    icon={<PlusOutlined />}
                                >
                                    Select Folder
                                </Button>
                            </div>
                        </Form.Item>
                        <Form.Item
                            label="Quest Name"
                            name="quest"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Please enter quest name in 40 characters or less!',
                                    max: 40,
                                },
                            ]}
                        >
                            <Input placeholder="Story Name or Title" />
                        </Form.Item>
                        <Form.Item
                            label="Quest Types"
                            name="questTypes"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input quest type!',
                                },
                            ]}
                        >
                            <Checkbox.Group style={{ width: '100%' }}>
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
                            label="Activity ID"
                            name="activityID"
                            rules={[
                                {
                                    required: true,
                                    type: 'number',
                                    transform: (value) =>
                                        Number.parseInt(value, 10),
                                    message:
                                        'Please input numeric type activity ID!',
                                },
                            ]}
                        >
                            <Input placeholder="Define a unique numeric activity ID, i.e., 1" />
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
                        <Form.Item label="Resource URL" name="resourceURL">
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Upload File"
                            name="uploadFile"
                            valuePropName="fileList"
                            getValueFromEvent={handleFile}
                        >
                            <Upload {...props}>
                                <Button icon={<UploadOutlined />}>
                                    Upload
                                </Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                            >
                                Add new activity
                            </Button>
                        </Form.Item>
                    </Form>
                </Content>
            </Layout>
        </div>
    )
}

export default NewActivity
