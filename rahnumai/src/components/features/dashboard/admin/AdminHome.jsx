import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  Clock, 
  BarChart3, 
  Settings,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';
import StatsCard from '@/components/common/ui/cards/StatsCard';
import QuickActions from '@/components/features/dashboard/common/QuickActions';
import RecentActivity from '@/components/features/dashboard/common/RecentActivity';

export default function AdminHome() {
  const { theme } = useThemeGlobal();
  const [stats, setStats] = useState([
    { label: 'Pending Approvals', value: 12, change: '+2', icon: Clock, color: 'orange' },
    { label: 'Total Faculty', value: 45, change: '+5', icon: Users, color: 'blue' },
    { label: 'Total Students', value: 1250, change: '+34', icon: Users, color: 'green' },
    { label: 'Active Courses', value: 67, change: '+3', icon: BarChart3, color: 'purple' }
  ]);

  const [pendingRequests, setPendingRequests] = useState([
    { id: 1, name: 'John Doe', type: 'Faculty Registration', date: '2024-01-15', status: 'pending' },
    { id: 2, name: 'Sarah Wilson', type: 'Student Registration', date: '2024-01-14', status: 'pending' },
    { id: 3, name: 'CS101 Course', type: 'Course Creation', date: '2024-01-14', status: 'pending' }
  ]);

  const quickActions = [
    { 
      title: 'Approve Requests', 
      description: 'Review and approve pending registrations',
      icon: UserCheck,
      path: '/admin/approvals',
      color: 'emerald'
    },
    { 
      title: 'Manage Faculty', 
      description: 'Assign faculty to courses and departments',
      icon: Users,
      path: '/admin/faculty',
      color: 'blue'
    },
    { 
      title: 'System Settings', 
      description: 'Configure system-wide settings',
      icon: Settings,
      path: '/admin/settings',
      color: 'purple'
    },
    { 
      title: 'View Reports', 
      description: 'Generate system analytics and reports',
      icon: BarChart3,
      path: '/admin/analytics',
      color: 'orange'
    }
  ];

  const handleApprove = (id) => {
    setPendingRequests(prev => prev.filter(req => req.id !== id));
    // API call would go here
  };

  const handleReject = (id) => {
    setPendingRequests(prev => prev.filter(req => req.id !== id));
    // API call would go here
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-slate-900 dark:text-white"
          >
            Admin Dashboard
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className=" dark: mt-2"
          >
            Manage your institution's digital ecosystem
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <QuickActions actions={quickActions} />
            </motion.div>

           
          </div>

          {/* Right Column - Recent Activity */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <RecentActivity />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}