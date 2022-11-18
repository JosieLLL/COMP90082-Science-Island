import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Breadcrumb } from 'antd'
import './index.scss'

const BreadCrumbMy = (): JSX.Element => {
    const breadcrumbNameMap = {
        '/activity-pool': 'My Activity Pool',
        '/new-activity': 'New Activity',
        '/map-curriculum': 'Map Curriculum',
        '/upload-content': 'Upload Content',
        '/activity-pool/mapping-results': 'Mapping Results',
    }
    const location = useLocation()
    const pathSnippets = location.pathname.split('/').filter((i) => i)
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
        return (
            <Breadcrumb.Item key={url}>
                <Link to={url}>
                    {breadcrumbNameMap[url as keyof typeof breadcrumbNameMap]}
                </Link>
            </Breadcrumb.Item>
        )
    })
    const breadcrumbItems = [
        <Breadcrumb.Item key="home">
            <Link to="/">Home</Link>
        </Breadcrumb.Item>,
    ].concat(extraBreadcrumbItems)

    return <Breadcrumb>{breadcrumbItems}</Breadcrumb>
}

export default BreadCrumbMy
