import { useEffect, useState } from 'react';
import { Table, Space, Typography, message, Tag, Switch, Button, Modal, Input } from 'antd';
import { UserOutlined, CheckCircleOutlined, ClockCircleOutlined, UserAddOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase';

const { Text } = Typography;
const { confirm } = Modal;

// Super Admins who cannot be modified or deleted
const SUPER_ADMINS = ['arpansadhu13@gmail.com', 'shrinsinframarketing@gmail.com'];

export const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [addingAdmin, setAddingAdmin] = useState(false);

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

  const toggleApproval = async (id: string, currentStatus: boolean, email: string) => {
    if (SUPER_ADMINS.includes(email)) {
      message.error("Super Admin access cannot be restricted.");
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ is_approved: !currentStatus })
      .eq('id', id)
      .select();

    if (error) {
      message.error(`Failed to update status: ${error.message}`);
    } else if (!data || data.length === 0) {
      message.warning('Update blocked by RLS permissions.');
    } else {
      message.success(`Access ${!currentStatus ? 'granted' : 'revoked'} successfully`);
      fetchUsers();
    }
  };

  const handleRemoveAdmin = (id: string, email: string) => {
    if (SUPER_ADMINS.includes(email)) {
      message.error("Super Admin accounts cannot be removed.");
      return;
    }

    confirm({
      title: 'Remove Admin Access?',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to remove ${email}? They will no longer have access to the dashboard.`,
      okText: 'Yes, Remove',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (error) {
          message.error(`Failed to remove: ${error.message}`);
        } else {
          message.success('Admin removed successfully');
          fetchUsers();
        }
      },
    });
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail) return;
    setAddingAdmin(true);
    
    try {
      // 1. Add to Whitelist (admin_invites)
      const { error: inviteError } = await supabase
        .from('admin_invites')
        .upsert({ email: newAdminEmail });

      if (inviteError) throw inviteError;

      // 2. Check if user already exists in profiles
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newAdminEmail)
        .single();

      if (existingUser) {
        // User exists, approve them immediately
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ is_approved: true })
          .eq('email', newAdminEmail);

        if (profileError) throw profileError;
        message.success(`${newAdminEmail} has been granted Admin access!`);
      } else {
        message.success(`${newAdminEmail} has been added to the whitelist. They will be automatically approved when they sign up!`);
      }

      setIsModalOpen(false);
      setNewAdminEmail('');
      fetchUsers();
    } catch (error: any) {
      console.error('Add Admin Error:', error);
      message.error(`Failed to add admin: ${error.message}`);
    } finally {
      setAddingAdmin(false);
    }
  };

  const columns = [
    { 
      title: 'Email', 
      dataIndex: 'email', 
      key: 'email',
      render: (text: string) => (
        <Space>
          <UserOutlined className={SUPER_ADMINS.includes(text) ? "text-gold" : "text-primary"} />
          <Text className={`font-medium ${SUPER_ADMINS.includes(text) ? "text-slate-900" : "text-slate-800"}`}>
            {text} {SUPER_ADMINS.includes(text) && <Tag color="gold" className="ml-2 text-[8px] font-black">SUPER ADMIN</Tag>}
          </Text>
        </Space>
      )
    },
    { 
      title: 'Status', 
      dataIndex: 'is_approved', 
      key: 'status',
      render: (approved: boolean, record: any) => (
        SUPER_ADMINS.includes(record.email) ? (
          <Tag color="gold" icon={<CheckCircleOutlined />}>PERMANENT</Tag>
        ) : approved ? (
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
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="middle">
          {!SUPER_ADMINS.includes(record.email) && (
            <>
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-black text-slate-400 uppercase mb-1">Access</span>
                <Switch 
                  checked={record.is_approved} 
                  onChange={() => toggleApproval(record.id, record.is_approved, record.email)}
                  checkedChildren="YES"
                  unCheckedChildren="NO"
                />
              </div>
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => handleRemoveAdmin(record.id, record.email)}
              />
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <span className="text-primary text-sm font-bold uppercase tracking-[0.3em]">Security</span>
          <h1 className="text-5xl font-black text-white uppercase tracking-tight">Admin Control</h1>
        </div>
        <Button 
          type="primary" 
          size="large"
          icon={<UserAddOutlined />} 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-black border-none font-bold uppercase tracking-widest px-8"
        >
          Add New Admin
        </Button>
      </div>

      <div className="bg-white p-2 rounded-lg shadow-2xl overflow-x-auto">
        <Table 
          columns={columns} 
          dataSource={users} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 15 }}
        />
      </div>

      <Modal
        title={<span className="font-black uppercase tracking-widest text-[#1a1a1a]">Grant Admin Access</span>}
        open={isModalOpen}
        onOk={handleAddAdmin}
        confirmLoading={addingAdmin}
        onCancel={() => setIsModalOpen(false)}
        okText="Grant Access"
        okButtonProps={{ className: 'bg-primary border-none text-black font-bold uppercase tracking-widest' }}
        cancelButtonProps={{ className: 'font-bold uppercase tracking-widest' }}
      >
        <div className="py-6 space-y-4 text-left">
          <p className="text-slate-500 text-sm">Enter the email of an existing user to grant them administrative privileges. They must have already registered an account first.</p>
          <Input 
            size="large" 
            placeholder="admin@shrinsinfra.com" 
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            className="rounded-lg"
          />
        </div>
      </Modal>
    </div>
  );
};
