import { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, message, Modal, Rate } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

export const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      message.error('Failed to fetch testimonials');
    } else {
      setTestimonials(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this testimonial?',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        const { error } = await supabase.from('testimonials').delete().eq('id', id);
        if (error) {
          message.error('Delete failed');
        } else {
          message.success('Testimonial deleted');
          fetchTestimonials();
        }
      },
    });
  };

  const columns = [
    { 
      title: 'Client Name', 
      dataIndex: 'name', 
      key: 'name',
      render: (text: string) => <Text className="font-bold text-slate-800">{text}</Text>
    },
    { 
      title: 'Location', 
      dataIndex: 'location', 
      key: 'location',
      render: (loc: string) => <Text className="text-slate-500">{loc || 'N/A'}</Text>
    },
    { 
      title: 'Rating', 
      dataIndex: 'rating', 
      key: 'rating',
      render: (rating: number) => <Rate disabled defaultValue={rating} style={{ fontSize: 14 }} />
    },
    { 
      title: 'Content', 
      dataIndex: 'content', 
      key: 'content',
      ellipsis: true,
      width: '40%',
      render: (text: string) => <Text className="text-slate-400 italic">"{text}"</Text>
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
            onClick={() => navigate(`/admin/testimonials/edit/${record.id}`)} 
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
          <span className="text-primary text-sm font-bold uppercase tracking-[0.3em]">Social Proof</span>
          <h1 className="text-5xl font-black text-white uppercase tracking-tight">Testimonials</h1>
        </div>
        <Button 
          type="primary" 
          size="large"
          icon={<PlusOutlined />} 
          onClick={() => navigate('/admin/testimonials/new')}
          className="bg-primary hover:bg-primary/90 text-black border-none font-bold uppercase tracking-widest px-8"
        >
          Add Testimonial
        </Button>
      </div>

      <div className="bg-white p-2 rounded-lg shadow-2xl">
        <Table 
          columns={columns} 
          dataSource={testimonials} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </div>
    </div>
  );
};
