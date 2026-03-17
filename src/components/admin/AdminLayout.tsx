import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight,
  ChevronLeft,
  BookOpen
} from 'lucide-react';
import { useState, createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase';

interface AdminContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};

interface SidebarItemProps {
  icon: any;
  label: string;
  path: string;
  active: boolean;
  collapsed: boolean;
}

const SidebarItem = ({ icon: Icon, label, path, active, collapsed }: SidebarItemProps) => (
  <Link 
    to={path}
    className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-3 rounded-xl transition-all duration-300 group ${
      active 
        ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20' 
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`}
    title={collapsed ? label : ''}
  >
    <div className={`flex items-center ${collapsed ? 'gap-0' : 'gap-3'}`}>
      <Icon className={`w-5 h-5 ${active ? 'text-black' : 'group-hover:text-primary transition-colors'}`} />
      {!collapsed && <span className="text-sm uppercase tracking-wider">{label}</span>}
    </div>
    {!collapsed && active && <ChevronRight className="w-4 h-4" />}
  </Link>
);

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

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
    <AdminContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="flex min-h-screen bg-background-dark">
      {/* Sidebar */}
      <aside 
        className={`${
          collapsed ? 'w-24' : 'w-72'
        } bg-[#12110c] border-r border-white/5 flex flex-col fixed h-full z-40 transition-all duration-300 ease-in-out`}
      >
        <div className={`p-6 border-b border-white/5 flex flex-col ${collapsed ? 'items-center' : 'items-start'} min-h-[140px] justify-center relative`}>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-black shadow-lg hover:scale-110 transition-transform z-50"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <Link to="/" className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <div className="text-primary font-black text-2xl tracking-tighter">SHRI NS</div>
              {!collapsed && <div className="text-white font-light text-2xl tracking-tighter">INFRA</div>}
            </div>
            {!collapsed && <p className="text-[10px] text-primary font-bold uppercase tracking-[0.3em] mt-2">Admin Dashboard</p>}
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <SidebarItem 
              key={item.path}
              {...item}
              collapsed={collapsed}
              active={location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} w-full p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-bold uppercase tracking-wider text-sm`}
            title={collapsed ? 'Sign Out' : ''}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={`flex-grow transition-all duration-300 ease-in-out min-h-screen ${
          collapsed ? 'ml-24' : 'ml-72'
        }`}
      >
        <div className="max-w-[1600px] mx-auto p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
    </AdminContext.Provider>
  );
};
