import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Button, Descriptions, Divider, List, Tag } from 'antd'
import { saveAs } from 'file-saver'
import { ColumnsType } from 'antd/lib/table'
import BreadCrumbMy from '../BreadCrumbMy'
import './index.scss'
import {
    activityTypes,
    CurriculumType,
    fileType,
    GetActivityApi,
} from '../../api/apis/GetActivityPoolAPI'
import { DownloadFileApi } from '../../api'
import TableMy from '../TableMy'
import { QUEST_TYPE } from '../../utils/constants'

interface CustomizedState {
    activityId: string
}

const MappingResults = (): JSX.Element => {
    const location = useLocation()
    const state = location.state as CustomizedState
    const { activityId } = state
    const initActivity = {
        ActivityID: 0,
        QuestName: '',
        QuestTypes: [],
        ResourceUrl: '',
        Link: '',
        CreateDate: '',
        QuestionSpoken: '',
        RealmName: '',
        TopicName: '',
        KeyConceptName: '',
        ContentDescription: '',
        Outcomes: '',
        AgeRangeName: '',
        ScientistName: '',
        FieldName: '',
        MappingPersonName: '',
        MappingPersonEmail: '',
        FolderName: '',
        RealWorldConnection: '',
        PurposeName: '',
        AuthorTitle: '',
        InstitutionName: '',
        AuthorEmail: '',
        AuthorPhone: '',
        CountryName: '',
        MappingPersonPhone: '',
        MapDate: '',
        MapStatus: '0',
        Curriculums: null,
        GeneralCapabilities: null,
        AudienceRoles: null,
        Files: [],
        YearLevels: null,
    }
    const [activity, setActivity] = useState<activityTypes>(initActivity)
    useEffect(() => {
        if (
            activityId !== null &&
            activityId !== undefined &&
            activityId !== ''
        ) {
            GetActivityApi({ activityId }).then((res) => setActivity(res.Data))
        }
    }, [activityId])
    const downloadFile = (source: fileType): void => {
        const params = {
            fileId: source.FileID,
            activityId,
        }
        DownloadFileApi(params).then((res) => {
            const fileBlob = new Blob([res])
            saveAs(fileBlob, source.FileName)
        })
    }
    const columns: ColumnsType<CurriculumType> = [
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
            title: 'General Capabilities',
            dataIndex: 'GeneralCapabilities',
            key: 'GeneralCapabilities',
            width: '30%',
            align: 'left',
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
            align: 'left',
        },
    ]
    const mainLabelStyle = {
        color: '#555',
        fontSize: '18px',
        fontWeight: 'bold',
    }
    const contentStyle = {
        color: '#555',
        fontSize: '16px',
        fontWeight: 'normal',
    }
    return (
        <div className="mapping-results-container">
            <BreadCrumbMy />
            <div className="content bg_color_fff thin-scroll-bar pd_15">
                <Descriptions
                    title="Identification"
                    column={1}
                    labelStyle={mainLabelStyle}
                    contentStyle={contentStyle}
                    colon={false}
                >
                    <Descriptions.Item label="Activity ID">
                        {activity.ActivityID}
                    </Descriptions.Item>
                    <Descriptions.Item label="Quest Name">
                        {activity.QuestName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Quest Type">
                        {activity.QuestTypes.map((type) => (
                            <Button
                                key={type}
                                shape="round"
                                style={{
                                    backgroundColor: QUEST_TYPE.filter(
                                        (item) => item.name === type
                                    )[0].bgc,
                                    color: 'white',
                                    fontWeight: 'bold',
                                    marginRight: '5px',
                                }}
                            >
                                {type.replace(/^\S/, (s) => s.toUpperCase())}
                            </Button>
                        ))}
                    </Descriptions.Item>
                    <Descriptions.Item label="Resource URL">
                        {activity.ResourceUrl}
                    </Descriptions.Item>
                    <Descriptions.Item label="In-game Link">
                        {activity.Link}
                    </Descriptions.Item>
                    <Descriptions.Item label="Create Date">
                        {activity.CreateDate}
                    </Descriptions.Item>
                    <Descriptions.Item label="Map Date">
                        {activity.MapDate}
                    </Descriptions.Item>
                </Descriptions>

                <Divider dashed={false} className="ft_color_000" />

                <Descriptions
                    title="My Activity Pool"
                    column={1}
                    labelStyle={mainLabelStyle}
                    contentStyle={contentStyle}
                    colon={false}
                >
                    <Descriptions.Item label="Folder">
                        {activity.FolderName}
                    </Descriptions.Item>
                </Descriptions>

                <Divider dashed={false} className="ft_color_000" />

                <Descriptions
                    title="Content Description"
                    column={1}
                    labelStyle={mainLabelStyle}
                    contentStyle={contentStyle}
                    colon={false}
                >
                    <Descriptions.Item label="Question Spoken">
                        {activity.QuestionSpoken}
                    </Descriptions.Item>
                    <Descriptions.Item label="Realm">
                        {activity.RealmName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Topic">
                        {activity.TopicName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Key Concepts">
                        {activity.KeyConceptName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Real World Connection">
                        {activity.RealWorldConnection}
                    </Descriptions.Item>
                    <Descriptions.Item label="Content Description">
                        {activity.ContentDescription}
                    </Descriptions.Item>
                    <Descriptions.Item label="Learning Intentions / Outcomes">
                        {activity.Outcomes}
                    </Descriptions.Item>
                </Descriptions>

                <Divider dashed={false} className="ft_color_000" />

                <Descriptions
                    title="Educational Use"
                    column={1}
                    labelStyle={mainLabelStyle}
                    contentStyle={contentStyle}
                    colon={false}
                >
                    <Descriptions.Item label="Purpose">
                        {activity.PurposeName}
                    </Descriptions.Item>
                </Descriptions>

                <Divider dashed={false} className="ft_color_000" />

                <Descriptions
                    title="Audience"
                    column={1}
                    labelStyle={mainLabelStyle}
                    contentStyle={contentStyle}
                    colon={false}
                >
                    <Descriptions.Item label="Year Level">
                        <div>
                            {activity.YearLevels?.map((item) => (
                                <Tag key={item.YearLevelID} color="blue">
                                    {item.YearLevelName}
                                </Tag>
                            ))}
                        </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Age Range">
                        {activity.AgeRangeName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Audience Role">
                        <div>
                            {activity.AudienceRoles?.map((item) => (
                                <Tag key={item.AudienceRoleID} color="cyan">
                                    {item.AudienceRoleName}
                                </Tag>
                            ))}
                        </div>
                    </Descriptions.Item>
                </Descriptions>

                <Divider dashed={false} className="ft_color_000" />

                <Descriptions
                    title="Curriculum Consistency"
                    column={1}
                    labelStyle={mainLabelStyle}
                    contentStyle={contentStyle}
                    colon={false}
                >
                    <Descriptions.Item label="Curriculum Type">
                        Australian F-10 Curriculum
                    </Descriptions.Item>
                    <Descriptions.Item label="Curriculums">
                        <TableMy
                            tableProps={{
                                columns,
                                dataSource:
                                    activity.Curriculums === null
                                        ? []
                                        : activity.Curriculums,
                                rowKey: (record) => record.CurriculumID,
                                pagination: {
                                    hideOnSinglePage: true,
                                    pageSize: 4,
                                },
                            }}
                        />
                    </Descriptions.Item>
                </Descriptions>
                <Divider dashed={false} className="ft_color_000" />
                <Descriptions
                    title="Author"
                    column={1}
                    labelStyle={mainLabelStyle}
                    contentStyle={contentStyle}
                    colon={false}
                >
                    <Descriptions.Item label="Scientist">
                        {activity.ScientistName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Field of Expertise">
                        {activity.FieldName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Title / Position">
                        {activity.AuthorTitle}
                    </Descriptions.Item>
                    <Descriptions.Item label="Institution">
                        {activity.InstitutionName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                        {activity.AuthorEmail}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone">
                        {activity.AuthorPhone}
                    </Descriptions.Item>
                </Descriptions>

                <Divider dashed={false} className="ft_color_000" />

                <Descriptions
                    title="Attached Files"
                    column={1}
                    labelStyle={mainLabelStyle}
                    contentStyle={contentStyle}
                    colon={false}
                >
                    {activity.Files !== null ? (
                        <Descriptions.Item label="File Names">
                            <List
                                size="small"
                                dataSource={activity.Files}
                                renderItem={(item) => (
                                    <List.Item
                                        actions={[
                                            <Button
                                                onClick={() =>
                                                    downloadFile(item)
                                                }
                                            >
                                                Download
                                            </Button>,
                                        ]}
                                    >
                                        {item.FileName}
                                    </List.Item>
                                )}
                            />
                        </Descriptions.Item>
                    ) : (
                        <Descriptions.Item label="File Names">
                            No attached files
                        </Descriptions.Item>
                    )}
                </Descriptions>
                <Divider dashed={false} className="ft_color_000" />
                <Descriptions
                    title="Mapping Person"
                    column={1}
                    labelStyle={mainLabelStyle}
                    contentStyle={contentStyle}
                    colon={false}
                >
                    <Descriptions.Item label="Name">
                        {activity.MappingPersonName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                        {activity.MappingPersonEmail}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone">
                        {activity.MappingPersonPhone}
                    </Descriptions.Item>
                </Descriptions>
            </div>
        </div>
    )
}

export default MappingResults
