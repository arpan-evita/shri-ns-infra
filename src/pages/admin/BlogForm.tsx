import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
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
  Divider,
  Upload
} from 'antd';
import { 
  ArrowLeftOutlined, 
  SaveOutlined,
  BookOutlined,
  PlusOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { supabase } from '@/lib/supabase';
import { useAdmin } from '@/components/admin/AdminLayout';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { collapsed } = useAdmin();
  const quillRef = useRef<any>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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
          setImageUrl(blog.image_url);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [id, form]);

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    setUploadLoading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `featured/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      form.setFieldsValue({ image_url: publicUrl });
      onSuccess(publicUrl);
      message.success('Image uploaded successfully');
    } catch (error: any) {
      onError(error);
      const isBucketError = error.message?.includes('Bucket not found');
      message.error(isBucketError 
        ? 'Error: "blog-images" bucket not found in Supabase. Please create it in your Storage dashboard.' 
        : 'Upload failed: ' + error.message
      );
    } finally {
      setUploadLoading(false);
    }
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const loadingMsg = message.loading('Uploading image...', 0);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `content/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('blog-images')
          .getPublicUrl(filePath);

        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', publicUrl);
      } catch (error: any) {
        const isBucketError = error.message?.includes('Bucket not found');
        message.error(isBucketError 
          ? 'Error: "blog-images" bucket not found in Supabase. Please create it in your Storage dashboard.' 
          : 'Image upload failed: ' + error.message
        );
      } finally {
        loadingMsg();
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);

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

  const uploadButton = (
    <div>
      {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload Photo</div>
    </div>
  );

  return (
    <div className={`space-y-12 mx-auto transition-all duration-300 ${collapsed ? 'max-w-7xl' : 'max-w-5xl'}`}>
      <style>{`
        .ql-container {
          min-height: 400px;
          font-size: 16px;
        }
        .ql-editor img {
          max-width: 100%;
          height: auto;
          margin: 10px 0;
          border-radius: 8px;
        }
        .blog-editor .ant-form-item-label label {
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 12px;
        }
      `}</style>

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
        className="blog-editor"
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

                <Form.Item 
                  name="content" 
                  label="Article Body" 
                  rules={[{ required: true }]}
                  className="富文本"
                >
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    modules={modules}
                    placeholder="Write your article here..."
                  />
                </Form.Item>
              </Space>
            </Card>
          </Col>

          <Col span={24} lg={8}>
            <Card className="bg-white border-none shadow-2xl rounded-xl p-4 mb-8">
              <Title level={4}>Settings</Title>

              <Form.Item label="Featured Image">
                <Upload
                  name="image"
                  listType="picture-card"
                  className="image-uploader"
                  showUploadList={false}
                  customRequest={handleUpload}
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt="featured" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                  ) : (
                    uploadButton
                  )}
                </Upload>
                <Form.Item name="image_url" noStyle>
                  <Input type="hidden" />
                </Form.Item>
              </Form.Item>

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
                  Use the **Bold** and **Header** options to structure your story. Add images directly into the text to illustrate your points and engage readers.
                </p>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
