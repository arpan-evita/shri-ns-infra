"use client";

import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Typography, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProperties = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*, agents(name)')
      .order('created_at', { ascending: false });

    if (error) {
      message.error('Failed to fetch properties');
    } else {
      setProperties(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this property?',
      onOk: async () => {
        const { error } = await supabase.from('properties').delete().eq('id', id);
        if (error) {
          message.error('Delete failed');
        } else {
          message.success('Property deleted');
          fetchProperties();
        }
      },
    });
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Type', dataIndex: 'property_type', key: 'property_type' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'buy' ? 'blue' : 'green'}>
          {status === 'buy' ? 'SALE' : 'RENT'}
        </Tag>
      )
    },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (price: number) => `₹${price?.toLocaleString()}` },
    { title: 'Agent', dataIndex: 'agents', key: 'agent', render: (agent: any) => agent?.name },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => router.push(`/admin/properties/edit/${record.id}`)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={2}>Manage Properties</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push('/admin/properties/new')}>
          Add New Property
        </Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={properties} 
        rowKey="id" 
        loading={loading}
      />
    </div>
  );
}
