import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Typography, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

export const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      message.error('Failed to fetch blogs');
    } else {
      setBlogs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this article?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        const { error } = await supabase.from('blogs').delete().eq('id', id);
        if (error) {
          message.error('Delete failed');
        } else {
          message.success('Article deleted');
          fetchBlogs();
        }
      },
    });
  };

  const columns = [
    { 
      title: 'Title', 
      dataIndex: 'title', 
      key: 'title',
      render: (text: string) => <Text className="font-bold text-slate-800">{text}</Text>
    },
    { 
      title: 'Category', 
      dataIndex: 'category', 
      key: 'category',
      render: (cat: string) => <Tag color="blue">{cat || 'Uncategorized'}</Tag>
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'published' ? 'green' : 'orange'} className="uppercase font-bold">
          {status}
        </Tag>
      )
    },
    { 
      title: 'Published Date', 
      dataIndex: 'published_at', 
      key: 'published_at',
      render: (date: string) => <Text className="text-slate-400 text-xs">{new Date(date).toLocaleDateString()}</Text>
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="text"
            icon={<EditOutlined className="text-slate-400 hover:text-primary" />} 
            onClick={() => navigate(`/admin/blogs/edit/${record.id}`)} 
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
          <span className="text-primary text-sm font-bold uppercase tracking-[0.3em]">Content</span>
          <h1 className="text-5xl font-black text-white uppercase tracking-tight">Blog Posts</h1>
        </div>
        <Button 
          type="primary" 
          size="large"
          icon={<PlusOutlined />} 
          onClick={() => navigate('/admin/blogs/new')}
          className="bg-primary hover:bg-primary/90 text-black border-none font-bold uppercase tracking-widest px-8"
        >
          Write Article
        </Button>
      </div>

      <div className="bg-white p-2 rounded-lg shadow-2xl">
        <Table 
          columns={columns} 
          dataSource={blogs} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </div>
    </div>
  );
};
