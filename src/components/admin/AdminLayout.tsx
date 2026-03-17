import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SidebarItemProps {
  icon: any;
  label: string;
  path: string;
  active: boolean;
}

const SidebarItem = ({ icon: Icon, label, path, active }: SidebarItemProps) => (
  <Link 
    to={path}
    className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20' 
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon className={`w-5 h-5 ${active ? 'text-black' : 'group-hover:text-primary transition-colors'}`} />
      <span className="text-sm uppercase tracking-wider">{label}</span>
    </div>
    {active && <ChevronRight className="w-4 h-4" />}
  </Link>
);

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Home, label: 'Properties', path: '/admin/properties' },
    { icon: BookOpen, label: 'Blogs', path: '/admin/blogs' },
    { icon: Users, label: 'Agents', path: '/admin/agents' },
    { icon: MessageSquare, label: 'Leads', path: '/admin/leads' },
    { icon: Settings, label: 'Features', path: '/admin/features' },
  ];

  return (
    <div className="flex min-h-screen bg-background-dark">
      {/* Sidebar */}
      <aside className="w-72 bg-[#1a170f] border-r border-white/5 flex flex-col fixed h-full z-30">
        <div className="p-8 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-primary font-black text-2xl">SHRI NS</div>
            <div className="text-white font-light text-2xl">INFRA</div>
          </Link>
          <p className="text-[10px] text-primary font-bold uppercase tracking-[0.3em] mt-2">Admin Dashboard</p>
        </div>

        <nav className="flex-grow p-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <SidebarItem 
              key={item.path}
              {...item}
              active={location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))}
            />
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-all font-bold uppercase tracking-wider text-sm"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-72">
        <div className="p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
};
