import React, { useEffect, useState } from 'react'
import { UploadFile } from 'antd/lib/upload/interface'
import { useDispatch, useSelector } from 'react-redux'
import {
    Button,
    Form,
    Input,
    Layout,
    message,
    Typography,
    Upload,
    UploadProps,
} from 'antd'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import MappingModel from '../MappingModal'
import {
    folderSelector,
    setField,
    setFolders,
    setShowDrawer,
} from '../../store/reducers/mapping'
import { uploadContentSelectedFolderSelector } from '../../store/reducers/newActivity'
import { UPLOAD_CONTENT_FOLDER } from '../../utils/constants'
import { GetFolderApi, UploadFileApi } from '../../api'
import { getToken, getUid } from '../../utils/helper'
import { API_SERVER } from '../../settings'
import './index.scss'
import { uploadFileParamsTypes } from '../../api/apis/UploadFile'
import { newActivityResponseTypes } from '../../api/apis/NewActivity'

const UploadContent = (): JSX.Element => {
    const [form] = Form.useForm()
    const [uploadFileList, setUploadFileList] = useState<
        UploadFile<newActivityResponseTypes>[]
    >([])
    const dispatch = useDispatch()
    const selectedFolder = useSelector(uploadContentSelectedFolderSelector)
    const folders = useSelector(folderSelector)
    useEffect(() => {
        form.setFieldsValue({
            folder: selectedFolder,
        })
    }, [selectedFolder])
    const { Content } = Layout
    const { Text } = Typography
    const showDrawer = (field: string): void => {
        dispatch(setField(field))
        switch (field) {
            case UPLOAD_CONTENT_FOLDER:
                GetFolderApi().then((res) => {
                    dispatch(setFolders(res.Data.Folders))
                })
                break
            default:
                break
        }
        dispatch(setShowDrawer(true))
    }
    const onFinish = (values: any): void => {
        console.log('Success:', values, folders)
        const fileIdsArr: Array<number> = []
        uploadFileList.forEach((item) => {
            const FileId = item.response?.Data.FileID
            if (FileId !== undefined) {
                fileIdsArr.push(FileId)
            }
        })
        const fileIds = fileIdsArr.join(',')
        const params: uploadFileParamsTypes = {
            activityId: Number.parseInt(values.activityID, 10),
            fileIds,
            folderId: selectedFolder?.FolderID,
        }
        console.log(params)
        UploadFileApi(params).then((res) => {
            if (res.Code === 200) {
                message.info(res.Msg)
                form.resetFields()
            } else {
                message.warn('Failed to upload contents.')
            }
        })
    }
    const onFinishFailed = (errorInfo: any): void => {
        console.log('Failed:', errorInfo)
    }
    const Token = getToken()
    const Userid = getUid()
    const props: UploadProps<string> = {
        action: `${API_SERVER}/upload-file`,
        headers: {
            Token: Token === null ? '' : Token,
            Userid: Userid === null ? '' : Userid,
        },
        onChange({ file, fileList }) {
            console.log(file, fileList)
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
        <div className="uploadContentContainer">
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
                        name="uploadContentForm"
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
                                        showDrawer('Upload Content Folder')
                                    }
                                    icon={<PlusOutlined />}
                                >
                                    Select Folder
                                </Button>
                            </div>
                        </Form.Item>
                        <Form.Item
                            label="Activity ID"
                            name="activityID"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input activity ID!',
                                },
                            ]}
                        >
                            <Input placeholder="Define a unique activity ID." />
                        </Form.Item>
                        <Form.Item
                            label="Upload file"
                            getValueFromEvent={handleFile}
                            name="uploadFile"
                            valuePropName="fileList"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please upload the attachment.',
                                },
                            ]}
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
                                Upload File
                            </Button>
                        </Form.Item>
                    </Form>
                </Content>
            </Layout>
        </div>
    )
}

export default UploadContent
