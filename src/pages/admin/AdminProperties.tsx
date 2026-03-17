import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Typography, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

export const AdminProperties = () => {
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
      okText: 'Delete',
      okType: 'danger',
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
    { 
      title: 'Property', 
      dataIndex: 'title', 
      key: 'title',
      render: (text: string) => <Text className="font-bold text-slate-800">{text}</Text>
    },
    { title: 'Type', dataIndex: 'property_type', key: 'property_type' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'buy' ? 'gold' : 'cyan'} className="uppercase font-bold border-none px-3">
          {status === 'buy' ? 'SALE' : 'RENT'}
        </Tag>
      )
    },
    { 
      title: 'Price', 
      dataIndex: 'price', 
      key: 'price', 
      render: (price: number) => <Text className="font-mono text-primary font-bold">₹{price?.toLocaleString()}</Text> 
    },
    { title: 'Agent', dataIndex: 'agents', key: 'agent', render: (agent: any) => agent?.name || 'N/A' },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="text"
            icon={<EditOutlined className="text-slate-400 hover:text-primary" />} 
            onClick={() => navigate(`/admin/properties/edit/${record.id}`)} 
          />
          <Button 
            type="text"
            icon={<DeleteOutlined className="text-slate-400 hover:text-red-500" />} 
            danger 
            onClick={() => handleDelete(record.id)} 
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <span className="text-primary text-sm font-bold uppercase tracking-[0.3em]">Management</span>
          <h1 className="text-5xl font-black text-white uppercase tracking-tight">Properties</h1>
        </div>
        <Button 
          type="primary" 
          size="large"
          icon={<PlusOutlined />} 
          onClick={() => navigate('/admin/properties/new')}
          className="bg-primary hover:bg-primary/90 text-black border-none font-bold uppercase tracking-widest px-8"
        >
          Add Listing
        </Button>
      </div>

      <div className="bg-white p-2 rounded-lg shadow-2xl">
        <Table 
          columns={columns} 
          dataSource={properties} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 8 }}
          className="admin-table"
        />
      </div>
    </div>
  );
};
