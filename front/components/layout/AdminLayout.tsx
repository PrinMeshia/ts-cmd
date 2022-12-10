import { Layout } from "antd"
import React, { useState } from 'react'
import AdminNav from "../navigation/AdminNav"
const { Content, Sider } = Layout

type AdminLayourProps = {
    children: React.ReactNode,
}

export default function AdminLayout({ children }: AdminLayourProps) {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AdminNav/>
            <Layout className="site-layout">
                <Content className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    )
}


