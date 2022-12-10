import {
    UserOutlined,
    BgColorsOutlined,
    CameraOutlined,
    PushpinOutlined,
    CommentOutlined,
    DashboardOutlined,
    UserSwitchOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import  {useWindowWidth } from '@react-hook/window-size'

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem(<Link href="/admin">Dashboard</Link>, '/admin', <DashboardOutlined />),
    getItem('Posts', 'posts', <PushpinOutlined />, [
        getItem(<Link href="/admin/post">All posts</Link>, '/admin/post'),
        getItem(<Link href="/admin/post/new">Add New</Link>, '/admin/post/new'),
        getItem(<Link href="/admin/category">Categories </Link>, '/admin/category'),
    ]),
    getItem(<Link href="/admin/comment">Comments</Link>, '/admin/comment', <CommentOutlined />),
    getItem('Media', 'medias', <CameraOutlined />, [
        getItem(<Link href="/admin/media/library">Library </Link>, '/admin/media/library'),
        getItem(<Link href="/admin/media/new">Add new </Link>, '/admin/media/new'),
    ]),
    getItem('Users', 'users', <UserSwitchOutlined />, [
        getItem(<Link href="/admin/user">All users </Link>, '/admin/user'),
        getItem(<Link href="/admin/user/new">Add new </Link>, '/admin/user/new'),
    ]),
    getItem(<Link href="/admin/userid">Profile</Link>, '/admin/userid', <UserOutlined />),
    getItem(<Link href="/admin/customize">Customize</Link>, '/admin/customize', <BgColorsOutlined />),
];

const AdminNav: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false)
    const [current, setCurrent] = useState('')
    const onlyWidth = useWindowWidth()

    useEffect(() => {
        (typeof window === 'object' && setCurrent(window.location.pathname))

    }, [typeof window === 'object' && window.location.pathname])

    useEffect(() => {
        setCollapsed(onlyWidth < 800)
    },[onlyWidth < 800])
    
    return (
        <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)} >
            <div className="logo" />
            <Menu theme='dark'  mode="inline" defaultOpenKeys={['posts','medias','users']} items={items} selectedKeys={[current]} />
        </Sider>)
}
export default AdminNav