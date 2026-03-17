"use client";

import React from 'react';
import { Row, Col, Card, Statistic, Table, Typography } from 'antd';
import { HomeOutlined, UserOutlined, MessageOutlined, ArrowUpOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function AdminDashboardPage() {
  const stats = [
    { title: 'Total Properties', value: 12, icon: <HomeOutlined />, color: '#1890ff' },
    { title: 'Active Agents', value: 4, icon: <UserOutlined />, color: '#52c41a' },
    { title: 'New Leads', value: 28, icon: <MessageOutlined />, color: '#faad14' },
  ];

  const recentLeads = [
    { key: '1', name: 'Rahul Sharma', property: 'Astrus Capella', date: '2026-03-16' },
    { key: '2', name: 'Amit Singh', property: 'SKA Divine', date: '2026-03-15' },
    { key: '3', name: 'Priya Verma', property: 'Entilla 4CS', date: '2026-03-15' },
  ];

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Property', dataIndex: 'property', key: 'property' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];

  return (
    <div className="space-y-8">
      <Title level={2}>Dashboard Overview</Title>
      
      <Row gutter={16}>
        {stats.map((stat) => (
          <Col span={8} key={stat.title}>
            <Card bordered={false}>
              <Statistic
                title={stat.title}
                value={stat.value}
                valueStyle={{ color: stat.color }}
                prefix={stat.icon}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="Recent Enquiries">
        <Table dataSource={recentLeads} columns={columns} pagination={false} />
      </Card>
    </div>
  );
}
