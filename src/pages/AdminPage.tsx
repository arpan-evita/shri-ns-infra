import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Typography, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

export const AdminPage = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProperties = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*, agents(name)')
      .order('created_at', { ascending: false });

    if (error) {
      message.error('Failed to fetch properties');
    } else {
      setProperties(data || []);
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
          <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/properties/edit/${record.id}`)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-white text-black">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex justify-between items-center">
          <Title level={2}>Admin Dashboard</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/properties/new')}>
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
    </div>
  );
};
