import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          email: string | null;
          photo: string | null;
          description: string | null;
          created_at: string;
        };
      };
      properties: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          price: number | null;
          property_type: string | null;
          status: 'buy' | 'rent' | null;
          bedrooms: number | null;
          bathrooms: number | null;
          area: number | null;
          city: string | null;
          location: string | null;
          latitude: number | null;
          longitude: number | null;
          agent_id: string | null;
          is_featured: boolean;
          created_at: string;
        };
      };
      property_images: {
        Row: {
          id: string;
          property_id: string;
          image_url: string;
          is_featured: boolean;
        };
      };
      property_features: {
        Row: {
          id: string;
          name: string;
          icon: string | null;
        };
      };
      property_feature_values: {
        Row: {
          id: string;
          property_id: string;
          feature_id: string;
          value: string;
        };
      };
      leads: {
        Row: {
          id: string;
          property_id: string | null;
          name: string;
          phone: string | null;
          email: string | null;
          message: string | null;
          created_at: string;
        };
      };
    };
  };
};
