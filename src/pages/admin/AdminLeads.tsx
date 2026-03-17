import { Table, Tag, Typography, message, Space, Button } from 'antd';
import { useEffect, useState } from 'react';
import { DeleteOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase';

const { Text } = Typography;

export const AdminLeads = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('property_leads')
      .select('*, properties(title)')
      .order('created_at', { ascending: false });

    if (error) {
      message.error('Failed to fetch leads');
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const columns = [
    { 
      title: 'Date', 
      dataIndex: 'created_at', 
      key: 'created_at',
      render: (date: string) => <Text className="text-slate-500">{new Date(date).toLocaleDateString()}</Text>
    },
    { 
      title: 'Inquirer', 
      dataIndex: 'name', 
      key: 'name',
      render: (text: string, record: any) => (
        <Space direction="vertical" size={0}>
          <Text className="font-bold text-slate-800">{text}</Text>
          <div className="flex gap-4 text-xs text-slate-400">
            <span><MailOutlined className="mr-1" /> {record.email}</span>
            <span><PhoneOutlined className="mr-1" /> {record.phone}</span>
          </div>
        </Space>
      )
    },
    { 
      title: 'Property', 
      dataIndex: 'properties', 
      key: 'property', 
      render: (prop: any) => prop?.title || <Tag color="default">General Inquiry</Tag>
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'New' ? 'gold' : 'blue'} className="font-bold uppercase tracking-widest text-[10px]">
          {status}
        </Tag>
      )
    },
    { 
      title: 'Source', 
      dataIndex: 'source', 
      key: 'source',
      render: (source: string) => <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter">{source || 'Direct'}</Text>
    },
    { 
      title: 'Message', 
      dataIndex: 'message', 
      key: 'message',
      ellipsis: true,
      render: (msg: string) => <Text className="text-slate-500 italic truncate block max-w-[200px]">"{msg}"</Text>
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={async () => {
              const { error } = await supabase.from('property_leads').delete().eq('id', record.id);
              if (error) message.error('Failed to delete lead');
              else {
                message.success('Lead removed');
                fetchLeads();
              }
            }} 
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <span className="text-primary text-sm font-bold uppercase tracking-[0.3em]">Communication</span>
        <h1 className="text-5xl font-black text-white uppercase tracking-tight">Leads & Enquiries</h1>
      </div>

      <div className="bg-white p-2 rounded-lg shadow-2xl">
        <Table 
          columns={columns} 
          dataSource={leads} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};
