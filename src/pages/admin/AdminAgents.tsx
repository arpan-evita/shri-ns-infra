import { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, message, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase';

const { Text } = Typography;

export const AdminAgents = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      message.error('Failed to fetch agents');
    } else {
      setAgents(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const columns = [
    { 
      title: 'Agent', 
      dataIndex: 'name', 
      key: 'name',
      render: (text: string, record: any) => (
        <Space size="middle">
          <Avatar src={record.photo} size="large" className="bg-primary/20 text-primary font-bold">
            {text[0]}
          </Avatar>
          <Text className="font-bold text-slate-800">{text}</Text>
        </Space>
      )
    },
    { 
      title: 'Contact Information', 
      key: 'contact',
      render: (_: any, record: any) => (
        <Space direction="vertical" size={0}>
          <div className="text-slate-600 text-xs flex items-center gap-2"><MailOutlined /> {record.email}</div>
          <div className="text-slate-600 text-xs flex items-center gap-2"><PhoneOutlined /> {record.phone}</div>
        </Space>
      )
    },
    { 
      title: 'Joined Date', 
      dataIndex: 'created_at', 
      key: 'created_at',
      render: (date: string) => <Text className="text-slate-400 text-xs">{new Date(date).toLocaleDateString()}</Text>
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
          <span className="text-primary text-sm font-bold uppercase tracking-[0.3em]">Management</span>
          <h1 className="text-5xl font-black text-white uppercase tracking-tight">Team Agents</h1>
        </div>
        <Button 
          type="primary" 
          size="large"
          icon={<PlusOutlined />} 
          className="bg-primary hover:bg-primary/90 text-black border-none font-bold uppercase tracking-widest px-8"
        >
          Add Agent
        </Button>
      </div>

      <div className="bg-white p-2 rounded-lg shadow-2xl">
        <Table 
          columns={columns} 
          dataSource={agents} 
          rowKey="id" 
          loading={loading}
        />
      </div>
    </div>
  );
};
