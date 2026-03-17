import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Home, 
  MessageSquare, 
  Users, 
  ArrowUpRight,
} from 'lucide-react';
import { Row, Col, Typography } from 'antd';

const { Text } = Typography;

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeLeads: 0,
    totalAgents: 0,
    recentLeads: [] as any[]
  });

  useEffect(() => {
    const fetchStats = async () => {
      
      const [propertiesCount, leadsCount, agentsCount, recentLeadsData] = await Promise.all([
        supabase.from('properties').select('id', { count: 'exact' }),
        supabase.from('leads').select('id', { count: 'exact' }),
        supabase.from('agents').select('id', { count: 'exact' }),
        supabase.from('leads').select('*, properties(title)').order('created_at', { ascending: false }).limit(5)
      ]);

      setStats({
        totalProperties: propertiesCount.count || 0,
        activeLeads: leadsCount.count || 0,
        totalAgents: agentsCount.count || 0,
        recentLeads: recentLeadsData.data || []
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Properties', value: stats.totalProperties, icon: Home, color: '#c9a41d' },
    { title: 'Total Leads', value: stats.activeLeads, icon: MessageSquare, color: '#1890ff' },
    { title: 'Total Agents', value: stats.totalAgents, icon: Users, color: '#52c41a' },
    { title: 'New Listings', value: '+12%', icon: TrendingUp, color: '#eb2f96', suffix: <ArrowUpRight className="inline w-4 h-4 ml-1" /> }
  ];

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <span className="text-primary text-sm font-bold uppercase tracking-[0.3em]">Overview</span>
        <h1 className="text-5xl font-black text-white uppercase tracking-tight">Dashboard</h1>
      </div>

      <Row gutter={[24, 24]}>
        {statCards.map((card, idx) => (
          <Col xs={24} sm={12} lg={6} key={idx}>
            <div className="bg-[#1a170f] border border-white/5 p-6 rounded-lg transition-transform hover:-translate-y-1 duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-lg">
                  <card.icon className="w-6 h-6 text-primary" style={{ color: card.color }} />
                </div>
              </div>
              <div className="space-y-1">
                <Text className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">{card.title}</Text>
                <div className="flex items-baseline gap-2">
                  <div className="text-white text-3xl font-black">{card.value}</div>
                  {card.suffix && <span className="text-primary text-sm">{card.suffix}</span>}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={24} lg={16}>
          <div className="bg-[#1a170f] border border-white/5 p-8 rounded-lg min-h-[400px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-white text-xl font-bold uppercase tracking-wider">Recent Inquiries</h3>
              <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
              {stats.recentLeads.map((lead) => (
                <div key={lead.id} className="group flex items-center justify-between p-4 bg-white/5 border border-transparent hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 flex items-center justify-center rounded-full text-primary font-bold">
                      {lead.name[0]}
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm tracking-wide">{lead.name}</div>
                      <div className="text-slate-500 text-xs truncate max-w-[200px]">Interested in: {lead.properties?.title || 'General Inquiry'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden md:block text-right">
                      <div className="text-primary font-mono text-[10px]">{lead.phone}</div>
                      <div className="text-slate-500 text-[10px] flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(lead.created_at).toLocaleDateString()}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              ))}
              {stats.recentLeads.length === 0 && (
                <div className="py-20 text-center text-slate-500 italic">No recent inquiries to display.</div>
              )}
            </div>
          </div>
        </Col>
        
        <Col span={24} lg={8}>
          <div className="bg-[#1a170f] border border-white/5 p-8 rounded-lg h-full">
            <h3 className="text-white text-xl font-bold uppercase tracking-wider mb-8">Activity Feed</h3>
            <div className="space-y-8">
              {[
                { type: 'property', text: 'New Apartment listed in Noida', time: '2h ago' },
                { type: 'lead', text: 'New inquiry received for Luxury Villa', time: '4h ago' },
                { type: 'agent', text: 'Agent Sarah updated profile', time: '1d ago' },
              ].map((activity, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  {idx !== 2 && <div className="absolute left-2 top-8 bottom-[-24px] w-[1px] bg-white/5"></div>}
                  <div className={`w-4 h-4 rounded-full mt-1 shrink-0 ${activity.type === 'property' ? 'bg-primary' : activity.type === 'lead' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                  <div className="space-y-1">
                    <p className="text-slate-300 text-sm leading-tight">{activity.text}</p>
                    <p className="text-slate-600 text-[10px] uppercase font-bold tracking-widest">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

// Helper for UI
const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
