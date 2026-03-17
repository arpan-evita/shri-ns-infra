import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Select, 
  Button, 
  message, 
  Card, 
  Row, 
  Col, 
  Typography,
  Space,
  Divider
} from 'antd';
import { 
  ArrowLeftOutlined, 
  SaveOutlined,
  BookOutlined
} from '@ant-design/icons';
import { supabase } from '@/lib/supabase';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        const { data: blog, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          message.error('Failed to load blog post');
        } else {
          form.setFieldsValue(blog);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [id, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    const slug = values.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    const blogData = {
      ...values,
      slug,
      published_at: values.status === 'published' ? new Date().toISOString() : null
    };

    if (id) {
      const { error } = await supabase.from('blogs').update(blogData).eq('id', id);
      if (error) {
        message.error('Update failed: ' + error.message);
        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase.from('blogs').insert([blogData]);
      if (error) {
        message.error('Creation failed: ' + error.message);
        setLoading(false);
        return;
      }
    }
    
    message.success(`Article ${id ? 'updated' : 'published'} successfully`);
    navigate('/admin/blogs');
    setLoading(false);
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-6">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/admin/blogs')}
          className="bg-white/5 border-white/10 text-white hover:text-primary hover:border-primary"
        />
        <div className="space-y-2">
          <span className="text-primary text-sm font-bold uppercase tracking-[0.3em]">{id ? 'Edit' : 'New'} Article</span>
          <h1 className="text-5xl font-black text-white uppercase tracking-tight">Blog Editor</h1>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: 'draft', category: 'Real Estate' }}
        className="property-form"
      >
        <Row gutter={24}>
          <Col span={24} lg={16}>
            <Card className="bg-white border-none shadow-2xl rounded-xl p-4">
              <Space direction="vertical" size="large" className="w-full">
                <Title level={4}>Content</Title>
                <Form.Item name="title" label="Article Title" rules={[{ required: true }]}>
                  <Input size="large" placeholder="E.g. The Future of Real Estate in Noida" className="rounded-lg py-3" />
                </Form.Item>

                <Form.Item name="excerpt" label="Short Excerpt" rules={[{ required: true }]}>
                  <TextArea rows={3} placeholder="A short summary of the article..." className="rounded-lg" />
                </Form.Item>

                <Form.Item name="content" label="Full Content (Markdown supported)" rules={[{ required: true }]}>
                  <TextArea rows={20} placeholder="Write your article here..." className="rounded-lg font-mono text-sm" />
                </Form.Item>
              </Space>
            </Card>
          </Col>

          <Col span={24} lg={8}>
            <Card className="bg-white border-none shadow-2xl rounded-xl p-4 mb-8">
              <Title level={4}>Settings</Title>
              <Form.Item name="category" label="Category">
                <Select size="large" className="rounded-lg">
                  <Option value="Real Estate">Real Estate</Option>
                  <Option value="Investment">Investment</Option>
                  <Option value="Lifestyle">Lifestyle</Option>
                  <Option value="Infrastructure">Infrastructure</Option>
                </Select>
              </Form.Item>
              
              <Form.Item name="status" label="Publishing Status">
                <Select size="large" className="rounded-lg">
                  <Option value="draft">Draft</Option>
                  <Option value="published">Published</Option>
                </Select>
              </Form.Item>

              <Form.Item name="image_url" label="Featured Image URL">
                <Input size="large" placeholder="https://..." />
              </Form.Item>

              <Form.Item name="author" label="Author Name">
                <Input size="large" placeholder="Admin" />
              </Form.Item>

              <Divider />
              
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                block 
                loading={loading}
                icon={<SaveOutlined />}
                className="bg-primary hover:bg-primary/90 text-black border-none font-bold uppercase tracking-widest h-14"
              >
                {id ? 'Update Post' : 'Publish Article'}
              </Button>
            </Card>

            <div className="p-6 bg-[#1a170f] rounded-xl border border-white/5">
                <h4 className="text-primary font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                    <BookOutlined style={{fontSize: 14}} /> Writing Tip
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed italic">
                    Focus on keywords like "Infrastructure", "Noida", and "Luxury" to improve SEO. Use simple language that resonates with property buyers.
                </p>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
