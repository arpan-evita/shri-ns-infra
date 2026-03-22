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
          
          form.setFieldsValue({
            ...property,
            purpose: property.status // Keep purpose mapping since DB status is buy/rent
          });
          
          // Set featured image
          const featured = property.property_images?.find((img: any) => img.is_featured);
          if (featured) setImageUrl(featured.image_url);

          // Set Selected Amenities
          setSelectedAmenities(property.property_amenity_relation?.map((ar: any) => ar.amenity_id) || []);

          // Set Gallery Images
          const gallery = property.property_images?.filter((img: any) => !img.is_featured) || [];
          setGalleryImages(gallery.map((img: any) => ({ image_url: img.image_url })));
          
          // Set OG Image
          if (property.og_image) setOgImage(property.og_image);
          
          // Set Featured Image (imageUrl state)
          if (property.brochure_url) setImageUrl(property.brochure_url);
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
      purpose, // Extracted to be mapped to 'status'
      ...propertyData 
    } = values;

    const finalPropertyData = {
      ...propertyData,
      slug,
      status: values.purpose, // Map form 'purpose' to DB 'status' ('buy'/'rent')
      listing_status: values.listing_status, // Map form 'listing_status' to DB 'listing_status'
      og_image: ogImage,
      brochure_url: imageUrl, // Reusing brochure_url as the featured image DB column
      updated_at: new Date().toISOString()
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
      // Clear old featured image
      await supabase.from('property_images')
        .delete()
        .eq('property_id', propertyId)
        .eq('is_featured', true);

      await supabase.from('property_images').insert({
        property_id: propertyId,
        image_url: imageUrl,
        is_featured: true
      });
    }

    // 2. Handle Floor Plans
    if (property_floor_plans && property_floor_plans.length > 0) {
      // Clear old plans if editing
      if (id) await supabase.from('property_floor_plans').delete().eq('property_id', id);
      const floorPlanData = property_floor_plans.filter((p: any) => p.image_url).map((plan: any) => ({
        property_id: propertyId,
        title: plan.title,
        image_url: plan.image_url
      }));
      if (floorPlanData.length > 0) {
        await supabase.from('property_floor_plans').insert(floorPlanData);
      }
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
    
    // 5. Handle Gallery Images
    // Clear old non-featured images if editing
    if (id) {
       await supabase.from('property_images').delete().eq('property_id', propertyId).eq('is_featured', false);
    }
    if (galleryImages.length > 0) {
      const galleryData = galleryImages.map(img => ({
        property_id: propertyId,
        image_url: img.image_url,
        is_featured: false
      }));
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
      label: (
        <span className="flex items-center gap-2">
          <InfoCircleOutlined /> BASIC INFO
        </span>
      ),
      children: (
        <Space direction="vertical" size="large" className="w-full">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Form.Item name="title" label="Listing Title" rules={[{ required: true }]}>
                <Input size="large" placeholder="E.g. Luxury 4BHK Apartment in Noida" className="rounded-lg" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="listing_status" label="Listing Status" rules={[{ required: true }]}>
                <Select size="large" className="rounded-lg">
                  <Option value="Draft">Draft</Option>
                  <Option value="Published">Published</Option>
                  <Option value="Archived">Archived</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
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
              <Form.Item name="purpose" label="Purpose" rules={[{ required: true }]}>
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

          <Form.Item name="highlights" label="Key Highlights (One per line)">
            <TextArea rows={4} placeholder="E.g. Near Metro&#10;24/7 Security&#10;Modern Fittings" className="rounded-lg" />
          </Form.Item>
        </Space>
      ),
    },
    {
      key: '2',
      label: (
        <span className="flex items-center gap-2">
          <FormatPainterOutlined /> SPECIFICATIONS
        </span>
      ),
      children: (
        <Space direction="vertical" size="large" className="w-full">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={6}>
              <Form.Item name="bhk_type" label="BHK Configuration">
                <Select size="large" className="rounded-lg" placeholder="Select BHK">
                  <Option value="">Select BHK</Option>
                  <Option value="1 BHK">1 BHK</Option>
                  <Option value="2 BHK">2 BHK</Option>
                  <Option value="3 BHK">3 BHK</Option>
                  <Option value="4 BHK">4 BHK</Option>
                  <Option value="5 BHK">5 BHK</Option>
                  <Option value="Studio">Studio</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="bedrooms" label="Total Bedrooms">
                <InputNumber min={0} className="w-full" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="bathrooms" label="Total Bathrooms">
                <InputNumber min={0} className="w-full" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="balconies" label="Balcony Count">
                <InputNumber min={0} className="w-full" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Form.Item name="carpet_area" label="Carpet Area">
                <InputNumber className="w-full" size="large" addonAfter="Sq.Ft" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="builtup_area" label="Built-up Area">
                <InputNumber className="w-full" size="large" addonAfter="Sq.Ft" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="super_builtup_area" label="Super Built-up Area">
                <InputNumber className="w-full" size="large" addonAfter="Sq.Ft" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={6}>
              <Form.Item name="facing" label="Facing (Vaastu)">
                <Select size="large" className="rounded-lg" placeholder="Select Facing">
                  <Option value="">Select Facing</Option>
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
            <Col xs={24} md={6}>
              <Form.Item name="furnishing_status" label="Furnishing">
                <Select size="large" className="rounded-lg" placeholder="Select Furnishing">
                  <Option value="">Select Furnishing</Option>
                  <Option value="Unfurnished">Unfurnished</Option>
                  <Option value="Semi-furnished">Semi-furnished</Option>
                  <Option value="Fully Furnished">Fully Furnished</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="age_of_property" label="Property Age">
                <Select size="large" className="rounded-lg" placeholder="Select Age">
                  <Option value="">Select Age</Option>
                  <Option value="New Construction">New Construction</Option>
                  <Option value="0–1 years">0–1 years</Option>
                  <Option value="1–5 years">1–5 years</Option>
                  <Option value="5–10 years">5–10 years</Option>
                  <Option value="10+ years">10+ years</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="parking" label="Parking Type">
                <Select size="large" className="rounded-lg" placeholder="Select Parking">
                  <Option value="">Select Parking</Option>
                  <Option value="Covered Parking">Covered Parking</Option>
                  <Option value="Open Parking">Open Parking</Option>
                  <Option value="Basement Parking">Basement Parking</Option>
                  <Option value="No Parking">No Parking</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Form.Item name="floor_no" label="Floor Number">
                <InputNumber className="w-full" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
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
          <EnvironmentOutlined /> LOCATION & CONNECTIVITY
        </span>
      ),
      children: (
        <Space direction="vertical" size="large" className="w-full">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={6}>
              <Form.Item name="city" label="City" rules={[{ required: true }]}>
                <Input size="large" placeholder="E.g. Noida" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="location" label="Area / Sector" rules={[{ required: true }]}>
                <Input size="large" placeholder="E.g. Sector 150" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="pincode" label="Pincode">
                <InputNumber className="w-full" size="large" placeholder="201301" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="full_address" label="Full Address">
            <TextArea rows={3} placeholder="House No, Street, Landmark details..." className="rounded-lg" />
          </Form.Item>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Form.Item name="possession_status" label="Possession Status">
                <Select size="large" className="rounded-lg">
                  <Option value="Ready to Move">Ready to Move</Option>
                  <Option value="Under Construction">Under Construction</Option>
                  <Option value="New Launch">New Launch</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="possession_date" label="Possession Date (Expected)">
                <DatePicker size="large" className="w-full rounded-lg" />
              </Form.Item>
            </Col>
            <Col xs={24} md={4}>
              <Form.Item name="latitude" label="Latitude">
                <InputNumber className="w-full" size="large" precision={6} />
              </Form.Item>
            </Col>
            <Col xs={24} md={4}>
              <Form.Item name="longitude" label="Longitude">
                <InputNumber className="w-full" size="large" precision={6} />
              </Form.Item>
            </Col>
          </Row>

          <div className="space-y-4">
             <Title level={5} className="text-white mb-0 text-xs uppercase tracking-widest font-black">Interactive Map Placement</Title>
             <Form.Item noStyle shouldUpdate={(prev, curr) => prev.latitude !== curr.latitude || prev.longitude !== curr.longitude}>
                {({ getFieldsValue, setFieldsValue }) => {
                   const { latitude, longitude } = getFieldsValue(['latitude', 'longitude']);
                   return (
                     <MapSelector 
                        value={{ lat: latitude || 28.6139, lng: longitude || 77.209 }}
                        onChange={(val) => {
                           setFieldsValue({ latitude: val.lat, longitude: val.lng });
                        }}
                     />
                   );
                }}
             </Form.Item>
          </div>

          <Divider orientation="left" className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Google Maps Embed</Divider>
          <Form.Item 
            name="map_embed_url" 
            label="Google Maps Embed URL" 
            tooltip="Go to Google Maps → Search location → Share → Embed a map → Copy the HTML code or just the src URL"
            extra="Pro Tip: You can directly paste the full <iframe>...</iframe> code here, and we'll extract the URL for you!"
          >
            <Input 
              size="large" 
              placeholder="Paste <iframe> code OR embed URL here" 
              className="rounded-lg" 
              onChange={(e) => {
                const val = e.target.value;
                if (val.includes('<iframe')) {
                  const match = val.match(/src="([^"]+)"/);
                  if (match && match[1]) {
                    form.setFieldsValue({ map_embed_url: match[1] });
                  }
                }
              }}
            />
          </Form.Item>

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
          <CarOutlined /> AMENITIES & FEATURES
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
          <EyeOutlined /> MEDIA & TOURS
        </span>
      ),
      children: (
        <Space direction="vertical" size="large" className="w-full">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Form.Item label="Featured Cover Photo">
                <Upload
                  name="featured"
                  listType="picture-card"
                  showUploadList={false}
                  customRequest={(opt) => handleFileUpload(opt, 'property-images', setImageUrl)}
                >
                  {imageUrl ? <img src={imageUrl} alt="featured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : uploadButton}
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Property Gallery (Multiple)">
                 <Upload
                    listType="picture-card"
                    fileList={galleryImages.map((img, i) => ({ uid: i.toString(), name: 'image', status: 'done', url: img.image_url }))}
                    onRemove={(file) => setGalleryImages(prev => prev.filter(img => img.image_url !== file.url))}
                    customRequest={(opt) => handleFileUpload(opt, 'property-images', (url) => setGalleryImages(prev => [...prev, { image_url: url }]))}
                 >
                    {uploadButton}
                 </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Form.Item name="video_url" label="Video Tour URL">
                <Input size="large" prefix={<VideoCameraOutlined />} placeholder="YouTube or Vimeo Link" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="virtual_tour_360" label="360° Virtual Tour URL">
                <Input size="large" prefix={<GlobalOutlined />} placeholder="Kuula or Matterport Link" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Property Floor Plans</Divider>
          <Form.List name="property_floor_plans">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={16} align="bottom" className="mb-4">
                    <Col span={10}>
                      <Form.Item {...restField} name={[name, 'title']} label="Plan Title">
                        <Input placeholder="E.g. Unit Type A" />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item {...restField} name={[name, 'image_url']} label="Floor Plan Image">
                        <Upload
                           showUploadList={false}
                           customRequest={(opt) => handleFileUpload(opt, 'property-images', (url) => {
                              const plans = form.getFieldValue('property_floor_plans');
                              plans[name].image_url = url;
                              form.setFieldsValue({ property_floor_plans: plans });
                           })}
                        >
                           <Button icon={<UploadOutlined />} className="w-full">
                              {form.getFieldValue(['property_floor_plans', name, 'image_url']) ? 'Update Image' : 'Upload Plan'}
                           </Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Button onClick={() => remove(name)} danger icon={<DeleteOutlined />} block />
                    </Col>
                  </Row>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Floor Plan</Button>
              </>
            )}
          </Form.List>
        </Space>
      )
    },
    {
      key: '6',
      label: (
        <span className="flex items-center gap-2">
          <DollarOutlined /> LEGAL & FINANCIAL
        </span>
      ),
      children: (
        <Space direction="vertical" size="large" className="w-full">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Form.Item name="price" label="Total Price (₹)">
                <InputNumber className="w-full" size="large" formatter={v => `₹ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="price_per_sqft" label="Price per Sq.Ft (₹)">
                <InputNumber className="w-full" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="booking_amount" label="Booking Amount (₹)">
                <InputNumber className="w-full" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Form.Item name="stamp_duty" label="Stamp Duty (₹)">
                <InputNumber className="w-full" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="registration_charges" label="Registration Charges (₹)">
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
            <Col xs={24} md={6}>
              <Form.Item name="price_negotiable" label="Price Negotiable" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="loan_available" label="Loan Available" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="rera_id" label="RERA Registration ID">
                <Input size="large" placeholder="E.g. UPRERAPRJ12345" />
              </Form.Item>
            </Col>
          </Row>
        </Space>
      )
    },
    {
      key: '7',
      label: (
        <span className="flex items-center gap-2">
          <ShareAltOutlined /> SEO SETTINGS
        </span>
      ),
      children: (
        <Space direction="vertical" size="large" className="w-full">
          <Form.Item name="meta_title" label="Meta Title">
            <Input size="large" placeholder="Luxury 4BHK Apartment for Sale in Sector 150" />
          </Form.Item>
          <Form.Item name="meta_description" label="Meta Description">
            <TextArea rows={4} placeholder="Find your dream home with 5-star amenities..." />
          </Form.Item>
          <Form.Item name="focus_keyword" label="Focus Keyword">
            <Input size="large" placeholder="e.g. 4BHK Noida, Luxury Villa" />
          </Form.Item>
          <Form.Item label="Open Graph (Social) Image">
             <Upload
                name="og"
                listType="picture-card"
                showUploadList={false}
                customRequest={(opt) => handleFileUpload(opt, 'property-images', setOgImage)}
             >
                {ogImage ? <img src={ogImage} alt="og" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : uploadButton}
             </Upload>
             <div className="text-slate-500 text-[10px] uppercase font-bold mt-2 italic">Standard 1200x630px recommended for social sharing previews</div>
          </Form.Item>
        </Space>
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
