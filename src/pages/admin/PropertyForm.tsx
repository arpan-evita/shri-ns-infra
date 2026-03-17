import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Switch, 
  Button, 
  Upload, 
  message, 
  Card, 
  Row, 
  Col, 
  Typography,
  Space,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  ArrowLeftOutlined, 
  SaveOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { supabase } from '@/lib/supabase';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export const PropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Agents
      const { data: agentsData } = await supabase.from('agents').select('id, name');
      setAgents(agentsData || []);

      if (id) {
        setLoading(true);
        const { data: property, error } = await supabase
          .from('properties')
          .select('*, property_images(*)')
          .eq('id', id)
          .single();

        if (error) {
          message.error('Failed to load property');
        } else {
          form.setFieldsValue(property);
          // Set images
          const images = property.property_images?.map((img: any) => ({
            uid: img.id,
            name: 'image.png',
            status: 'done',
            url: img.image_url,
          })) || [];
          setFileList(images);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [id, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    const slug = values.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    const propertyData = {
      ...values,
      slug,
    };

    let propertyId = id;

    if (id) {
      const { error } = await supabase.from('properties').update(propertyData).eq('id', id);
      if (error) {
        message.error('Update failed: ' + error.message);
        setLoading(false);
        return;
      }
    } else {
      const { data, error } = await supabase.from('properties').insert([propertyData]).select().single();
      if (error) {
        message.error('Creation failed: ' + error.message);
        setLoading(false);
        return;
      }
      propertyId = data.id;
    }

    // Handle Images (Note: Direct image upload to Supabase Storage would go here)
    // For now, we assume URLs are provided or handled via placeholders
    
    message.success(`Property ${id ? 'updated' : 'created'} successfully`);
    navigate('/admin/properties');
    setLoading(false);
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-6">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/admin/properties')}
          className="bg-white/5 border-white/10 text-white hover:text-primary hover:border-primary"
        />
        <div className="space-y-2">
          <span className="text-primary text-sm font-bold uppercase tracking-[0.3em]">{id ? 'Edit' : 'New'} Listing</span>
          <h1 className="text-5xl font-black text-white uppercase tracking-tight">Property Details</h1>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ is_featured: false, status: 'buy' }}
        className="property-form"
      >
        <Row gutter={24}>
          <Col span={24} lg={16}>
            <Card className="bg-white border-none shadow-2xl rounded-xl p-4">
              <Space direction="vertical" size="large" className="w-full">
                <Title level={4}>Basic Information</Title>
                <Form.Item name="title" label="Listing Title" rules={[{ required: true }]}>
                  <Input size="large" placeholder="E.g. Luxury 4BHK Apartment" className="rounded-lg py-3" />
                </Form.Item>

                <Form.Item name="description" label="Description">
                  <TextArea rows={12} placeholder="Detailed property description..." className="rounded-lg" />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="property_type" label="Property Type">
                      <Select size="large" className="rounded-lg">
                        <Option value="Apartment">Apartment</Option>
                        <Option value="Villa">Villa</Option>
                        <Option value="Penthouse">Penthouse</Option>
                        <Option value="Plots">Plots</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="status" label="Status">
                      <Select size="large" className="rounded-lg">
                        <Option value="buy">For Sale</Option>
                        <Option value="rent">For Rent</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Space>
            </Card>

            <Divider className="border-white/5" />

            <Card className="bg-white border-none shadow-2xl rounded-xl p-4 mt-8">
              <Title level={4}>Location Details</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="city" label="City">
                    <Input size="large" placeholder="E.g. Noida" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="location" label="Area/Sector">
                    <Input size="large" placeholder="E.g. Sector 12" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="latitude" label="Latitude">
                    <InputNumber className="w-full" size="large" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="longitude" label="Longitude">
                    <InputNumber className="w-full" size="large" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={24} lg={8}>
            <Card className="bg-white border-none shadow-2xl rounded-xl p-4 mb-8">
              <Title level={4}>Pricing & Specs</Title>
              <Form.Item name="price" label="Price (₹)">
                <InputNumber 
                  className="w-full" 
                  size="large" 
                  formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\₹\s?|(,*)/g, '')}
                />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="bedrooms" label="Bedrooms">
                    <InputNumber className="w-full" size="large" min={0} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="bathrooms" label="Bathrooms">
                    <InputNumber className="w-full" size="large" min={0} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="area" label="Area (Sq.Ft)">
                <InputNumber className="w-full" size="large" />
              </Form.Item>
              <Form.Item name="is_featured" label="Promote as Featured" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Card>

            <Card className="bg-white border-none shadow-2xl rounded-xl p-4">
              <Title level={4}>Agent Assignment</Title>
              <Form.Item name="agent_id" label="Assign to Agent">
                <Select size="large" placeholder="Select an agent">
                  {agents.map(agent => (
                    <Option key={agent.id} value={agent.id}>{agent.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                block 
                loading={loading}
                icon={<SaveOutlined />}
                className="bg-primary hover:bg-primary/90 text-black border-none font-bold uppercase tracking-widest mt-4 h-14"
              >
                {id ? 'Update Listing' : 'Publish Listing'}
              </Button>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
