// @flow
import * as React from 'react'
import './index.scss'
import { Image } from 'antd'

const Header = (): JSX.Element => (
    <div className="header_container">
        <Image
            alt="Gate Logo"
            src={`${process.env.PUBLIC_URL}/img/gate_logo.png`}
            preview={false}
            width={123}
            height={59}
        />
    </div>
)

export default Header
