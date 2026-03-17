import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Switch, 
  Button, 
  message, 
  Card, 
  Row, 
  Col, 
  Typography,
  Space,
  Tabs,
  DatePicker,
  Upload,
  Checkbox,
  Divider,
  ConfigProvider,
  theme
} from 'antd';
import { 
  ArrowLeftOutlined, 
  SaveOutlined,
  PlusOutlined,
  LoadingOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  UnorderedListOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  LayoutOutlined,
  CarOutlined
} from '@ant-design/icons';
import { supabase } from '@/lib/supabase';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

export const PropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [brochureUrl, setBrochureUrl] = useState<string | null>(null);
  const [floorPlans, setFloorPlans] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [amenities, setAmenities] = useState<any[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('1');

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Agents
      const { data: agentsData } = await supabase.from('agents').select('id, name');
      setAgents(agentsData || []);

      // Fetch Amenities
      const { data: amenitiesData } = await supabase.from('amenities').select('*');
      setAmenities(amenitiesData || []);

      if (id) {
        setLoading(true);
        const { data: property, error } = await supabase
          .from('properties')
          .select(`
            *,
            property_images(*),
            property_floor_plans(*),
            property_amenity_relation(amenity_id),
            nearby_places(*)
          `)
          .eq('id', id)
          .single();

        if (error) {
          message.error('Failed to load property');
        } else {
          // Convert date for dayjs
          if (property.possession_date) {
            property.possession_date = dayjs(property.possession_date);
          }
          
          form.setFieldsValue(property);
          
          // Set featured image
          const featured = property.property_images?.find((img: any) => img.is_featured);
          if (featured) setImageUrl(featured.image_url);

          // Set brochure
          if (property.brochure_url) setBrochureUrl(property.brochure_url);

          // Set Floor Plans
          setFloorPlans(property.property_floor_plans || []);

          // Set Selected Amenities
          setSelectedAmenities(property.property_amenity_relation?.map((ar: any) => ar.amenity_id) || []);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [id, form]);

  const handleFileUpload = async (options: any, bucket: string, setter?: (url: string) => void) => {
    const { file, onSuccess, onError } = options;
    setUploadLoading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `listings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (setter) setter(publicUrl);
      onSuccess(publicUrl);
      message.success(`${file.name} uploaded successfully`);
      return publicUrl;
    } catch (error: any) {
      onError(error);
      message.error('Upload failed: ' + error.message);
    } finally {
      setUploadLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    const slug = values.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    // Format date for DB
    if (values.possession_date) {
      values.possession_date = values.possession_date.format('YYYY-MM-DD');
    }

    const { 
      property_images, 
      property_floor_plans, 
      property_amenity_relation, 
      nearby_places,
      ...propertyData 
    } = values;

    const finalPropertyData = {
      ...propertyData,
      slug,
      brochure_url: brochureUrl
    };

    let propertyId = id;

    if (id) {
      const { error } = await supabase.from('properties').update(finalPropertyData).eq('id', id);
      if (error) {
        message.error('Update failed: ' + error.message);
        setLoading(false);
        return;
      }
    } else {
      const { data, error } = await supabase.from('properties').insert([finalPropertyData]).select().single();
      if (error) {
        message.error('Creation failed: ' + error.message);
        setLoading(false);
        return;
      }
      propertyId = data.id;
    }

    // 1. Handle Main Featured Image
    if (imageUrl) {
      await supabase.from('property_images').upsert({
        property_id: propertyId,
        image_url: imageUrl,
        is_featured: true
      });
    }

    // 2. Handle Floor Plans
    if (floorPlans.length > 0) {
      // Clear old plans if editing
      if (id) await supabase.from('property_floor_plans').delete().eq('property_id', id);
      const floorPlanData = floorPlans.map(plan => ({
        property_id: propertyId,
        title: plan.title,
        image_url: plan.image_url
      }));
      await supabase.from('property_floor_plans').insert(floorPlanData);
    }

    // 3. Handle Amenities
    if (selectedAmenities.length > 0) {
      if (id) await supabase.from('property_amenity_relation').delete().eq('property_id', id);
      const amenityData = selectedAmenities.map(amenityId => ({
        property_id: propertyId,
        amenity_id: amenityId
      }));
      await supabase.from('property_amenity_relation').insert(amenityData);
    }

    // 4. Handle Nearby Places
    if (values.nearby_places) {
      if (id) await supabase.from('nearby_places').delete().eq('property_id', id);
      const landmarkData = values.nearby_places.map((landmark: any) => ({
        ...landmark,
        property_id: propertyId
      }));
      await supabase.from('nearby_places').insert(landmarkData);
    }
    
    message.success(`Property ${id ? 'updated' : 'created'} successfully`);
    navigate('/admin/properties');
    setLoading(false);
  };

  const uploadButton = (
    <div>
      {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const items = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-2">
          <InfoCircleOutlined /> Basic Info
        </span>
      ),
      children: (
        <Space direction="vertical" size="large" className="w-full">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Form.Item name="title" label="Listing Title" rules={[{ required: true }]}>
                <Input size="large" placeholder="E.g. Luxury 4BHK Apartment in Noida" className="rounded-lg" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={8}>
              <Form.Item name="project_name" label="Project / Society Name">
                <Input size="large" placeholder="E.g. Godrej Woods" className="rounded-lg" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Form.Item name="property_type" label="Property Type" rules={[{ required: true }]}>
                <Select size="large" className="rounded-lg">
                  <Option value="Apartment">Apartment</Option>
                  <Option value="Villa">Villa</Option>
                  <Option value="Penthouse">Penthouse</Option>
                  <Option value="Plots">Plots</Option>
                  <Option value="Commercial">Commercial</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="status" label="Purpose" rules={[{ required: true }]}>
                <Select size="large" className="rounded-lg">
                  <Option value="buy">For Sale</Option>
                  <Option value="rent">For Rent</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="agent_id" label="Assigned Agent">
                <Select size="large" placeholder="Select Agent" className="rounded-lg">
                  {agents.map(agent => (
                    <Option key={agent.id} value={agent.id}>{agent.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Detailed Description">
            <TextArea rows={6} placeholder="Write a compelling story about the property..." className="rounded-lg" />
          </Form.Item>
        </Space>
      ),
    },
    {
      key: '2',
      label: (
        <span className="flex items-center gap-2">
          <UnorderedListOutlined /> Specifications
        </span>
      ),
      children: (
        <Space direction="vertical" size="large" className="w-full">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Form.Item name="bhk_type" label="BHK Configuration">
                <Select size="large" className="rounded-lg">
                  <Option value="1 BHK">1 BHK</Option>
                  <Option value="2 BHK">2 BHK</Option>
                  <Option value="3 BHK">3 BHK</Option>
                  <Option value="4 BHK">4 BHK</Option>
                  <Option value="4+ BHK">4+ BHK</Option>
                  <Option value="Studio">Studio</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="bedrooms" label="Bedrooms Count">
                <InputNumber min={0} className="w-full" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="bathrooms" label="Bathrooms Count">
                <InputNumber min={0} className="w-full" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Form.Item name="carpet_area" label="Carpet Area (Sq.Ft)">
                <InputNumber className="w-full" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="builtup_area" label="Built-up Area (Sq.Ft)">
                <InputNumber className="w-full" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="super_builtup_area" label="Super Built-up Area (Sq.Ft)">
                <InputNumber className="w-full" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="facing" label="Facing (Vaastu)">
                <Select size="large" className="rounded-lg">
                  <Option value="East">East</Option>
                  <Option value="West">West</Option>
                  <Option value="North">North</Option>
                  <Option value="South">South</Option>
                  <Option value="North-East">North-East</Option>
                  <Option value="North-West">North-West</Option>
                  <Option value="South-East">South-East</Option>
                  <Option value="South-West">South-West</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="furnishing_status" label="Furnishing">
                <Select size="large" className="rounded-lg">
                  <Option value="Unfurnished">Unfurnished</Option>
                  <Option value="Semi-furnished">Semi-furnished</Option>
                  <Option value="Fully Furnished">Fully Furnished</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="floor_no" label="Floor Number">
                <InputNumber className="w-full" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="total_floors" label="Total Floors">
                <InputNumber className="w-full" size="large" />
              </Form.Item>
            </Col>
          </Row>
        </Space>
      ),
    },
    {
      key: '3',
      label: (
        <span className="flex items-center gap-2">
          <EnvironmentOutlined /> Location & Connectivity
        </span>
      ),
      children: (
        <Space direction="vertical" size="large" className="w-full">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Form.Item name="city" label="City" rules={[{ required: true }]}>
                <Input size="large" placeholder="E.g. Noida" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="location" label="Area / Sector" rules={[{ required: true }]}>
                <Input size="large" placeholder="E.g. Sector 150" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Form.Item name="possession_status" label="Possession Status">
                <Select size="large" className="rounded-lg">
                  <Option value="Ready to Move">Ready to Move</Option>
                  <Option value="Under Construction">Under Construction</Option>
                  <Option value="New Launch">New Launch</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="possession_date" label="Possession Date (Expected)">
                <DatePicker size="large" className="w-full rounded-lg" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Nearby Landmarks (Connectivity)</Divider>
          <Form.List name="nearby_places">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={[16, 16]} align="bottom" className="mb-6 bg-white/5 p-6 rounded-2xl relative border border-white/5">
                    <Col xs={24} md={6}>
                      <Form.Item {...restField} name={[name, 'type']} label="Type" rules={[{ required: true }]}>
                        <Select placeholder="Select type" className="w-full">
                          <Option value="Metro">Metro</Option>
                          <Option value="School">School</Option>
                          <Option value="Hospital">Hospital</Option>
                          <Option value="Mall">Mall</Option>
                          <Option value="Airport">Airport</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={10}>
                      <Form.Item {...restField} name={[name, 'name']} label="Landmark Name" rules={[{ required: true }]}>
                        <Input placeholder="E.g. Noida Sector 18 Metro" />
                      </Form.Item>
                    </Col>
                    <Col xs={18} md={6}>
                      <Form.Item {...restField} name={[name, 'distance']} label="Distance (KM)" rules={[{ required: true }]}>
                        <InputNumber className="w-full" step={0.1} />
                      </Form.Item>
                    </Col>
                    <Col xs={6} md={2}>
                      <Button 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => remove(name)} 
                        className="h-14 w-full flex items-center justify-center rounded-xl bg-red-500/10 border-none hover:bg-red-500 hover:text-white transition-all mb-[0px]"
                      />
                    </Col>
                  </Row>
                ))}
                <Button 
                  type="dashed" 
                  onClick={() => add()} 
                  block 
                  icon={<PlusOutlined />} 
                  className="h-16 border-white/10 text-slate-400 hover:text-primary hover:border-primary bg-white/5 rounded-2xl"
                >
                  Add Nearby Landmark
                </Button>
              </>
            )}
          </Form.List>
        </Space>
      ),
    },
    {
      key: '4',
      label: (
        <span className="flex items-center gap-2">
          <CarOutlined /> Amenities & Features
        </span>
      ),
      children: (
        <Card className="bg-[#1a1a1a] border-white/10">
          <Title level={5} className="text-white mb-6 uppercase tracking-widest text-xs">Select Available Amenities</Title>
          <Checkbox.Group 
            value={selectedAmenities}
            onChange={(checkedValues) => setSelectedAmenities(checkedValues as string[])}
            className="w-full"
          >
            <Row gutter={[16, 24]}>
              {amenities.map(amenity => (
                <Col xs={12} sm={8} md={6} lg={4} key={amenity.id}>
                  <Checkbox value={amenity.id} className="text-slate-300 font-bold uppercase tracking-tighter text-[11px]">
                    {amenity.name}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Card>
      ),
    },
    {
      key: '5',
      label: (
        <span className="flex items-center gap-2">
          <LayoutOutlined /> Files & Floor Plans
        </span>
      ),
      children: (
        <Space direction="vertical" size="large" className="w-full">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
               <Card className="bg-[#1a1a1a] border-white/10 h-full">
                  <Title level={5} className="text-white mb-2">Property Brochure (PDF)</Title>
                  <Text className="text-slate-500 text-xs block mb-4">Upload the detailed project brochure.</Text>
                  <Upload
                    name="brochure"
                    showUploadList={false}
                    customRequest={(opt) => handleFileUpload(opt, 'properties', setBrochureUrl)}
                  >
                    <Button 
                      icon={brochureUrl ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <FilePdfOutlined />}
                      className="bg-white/5 border-white/10 text-white h-12 px-6 rounded-lg uppercase font-bold text-xs tracking-widest w-full"
                    >
                      {brochureUrl ? 'Brochure Uploaded' : 'Select PDF Brochure'}
                    </Button>
                  </Upload>
                  {brochureUrl && (
                    <div className="mt-4 flex items-center gap-2 text-primary text-[10px] uppercase font-black">
                       <PlusOutlined /> File Ready for Publishing
                    </div>
                  )}
               </Card>
            </Col>
            <Col xs={24} lg={12}>
               <Card className="bg-[#1a1a1a] border-white/10 h-full">
                  <Title level={5} className="text-white mb-2">Featured Image</Title>
                  <Upload
                    name="image"
                    listType="picture-card"
                    showUploadList={false}
                    customRequest={(opt) => handleFileUpload(opt, 'properties', setImageUrl)}
                    className="w-full aspect-video featured-upload"
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt="property" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
               </Card>
            </Col>
          </Row>

          <Divider orientation="left" className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Property Floor Plans</Divider>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {floorPlans.map((plan, idx) => (
                <Card key={idx} className="bg-[#111] border-white/10 relative overflow-hidden group" bodyStyle={{ padding: 12 }}>
                   <img src={plan.image_url} className="w-full h-32 object-cover rounded-md mb-3" />
                   <Input 
                      value={plan.title} 
                      onChange={(e) => {
                        const newPlans = [...floorPlans];
                        newPlans[idx].title = e.target.value;
                        setFloorPlans(newPlans);
                      }}
                      placeholder="e.g., 2BHK Layout"
                      className="bg-white/5 border-none text-white text-xs"
                   />
                   <Button 
                      icon={<DeleteOutlined />} 
                      danger 
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setFloorPlans(prev => prev.filter((_, i) => i !== idx))}
                   />
                </Card>
             ))}
             <Upload
               showUploadList={false}
               customRequest={async (opt) => {
                  const url = await handleFileUpload(opt, 'properties');
                  if (url) {
                    setFloorPlans(prev => [...prev, { title: 'New Plan', image_url: url }]);
                  }
               }}
             >
               <div className="w-full h-44 bg-white/5 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-primary transition-all cursor-pointer">
                  <PlusOutlined className="text-2xl mb-2" />
                  <span className="uppercase font-bold tracking-widest text-[10px]">Add Floor Plan</span>
               </div>
             </Upload>
          </div>
        </Space>
      ),
    },
    {
      key: '6',
      label: (
        <span className="flex items-center gap-2">
          <SafetyCertificateOutlined /> Legal & Financial
        </span>
      ),
      children: (
        <Space direction="vertical" size="large" className="w-full">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Form.Item name="price" label="Total Price (₹)" rules={[{ required: true }]}>
                <InputNumber 
                  className="w-full" 
                  size="large" 
                  formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\₹\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="price_per_sqft" label="Price per Sq.Ft (₹)">
                <InputNumber className="w-full" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="maintenance_charges" label="Monthly Maintenance (₹)">
                <InputNumber className="w-full" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={18}>
              <Form.Item name="rera_id" label="RERA Registration ID">
                <Input size="large" className="rounded-lg" placeholder="UPRERAPRJ12345" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="is_featured" label="Promote as Featured" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Space>
      ),
    }
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#c9a41d',
          borderRadius: 16,
          colorBgContainer: '#141414',
          colorBorder: 'rgba(255, 255, 255, 0.08)',
          colorTextHeading: '#ffffff',
          colorText: '#e2e8f0',
          colorTextDescription: '#94a3b8',
        },
        components: {
          Tabs: {
            titleFontSize: 12,
            fontWeightStrong: 900,
          },
          Form: {
            labelFontSize: 11,
            labelColor: '#94a3b8',
          },
          Input: {
            colorBgContainer: 'rgba(255,255,255,0.03)',
            paddingBlockLG: 16,
          },
          Select: {
            colorBgContainer: 'rgba(255,255,255,0.03)',
            controlHeightLG: 56,
          },
          InputNumber: {
            colorBgContainer: 'rgba(255,255,255,0.03)',
            controlHeightLG: 56,
          },
          DatePicker: {
            colorBgContainer: 'rgba(255,255,255,0.03)',
            controlHeightLG: 56,
          }
        }
      }}
    >
      <div className="w-full max-w-[1400px] mx-auto space-y-12 pb-24">
      <style>{`
        .property-form-tabs .ant-tabs-nav::before {
          border-bottom: 2px solid rgba(255,255,255,0.05);
        }
        .property-form-tabs .ant-tabs-tab {
          padding: 20px 0;
          margin-right: 40px;
        }
        .property-form-tabs .ant-tabs-tab-btn {
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 10px;
          color: #64748b;
        }
        .property-form-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #c9a41d !important;
        }
        .ant-form-item-label label {
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-size: 10px;
          color: #94a3b8;
          height: auto;
          margin-bottom: 8px;
        }
        .ant-input, .ant-input-number, .ant-select-selector, .ant-picker {
          background: rgba(255,255,255,0.03) !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          color: white !important;
          border-radius: 12px !important;
        }
        .ant-input:focus, .ant-input-number-focused, .ant-select-focused .ant-select-selector, .ant-picker-focused {
          border-color: #c9a41d !important;
          box-shadow: 0 0 0 2px rgba(201, 164, 29, 0.1) !important;
        }
        .ant-form-item {
          margin-bottom: 32px;
        }
        .ant-divider-horizontal.ant-divider-with-text {
          border-top-color: rgba(255,255,255,0.05);
        }
      `}</style>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/admin/properties')}
            className="bg-white/5 border-white/10 text-white hover:text-primary hover:border-primary w-12 h-12 rounded-xl"
          />
          <div className="space-y-1">
            <span className="text-primary text-xs font-bold uppercase tracking-[0.3em]">{id ? 'Modifying' : 'Creating'} Ultra-Advanced Listing</span>
            <h1 className="text-4xl font-black text-white uppercase tracking-tight">Property Editor</h1>
          </div>
        </div>
        
        <Button 
          type="primary" 
          onClick={() => form.submit()} 
          size="large" 
          loading={loading}
          icon={<SaveOutlined />}
          className="bg-primary hover:bg-primary/90 text-black border-none font-bold uppercase tracking-widest h-14 px-8 rounded-xl shadow-lg shadow-primary/20"
        >
          {id ? 'Save Changes' : 'Publish Listing'}
        </Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ 
          is_featured: false, 
          status: 'buy', 
          property_type: 'Apartment',
          bhk_type: '2 BHK',
          possession_status: 'Ready to Move'
        }}
        className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-10 shadow-3xl"
      >
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          items={items} 
          className="property-form-tabs"
          size="large"
        />
      </Form>
      </div>
    </ConfigProvider>
  );
};
