import { Menu } from 'antd'
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons'
import {useState} from 'react'
import ToggleTheme from './ToggleTheme'
import Link from 'next/link'
const { SubMenu } = Menu

const TopNav = () => {
    const [current, setCurrent] = useState('mail')
    const handleClick = (e: any): void => {
        console.log("click", e)
        setCurrent(e.key)
    }

    return (
        <Menu
            onClick={handleClick}
            selectedKeys={[current]}
            mode='horizontal'
        >
            <Menu.Item key="mail" icon={<MailOutlined />}>
                <Link href={"/"}>Medevia</Link>
            </Menu.Item>
            <Menu.Item key="signup" icon={<AppstoreOutlined />}>
            <Link href={"/signup"}>Signup</Link>
            </Menu.Item>
            <Menu.Item key="signin" icon={<AppstoreOutlined />}>
            <Link href={"/signin"}>SignIn</Link>
            </Menu.Item>
            <SubMenu key="SubMenu" title="Dashboard" icon={<SettingOutlined />} style={{marginLeft: 'auto'}}>
                <Menu.ItemGroup title="Management">
                    <Menu.Item key="setting:2" icon={<AppstoreOutlined />}>
                        <Link href={"/admin"}>Admin</Link>
                    </Menu.Item>
                </Menu.ItemGroup>
            </SubMenu>
            <Menu.Item key="theme">
                <ToggleTheme/>
            </Menu.Item>
        </Menu>
    )
}

export default TopNav