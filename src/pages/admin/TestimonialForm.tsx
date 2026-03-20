import { useEffect, useState } from 'react';
import { Form, Input, Button, Rate, message, Card, Breadcrumb } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase';
import { useNavigate, useParams, Link } from 'react-router-dom';

const { TextArea } = Input;

export const TestimonialForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      fetchTestimonial();
    }
  }, [id]);

  const fetchTestimonial = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      message.error('Failed to fetch testimonial');
      navigate('/admin/testimonials');
    } else if (data) {
      form.setFieldsValue(data);
    }
    setFetching(false);
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('testimonials')
          .update(values)
          .eq('id', id);
        if (error) throw error;
        message.success('Testimonial updated successfully');
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert([values]);
        if (error) throw error;
        message.success('Testimonial added successfully');
      }
      navigate('/admin/testimonials');
    } catch (error: any) {
      message.error(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-white">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <Breadcrumb 
          items={[
            { title: <Link to="/admin" className="text-slate-400">Dashboard</Link> },
            { title: <Link to="/admin/testimonials" className="text-slate-400">Testimonials</Link> },
            { title: <span className="text-primary">{isEditing ? 'Edit' : 'New'} Testimonial</span> },
          ]}
        />
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-black text-white uppercase tracking-tight">
            {isEditing ? 'Edit' : 'Add'} Testimonial
          </h1>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/admin/testimonials')}
            className="bg-white/5 text-white border-white/10 hover:border-primary hover:text-primary"
          >
            Back
          </Button>
        </div>
      </div>

      <Card className="shadow-2xl border-none overflow-hidden">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ rating: 5 }}
          className="max-w-2xl"
        >
          <Form.Item
            name="name"
            label={<span className="font-bold text-slate-700 uppercase tracking-wider text-xs">Client Name</span>}
            rules={[{ required: true, message: 'Please enter client name' }]}
          >
            <Input size="large" placeholder="E.g. Rohit Malhotra" />
          </Form.Item>

          <Form.Item
            name="location"
            label={<span className="font-bold text-slate-700 uppercase tracking-wider text-xs">Location</span>}
            rules={[{ required: true, message: 'Please enter location' }]}
          >
            <Input size="large" placeholder="E.g. Delhi" />
          </Form.Item>

          <Form.Item
            name="rating"
            label={<span className="font-bold text-slate-700 uppercase tracking-wider text-xs">Rating</span>}
            rules={[{ required: true }]}
          >
            <Rate />
          </Form.Item>

          <Form.Item
            name="content"
            label={<span className="font-bold text-slate-700 uppercase tracking-wider text-xs">Testimonial Content</span>}
            rules={[{ required: true, message: 'Please enter testimonial text' }]}
          >
            <TextArea 
              rows={6} 
              placeholder="Enter the client's feedback here..." 
              className="resize-none"
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-8">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<SaveOutlined />}
              size="large"
              className="bg-primary hover:bg-primary/90 text-black border-none font-bold uppercase tracking-widest px-12 h-14"
            >
              {isEditing ? 'Update Testimonial' : 'Save Testimonial'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
