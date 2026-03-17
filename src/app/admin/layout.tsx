"use client";

import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
  DashboardOutlined,
  HomeOutlined,
  UserOutlined,
  MessageOutlined,
  PlusOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';

const { Header, Sider, Content } = Layout;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/properties',
      icon: <HomeOutlined />,
      label: 'Properties',
    },
    {
      key: '/admin/agents',
      icon: <UserOutlined />,
      label: 'Agents',
    },
    {
      key: '/admin/leads',
      icon: <MessageOutlined />,
      label: 'Leads',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div className="p-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#c4a661] rounded-sm" />
          {!collapsed && <span className="font-black text-lg uppercase">Admin</span>}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '24px' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <div className="flex items-center gap-4">
             <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push('/admin/properties/new')}>
               Add Property
             </Button>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
