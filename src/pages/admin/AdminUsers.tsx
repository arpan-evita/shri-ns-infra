import { useEffect, useState } from 'react';
import { Table, Space, Typography, message, Tag, Switch } from 'antd';
import { UserOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase';

const { Text } = Typography;

export const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      message.error('Failed to fetch users');
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_approved: !currentStatus })
      .eq('id', id);

    if (error) {
      message.error('Failed to update status');
    } else {
      message.success(`User ${!currentStatus ? 'approved' : 'restricted'} successfully`);
      fetchUsers();
    }
  };

  const columns = [
    { 
      title: 'Email', 
      dataIndex: 'email', 
      key: 'email',
      render: (text: string) => (
        <Space>
          <UserOutlined className="text-primary" />
          <Text className="font-medium text-slate-800">{text}</Text>
        </Space>
      )
    },
    { 
      title: 'Status', 
      dataIndex: 'is_approved', 
      key: 'status',
      render: (approved: boolean) => (
        approved ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>APPROVED</Tag>
        ) : (
          <Tag color="warning" icon={<ClockCircleOutlined />}>PENDING</Tag>
        )
      )
    },
    { 
      title: 'Registered On', 
      dataIndex: 'created_at', 
      key: 'created_at',
      render: (date: string) => <Text className="text-slate-400 text-xs">{new Date(date).toLocaleDateString()}</Text>
    },
    {
      title: 'Grant Access',
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: any) => (
        <Switch 
          checked={record.is_approved} 
          onChange={() => toggleApproval(record.id, record.is_approved)}
          checkedChildren="YES"
          unCheckedChildren="NO"
        />
      ),
    },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <span className="text-primary text-sm font-bold uppercase tracking-[0.3em]">Security</span>
          <h1 className="text-5xl font-black text-white uppercase tracking-tight">Admin Approval</h1>
        </div>
      </div>

      <div className="bg-white p-2 rounded-lg shadow-2xl">
        <Table 
          columns={columns} 
          dataSource={users} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};
