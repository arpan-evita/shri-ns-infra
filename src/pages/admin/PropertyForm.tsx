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
  DeleteOutlined,
  CarOutlined,
  UploadOutlined,
  FormatPainterOutlined,
  DollarOutlined,
  EyeOutlined,
  GlobalOutlined,
  ShareAltOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import { supabase } from '@/lib/supabase';
import MapSelector from '@/components/admin/MapSelector';
import dayjs from 'dayjs';
import { useAdmin } from '@/components/admin/AdminLayout';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
// Custom Icons or Components

// Custom Icons or Components

export const PropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { collapsed } = useAdmin();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('1');
  const [agents, setAgents] = useState<
    { id: string; name: string }[]
  >([]);
  const [amenities, setAmenities] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [galleryImages, setGalleryImages] = useState<
    { id?: string; image_url: string }[]
  >([]);
  const [ogImage, setOgImage] = useState<string | null>(null);

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
            nearby_places(*),
            property_variants(*)
          `)
          .eq('id', id)
          .single();

        if (error) {
          message.error('Failed to load property');
        } else {
          // Convert date for dayjs
          if (property.launch_date) property.launch_date = dayjs(property.launch_date);
          if (property.possession_date) property.possession_date = dayjs(property.possession_date);
          
          // Fetch Specifications
          const { data: specData } = await supabase.from('property_specifications').select('*').eq('property_id', id);

          form.setFieldsValue({
            ...property,
            property_specifications: specData || []
          });
          
          // Set featured image
          const featured = property.property_images?.find((img: any) => img.is_featured);
          if (featured) setImageUrl(featured.image_url);

          // Set Selected Amenities
          setSelectedAmenities(property.property_amenity_relation?.map((ar: any) => ar.amenity_id) || []);

          // Set Gallery Images
          const gallery = property.property_images?.filter((img: any) => !img.is_featured) || [];
          setGalleryImages(gallery.map((img: any) => ({ image_url: img.image_url })));
          
          if (property.og_image) setOgImage(property.og_image);
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
    
    const { 
      property_images, 
      property_floor_plans, 
      property_amenity_relation, 
      nearby_places,
      property_variants,
      property_specifications,
      ...propertyData 
    } = values;

    const finalPropertyData = {
      ...propertyData,
      slug,
      og_image: ogImage,
      brochure_url: values.brochure_url || imageUrl,
      updated_at: new Date().toISOString()
    };

    if (values.possession_date) finalPropertyData.possession_date = values.possession_date.format('YYYY-MM-DD');
    if (values.launch_date) finalPropertyData.launch_date = values.launch_date.format('YYYY-MM-DD');

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

    // Handle Variants
    if (property_variants) {
      if (id) await supabase.from('property_variants').delete().eq('property_id', id);
      const variantData = property_variants.map((variant: any) => ({
        ...variant,
        property_id: propertyId
      }));
      if (variantData.length > 0) await supabase.from('property_variants').insert(variantData);
    }

    // Handle Specifications Module (Tab 8)
    if (property_specifications) {
      if (id) await supabase.from('property_specifications').delete().eq('property_id', id);
      const specData = property_specifications.filter((s: any) => s.label && s.value).map((spec: any) => ({
        ...spec,
        property_id: propertyId
      }));
      if (specData.length > 0) await supabase.from('property_specifications').insert(specData);
    }

    // Handle Media & Relations (Images, Amenities, etc.)
    if (imageUrl) {
      await supabase.from('property_images').delete().eq('property_id', propertyId).eq('is_featured', true);
      await supabase.from('property_images').insert({ property_id: propertyId, image_url: imageUrl, is_featured: true });
    }

    if (property_floor_plans) {
      if (id) await supabase.from('property_floor_plans').delete().eq('property_id', id);
      const floorPlanData = property_floor_plans.filter((p: any) => p.image_url).map((plan: any) => ({
        property_id: propertyId,
        title: plan.title,
        image_url: plan.image_url
      }));
      if (floorPlanData.length > 0) await supabase.from('property_floor_plans').insert(floorPlanData);
    }

    if (selectedAmenities.length > 0) {
      if (id) await supabase.from('property_amenity_relation').delete().eq('property_id', id);
      const amenityData = selectedAmenities.map(amenityId => ({ property_id: propertyId, amenity_id: amenityId }));
      await supabase.from('property_amenity_relation').insert(amenityData);
    }

    if (nearby_places) {
      if (id) await supabase.from('nearby_places').delete().eq('property_id', id);
      const landmarkData = nearby_places.map((landmark: any) => ({ ...landmark, property_id: propertyId }));
      await supabase.from('nearby_places').insert(landmarkData);
    }
    
    if (id) await supabase.from('property_images').delete().eq('property_id', propertyId).eq('is_featured', false);
    if (galleryImages.length > 0) {
      const galleryData = galleryImages.map(img => ({ property_id: propertyId, image_url: img.image_url, is_featured: false }));
      await supabase.from('property_images').insert(galleryData);
    }
    
    message.success(`Property ${id ? 'updated' : 'created'} successfully`);
    navigate('/admin/properties');
    setLoading(false);
  };

  const uploadButton = (
    <div className="flex flex-col items-center justify-center">
      {uploadLoading ? <LoadingOutlined className="text-2xl text-primary" /> : <PlusOutlined className="text-2xl text-slate-500" />}
      <div className="mt-2 text-slate-500 uppercase font-black text-[10px] tracking-widest">
        {uploadLoading ? 'Uploading...' : 'Upload'}
      </div>
    </div>
  );

  const items = [
    {
      key: '1',
      label: '1. BASIC INFO',
      children: (
        <Space direction="vertical" size="large" className="w-full">
          <Row gutter={24}>
            <Col xs={24} md={6}>
              <Form.Item name="property_uid" label="Property ID (Internal)" tooltip="Unique tracking reference">
                <Input placeholder="SNS-001" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="title" label="Listing Title" rules={[{ required: true }]}>
                <Input placeholder="SKA Divine Greater Noida" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="listing_status" label="Publish Status">
                <Select>
                  <Option value="Published">Published</Option>
                  <Option value="Draft">Draft</Option>
                  <Option value="Hidden">Hidden</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item name="project_name" label="Project Name">
                <Input placeholder="SKA Divine" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="developer_name" label="Developer Name">
                <Input placeholder="SKA Group" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="is_featured" label="Featured Property" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item name="property_type" label="Property Type" rules={[{ required: true }]}>
                <Select onChange={() => form.setFieldsValue({ sub_type: undefined })}>
                  <Option value="Residential">Residential</Option>
                  <Option value="Commercial">Commercial</Option>
                  <Option value="Plot">Plot</Option>
                  <Option value="Villa">Villa</Option>
                  <Option value="Studio">Studio</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item noStyle shouldUpdate={(prev, curr) => prev.property_type !== curr.property_type}>
                {({ getFieldValue }) => (
                  <Form.Item name="sub_type" label="Property Sub Type">
                    <Select placeholder="Select Sub Type">
                      {getFieldValue('property_type') === 'Residential' && (
                        <>
                          <Option value="Apartment">Apartment</Option>
                          <Option value="Penthouse">Penthouse</Option>
                          <Option value="Builder Floor">Builder Floor</Option>
                        </>
                      )}
                      {getFieldValue('property_type') === 'Commercial' && (
                        <>
                          <Option value="Retail Shop">Retail Shop</Option>
                          <Option value="Office Space">Office Space</Option>
                          <Option value="SCO">SCO</Option>
                        </>
                      )}
                      {getFieldValue('property_type') === 'Plot' && (
                        <>
                          <Option value="Residential Plot">Residential Plot</Option>
                          <Option value="Commercial Plot">Commercial Plot</Option>
                        </>
                      )}
                    </Select>
                  </Form.Item>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Long Description">
             <TextArea rows={6} />
          </Form.Item>
        </Space>
      )
    },
    {
      key: '2',
      label: '2. LOCATION',
      children: (
        <Space direction="vertical" size="large" className="w-full">
          <Row gutter={24}>
            <Col span={8}><Form.Item name="country" label="Country"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="state" label="State"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="city" label="City" rules={[{required:true}]}><Input /></Form.Item></Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}><Form.Item name="micro_market" label="Micro Market"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="location" label="Sector / Locality" rules={[{required:true}]}><Input /></Form.Item></Col>
          </Row>
          <Form.Item name="full_address" label="Full Address"><TextArea rows={3} /></Form.Item>
          <Row gutter={24}>
            <Col span={12}><Form.Item name="latitude" label="Latitude"><InputNumber className="w-full" /></Form.Item></Col>
            <Col span={12}><Form.Item name="longitude" label="Longitude"><InputNumber className="w-full" /></Form.Item></Col>
          </Row>
          <Form.Item name="map_embed_url" label="Google Map URL / Embed Code"><Input /></Form.Item>
        </Space>
      )
    },
    {
      key: '3',
      label: '3. PRICING',
      children: (
        <Space direction="vertical" size="large" className="w-full">
          <Row gutter={24}>
            <Col span={12}><Form.Item name="price" label="Starting Price (₹)"><InputNumber className="w-full" /></Form.Item></Col>
            <Col span={12}><Form.Item name="max_price" label="Maximum Price (₹)"><InputNumber className="w-full" /></Form.Item></Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}><Form.Item name="price_per_sqft" label="Price per Sq.Ft"><InputNumber className="w-full" /></Form.Item></Col>
            <Col span={8}><Form.Item name="price_per_sq_yd" label="Price per Sq.Yd"><InputNumber className="w-full" /></Form.Item></Col>
            <Col span={8}><Form.Item name="maintenance_charges" label="Maintenance Charges"><InputNumber className="w-full" /></Form.Item></Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}><Form.Item name="booking_amount" label="Booking Amount"><InputNumber className="w-full" /></Form.Item></Col>
            <Col span={12}><Form.Item name="eoi_amount" label="EOI Amount"><InputNumber className="w-full" /></Form.Item></Col>
          </Row>
          <Form.Item name="plc_charges" label="PLC Charges"><Input placeholder="Preferred Location Charges details..." /></Form.Item>
        </Space>
      )
    },
    {
      key: '4',
      label: '4. PROJECT DETAILS',
      children: (
        <Space direction="vertical" size="large" className="w-full">
          <Row gutter={24}>
            <Col span={12}><Form.Item name="possession_date" label="Possession Date"><DatePicker className="w-full" /></Form.Item></Col>
            <Col span={12}><Form.Item name="possession_status" label="Possession Status"><Select>
              <Option value="Ready to Move">Ready to Move</Option>
              <Option value="Under Construction">Under Construction</Option>
              <Option value="New Launch">New Launch</Option>
            </Select></Form.Item></Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}><Form.Item name="launch_date" label="Launch Date"><DatePicker className="w-full" /></Form.Item></Col>
            <Col span={12}><Form.Item name="rera_id" label="RERA Number"><Input /></Form.Item></Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}><Form.Item name="total_land_area" label="Total Land Area"><Input /></Form.Item></Col>
            <Col span={6}><Form.Item name="total_towers" label="Total Towers"><InputNumber className="w-full" /></Form.Item></Col>
            <Col span={6}><Form.Item name="total_units" label="Total Units"><InputNumber className="w-full" /></Form.Item></Col>
            <Col span={6}><Form.Item name="total_floors" label="Total Floors"><InputNumber className="w-full" /></Form.Item></Col>
          </Row>
        </Space>
      )
    },
    {
      key: '5',
      label: '5. DYNAMIC FIELDS',
      children: (
        <Form.Item noStyle shouldUpdate={(prev, curr) => prev.property_type !== curr.property_type}>
          {({ getFieldValue }) => {
            const type = getFieldValue('property_type');
            return (
              <Space direction="vertical" className="w-full">
                {type === 'Residential' && (
                  <Row gutter={24}>
                    <Col span={6}><Form.Item name="bhk_type" label="BHK Type"><Input /></Form.Item></Col>
                    <Col span={6}><Form.Item name="bathrooms" label="Bathrooms"><InputNumber className="w-full" /></Form.Item></Col>
                    <Col span={6}><Form.Item name="balconies" label="Balcony Count"><InputNumber className="w-full" /></Form.Item></Col>
                    <Col span={6}><Form.Item name="facing" label="Facing"><Input /></Form.Item></Col>
                  </Row>
                )}
                {type === 'Plot' && (
                  <Row gutter={24}>
                    <Col span={8}><Form.Item name="plot_facing" label="Plot Facing"><Input /></Form.Item></Col>
                    <Col span={8}><Form.Item name="registry_status" label="Registry Status"><Input /></Form.Item></Col>
                    <Col span={8}><Form.Item name="road_width" label="Road Width"><Input /></Form.Item></Col>
                  </Row>
                )}
                <Row gutter={24}>
                  <Col span={8}><Form.Item name="area" label="Super Area"><InputNumber className="w-full" /></Form.Item></Col>
                  <Col span={8}><Form.Item name="carpet_area" label="Carpet Area"><InputNumber className="w-full" /></Form.Item></Col>
                  <Col span={8}><Form.Item name="furnishing_status" label="Furnishing"><Input /></Form.Item></Col>
                </Row>
              </Space>
            );
          }}
        </Form.Item>
      )
    },
    {
      key: '6',
      label: '6. INVENTORY',
      children: (
        <Form.List name="property_variants">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="bg-white/5 p-6 rounded-2xl mb-6 border border-white/5">
                  <Row gutter={[16, 16]}>
                    <Col span={6}><Form.Item {...restField} name={[name, 'configuration']} label="Unit Type"><Input placeholder="3BHK" /></Form.Item></Col>
                    <Col span={6}><Form.Item {...restField} name={[name, 'size']} label="Size"><InputNumber className="w-full" /></Form.Item></Col>
                    <Col span={6}><Form.Item {...restField} name={[name, 'price']} label="Price (₹)"><InputNumber className="w-full" /></Form.Item></Col>
                    <Col span={6}><Form.Item {...restField} name={[name, 'inventory_count']} label="Count"><InputNumber className="w-full" /></Form.Item></Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col span={18}><Form.Item {...restField} name={[name, 'notes']} label="Special Notes"><Input /></Form.Item></Col>
                    <Col span={6} className="flex items-end"><Button danger block onClick={() => remove(name)} icon={<DeleteOutlined />}>Remove</Button></Col>
                  </Row>
                </div>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Variant</Button>
            </>
          )}
        </Form.List>
      )
    },
    {
      key: '7',
      label: '7. AMENITIES',
      children: (
        <Checkbox.Group value={selectedAmenities} onChange={(checkedValues) => setSelectedAmenities(checkedValues as string[])} className="w-full">
          <Row gutter={[16, 24]}>
            {amenities.map(amenity => (
              <Col span={6} key={amenity.id}><Checkbox value={amenity.id}>{amenity.name}</Checkbox></Col>
            ))}
          </Row>
        </Checkbox.Group>
      )
    },
    {
      key: '8',
      label: '8. SPECIFICATIONS',
      children: (
        <Form.List name="property_specifications">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} gutter={16} align="bottom" className="mb-4">
                  <Col span={10}><Form.Item {...restField} name={[name, 'label']} label="Label"><Input placeholder="Flooring" /></Form.Item></Col>
                  <Col span={10}><Form.Item {...restField} name={[name, 'value']} label="Value"><Input placeholder="Italian Marble" /></Form.Item></Col>
                  <Col span={4}><Button onClick={() => remove(name)} danger icon={<DeleteOutlined />} block /></Col>
                </Row>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Specification</Button>
            </>
          )}
        </Form.List>
      )
    },
    {
      key: '9',
      label: '9. MEDIA',
      children: (
        <Space direction="vertical" size="large" className="w-full">
           <Row gutter={24}>
             <Col span={12}><Form.Item label="Featured Image"><Upload listType="picture-card" showUploadList={false} customRequest={(o) => handleFileUpload(o, 'property-images', setImageUrl)}>{imageUrl ? <img src={imageUrl} alt="f" style={{width:'100%'}}/> : uploadButton}</Upload></Form.Item></Col>
             <Col span={12}><Form.Item label="Gallery"><Upload listType="picture-card" fileList={galleryImages.map((img, i) => ({ uid: i.toString(), name: 'image', status: 'done', url: img.image_url }))} customRequest={(o) => handleFileUpload(o, 'property-images', (url) => setGalleryImages(p => [...p, {image_url:url}]))}>{uploadButton}</Upload></Form.Item></Col>
           </Row>
           <Row gutter={24}>
             <Col span={12}><Form.Item name="video_url" label="Site Video URL"><Input /></Form.Item></Col>
             <Col span={12}><Form.Item name="virtual_tour_360" label="360 Tour URL"><Input /></Form.Item></Col>
           </Row>
           <Form.Item name="brochure_url" label="Brochure PDF URL"><Input placeholder="Paste PDF public URL" /></Form.Item>
        </Space>
      )
    },
    {
      key: '10',
      label: '10. SEO',
      children: (
        <Space direction="vertical" size="large" className="w-full">
           <Form.Item name="meta_title" label="Meta Title"><Input /></Form.Item>
           <Form.Item name="meta_description" label="Meta Description"><TextArea rows={3} /></Form.Item>
           <Form.Item name="meta_keywords" label="Meta Keywords"><Input placeholder="Luxury, Villa, Noida" /></Form.Item>
           <Row gutter={24}>
             <Col span={12}><Form.Item name="canonical_url" label="Canonical URL"><Input /></Form.Item></Col>
             <Col span={12}><Form.Item name="schema_markup" label="Schema Markup (JSON)"><TextArea rows={4} /></Form.Item></Col>
           </Row>
        </Space>
      )
    },
    {
      key: '11',
      label: '1 Lead Settings',
      children: (
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="agent_id" label="Assigned Sales Agent">
              <Select placeholder="Select Agent">{agents.map(a => <Option key={a.id} value={a.id}>{a.name}</Option>)}</Select>
            </Form.Item>
          </Col>
          <Col span={12}><Form.Item name="whatsapp_number" label="WhatsApp Override"><Input placeholder="+918090..." /></Form.Item></Col>
          <Col span={12}><Form.Item name="cta_label_override" label="CTA Label Override"><Input placeholder="Get Special Pricing" /></Form.Item></Col>
          <Col span={12}><Form.Item name="lead_source_tag" label="Lead Source Tag"><Input placeholder="Campaign_Noida_2024" /></Form.Item></Col>
        </Row>
      )
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
      <div className={`w-full ${collapsed ? 'max-w-7xl' : 'max-w-5xl'} mx-auto space-y-8 pb-24 transition-all duration-300`}>
      <style>{`
        .property-form-tabs .ant-tabs-nav::before {
          border-bottom: 2px solid rgba(255,255,255,0.05);
        }
        .property-form-tabs .ant-tabs-tab {
          padding: 16px 0;
          margin-right: ${collapsed ? '32px' : '12px'};
          transition: margin 0.3s;
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
          purpose: 'buy', 
          listing_status: 'Published',
          property_type: 'Apartment',
          bhk_type: '2 BHK',
          possession_status: 'Ready to Move',
          area_unit: 'sqft'
        }}
        className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 lg:p-8 shadow-3xl"
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
