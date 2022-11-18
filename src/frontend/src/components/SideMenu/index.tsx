import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, MenuProps } from 'antd'
import {
    AppstoreOutlined,
    FileAddOutlined,
    ApartmentOutlined,
    UploadOutlined,
} from '@ant-design/icons'
import './index.scss'

type MenuItem = Required<MenuProps>['items'][number]
const SideMenu = (): JSX.Element => {
    const navigate = useNavigate()
    const history = useLocation()
    const getItem = (
        label: React.ReactNode,
        path?: string,
        key?: React.Key | null,
        icon?: React.ReactNode
    ): MenuItem => {
        return {
            key,
            icon,
            label,
            path,
        } as MenuItem
    }
    const items = [
        getItem(
            'My Activity Pool',
            '/activity-pool',
            '/activity-pool',
            <AppstoreOutlined />
        ),
        getItem(
            'New Activity',
            '/new-activity',
            '/new-activity',
            <FileAddOutlined />
        ),
        getItem(
            'Map Curriculum',
            '/map-curriculum',
            '/map-curriculum',
            <ApartmentOutlined />
        ),
        getItem(
            'Upload Content',
            '/upload-content',
            '/upload-content',
            <UploadOutlined />
        ),
    ]
    const onClick = (e: object): void => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { key } = e
        navigate(key)
    }
    return (
        <Menu
            theme="dark"
            className="menu_container main_bg_color"
            defaultSelectedKeys={[]}
            selectedKeys={[history.pathname]}
            items={items}
            onClick={onClick}
        />
    )
}

export default SideMenu
