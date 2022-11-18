import React from 'react'
import { Button, Image, Popover, Tag, Typography } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import './index.scss'
import { NavLink } from 'react-router-dom'
import { activityTypes } from '../../api/apis/GetActivityPoolAPI'
import { QUEST_TYPE } from '../../utils/constants'

type propsType = {
    activity: activityTypes
}
const { Paragraph } = Typography

const CurriculumCard = (props: propsType): JSX.Element => {
    const { activity } = props
    const detailsUrl = `/activity-pool/mapping-results?activityId=${activity.ActivityID}`
    const mapCurriculumUrl = `/map-curriculum?activityId=${activity.ActivityID}`
    const content = (
        <div>
            <div>
                <NavLink
                    to={{
                        pathname: detailsUrl,
                    }}
                    state={{ activityId: activity.ActivityID }}
                >
                    Details
                </NavLink>
            </div>
            <div>
                <NavLink
                    to={{
                        pathname: mapCurriculumUrl,
                    }}
                    state={{
                        activityId: activity.ActivityID,
                        questName: activity.QuestName,
                        questTypes: activity.QuestTypes,
                        resourceUrl: activity.ResourceUrl,
                        realm: activity.Realm,
                        isNew: 0,
                    }}
                >
                    Map Curriculum
                </NavLink>
            </div>
        </div>
    )
    return (
        <div className="curriculum-card-container bd_AAA4A4">
            <div className="top">
                <Image
                    preview={false}
                    src={
                        activity.ImageSrc
                            ? activity.ImageSrc
                            : `https://cdn.vox-cdn.com/thumbor/Pkmq1nm3skO0-j693JTMd7RL0Zk=/0x0:2012x1341/1200x800/filters:focal(0x0:2012x1341)/cdn.vox-cdn.com/uploads/chorus_image/image/47070706/google2.0.0.jpg`
                    }
                />
            </div>
            <div className="mid pd_10">
                <Paragraph className="id ft_color_555 fz_14 mb_5">
                    <span className="fw_bold">ID: </span>
                    {activity.ActivityID}
                </Paragraph>
                <Paragraph
                    className="title ft_color_000 fz_18 fw_bold mb_5"
                    ellipsis={{ rows: 1 }}
                >
                    {activity.QuestName}
                </Paragraph>
                <Paragraph
                    className="folder ft_color_555 fz_14 mb_5"
                    ellipsis={{ rows: 1 }}
                >
                    <span className="fw_bold">Folder: </span>
                    {activity.FolderName}
                </Paragraph>
                <Paragraph
                    className="status ft_color_555 fz_14 mb_5"
                    ellipsis={{ rows: 1 }}
                >
                    <span className="fw_bold">Status: </span>
                    {activity.MapStatus === '0' ? 'Unmapped' : 'Mapped'}
                </Paragraph>
                <Paragraph
                    className="level ft_color_555 fz_14"
                    ellipsis={{ rows: 1 }}
                >
                    <span className="fw_bold">Year Level: </span>
                    {activity.YearLevels?.map((item) => (
                        <Tag key={item.YearLevelID} color="blue">
                            {item.YearLevelName}
                        </Tag>
                    ))}
                </Paragraph>
            </div>
            <div className="bot pd_10">
                <Paragraph className="questTypesBox" ellipsis={{ rows: 1 }}>
                    {activity.QuestTypes.map((type) => (
                        <Button
                            key={type}
                            shape="round"
                            style={{
                                backgroundColor:
                                    QUEST_TYPE.filter(
                                        (item) => item.name === type
                                    )[0]?.bgc || '',
                                color: 'white',
                                fontWeight: 'bold',
                                marginRight: '5px',
                            }}
                        >
                            {type.replace(/^\S/, (s) => s.toUpperCase())}
                        </Button>
                    ))}
                </Paragraph>
                <div className="link">
                    <Popover
                        content={content}
                        title=""
                        trigger="hover"
                        placement="topRight"
                    >
                        <LinkOutlined />
                    </Popover>
                </div>
            </div>
        </div>
    )
}

export default CurriculumCard
