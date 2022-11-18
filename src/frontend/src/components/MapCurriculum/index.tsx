import React from 'react'
import './index.scss'
import { Layout } from 'antd'
import MapCurriculumForm from '../MapCurriculumForm'

const MapCurriculum = (): JSX.Element => {
    const { Content } = Layout
    return (
        <div className="map-curriculum bd_AAA4A4">
            <Layout style={{ padding: '0 0 0 24px' }}>
                <Content
                    className="site-layout-background thin-scroll-bar"
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                    }}
                >
                    <MapCurriculumForm />
                </Content>
            </Layout>
        </div>
    )
}

export default MapCurriculum
