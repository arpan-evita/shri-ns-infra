import { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, message, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase';

const { Text } = Typography;

export const AdminFeatures = () => {
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeatures = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('property_features')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      message.error('Failed to fetch features');
    } else {
      setFeatures(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const columns = [
    { 
      title: 'Feature Name', 
      dataIndex: 'name', 
      key: 'name',
      render: (text: string) => (
        <Space>
           <div className="w-8 h-8 bg-slate-100 flex items-center justify-center rounded">
              <SettingOutlined className="text-slate-400" />
           </div>
           <Text className="font-bold text-slate-800 uppercase tracking-wider text-xs">{text}</Text>
        </Space>
      )
    },
    { 
      title: 'Icon Slug', 
      dataIndex: 'icon', 
      key: 'icon',
      render: (icon: string) => <Tag className="font-mono text-[10px]">{icon || 'none'}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: (_: any) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined className="text-slate-400 hover:text-primary" />} />
          <Button type="text" icon={<DeleteOutlined className="text-slate-400 hover:text-red-500" />} danger />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <span className="text-primary text-sm font-bold uppercase tracking-[0.3em]">Configuration</span>
          <h1 className="text-5xl font-black text-white uppercase tracking-tight">Global Features</h1>
        </div>
        <Button 
          type="primary" 
          size="large"
          icon={<PlusOutlined />} 
          className="bg-primary hover:bg-primary/90 text-black border-none font-bold uppercase tracking-widest px-8"
        >
          New Feature
        </Button>
      </div>

      <div className="bg-white p-2 rounded-lg shadow-2xl">
        <Table 
          columns={columns} 
          dataSource={features} 
          rowKey="id" 
          loading={loading}
        />
      </div>
    </div>
  );
};
