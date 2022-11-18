import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Layout } from 'antd'
import {
    activityPoolSelector,
    totalNumSelector,
} from '../../store/reducers/activityPool'
import CheckBoxMy from '../CheckBoxMy'
import CurriculumCard from '../CurriculumCard'
import PaginationMy from '../PaginationMy'
import { setFolders } from '../../store/reducers/mapping'
import './index.scss'
import { GetFolderApi } from '../../api'

const { Header, Content, Sider } = Layout

const ActivityPool = (): JSX.Element => {
    const dispatch = useDispatch()
    useEffect(() => {
        GetFolderApi().then((res) => {
            dispatch(setFolders(res.Data.Folders))
        })
    }, [])
    const activityPool = useSelector(activityPoolSelector)
    const totalNum = useSelector(totalNumSelector)
    return (
        <div className="activity-pool-container pd_15">
            <Layout>
                <Sider width="25%" className="site-layout-background">
                    <CheckBoxMy />
                </Sider>
                <Layout>
                    <Header className="bg_color_fff">
                        <div className="poolNum">{`${totalNum} ${
                            totalNum > 1 ? 'Activities' : 'Activity'
                        } Available`}</div>
                        <PaginationMy />
                    </Header>
                    <Content
                        className="site-layout-background thin-scroll-bar"
                        style={{
                            margin: 0,
                            minHeight: 280,
                        }}
                    >
                        {activityPool &&
                            activityPool.map((item) => (
                                <CurriculumCard
                                    key={item.ActivityID}
                                    activity={item}
                                />
                            ))}
                    </Content>
                </Layout>
            </Layout>
        </div>
    )
}

export default ActivityPool
