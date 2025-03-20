
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileTextIcon, 
  UsersIcon, 
  ShieldAlertIcon, 
  BarChart3Icon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  SettingsIcon,
  DatabaseIcon,
  AlertCircleIcon,
  CheckCircleIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

// Mock statistics
const stats = [
  { 
    name: 'Total Documents', 
    count: 12489, 
    change: '+14%', 
    trend: 'up', 
    icon: FileTextIcon, 
    color: 'bg-blue-500' 
  },
  { 
    name: 'Active Users', 
    count: 873, 
    change: '+7%', 
    trend: 'up', 
    icon: UsersIcon, 
    color: 'bg-emerald-500' 
  },
  { 
    name: 'Security Incidents', 
    count: 3, 
    change: '-25%', 
    trend: 'down', 
    icon: ShieldAlertIcon, 
    color: 'bg-amber-500' 
  },
  { 
    name: 'Storage Used', 
    count: '768GB', 
    change: '+5%', 
    trend: 'up', 
    icon: DatabaseIcon, 
    color: 'bg-violet-500' 
  },
];

// Mock security alerts
const securityAlerts = [
  { 
    id: 1, 
    level: 'high', 
    message: 'Multiple failed login attempts detected from IP 192.168.1.54', 
    time: '35 minutes ago',
    status: 'unresolved'
  },
  { 
    id: 2, 
    level: 'medium', 
    message: 'Unusual document download activity from user john.smith@example.com', 
    time: '2 hours ago',
    status: 'investigating'
  },
  { 
    id: 3, 
    level: 'low', 
    message: 'New device login from Marketing department', 
    time: '5 hours ago',
    status: 'resolved'
  },
];

// Mock department storage usage
const departmentUsage = [
  { department: 'Marketing', used: 215, total: 500, percentage: 43 },
  { department: 'Finance', used: 187, total: 300, percentage: 62 },
  { department: 'HR', used: 95, total: 150, percentage: 63 },
  { department: 'IT', used: 271, total: 500, percentage: 54 },
];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'admin') return null;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and analytics</p>
      </div>
      
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={`${stat.color} p-2 rounded-md`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  <span className={`text-xs ${
                    stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    {stat.change}
                  </span>
                  {stat.trend === 'up' ? 
                    <ArrowUpIcon className="w-3 h-3 text-emerald-500" /> : 
                    <ArrowDownIcon className="w-3 h-3 text-red-500" />
                  }
                </div>
              </div>
              <h3 className="mt-3 font-medium">{stat.name}</h3>
              <p className="text-2xl font-semibold mt-1">{stat.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Alerts */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Security Alerts</CardTitle>
              <CardDescription>Recent security events requiring attention</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <SettingsIcon className="mr-2 h-4 w-4" />
              Configure
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityAlerts.map((alert) => (
                <div key={alert.id} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      {alert.level === 'high' ? (
                        <AlertCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                      ) : alert.level === 'medium' ? (
                        <AlertCircleIcon className="h-5 w-5 text-amber-500 mr-2" />
                      ) : (
                        <AlertCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
                      )}
                      <span className="font-medium">{alert.message}</span>
                    </div>
                    <Badge variant={
                      alert.status === 'resolved' ? 'outline' : 
                      alert.status === 'investigating' ? 'secondary' : 'destructive'
                    }>
                      {alert.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                  {alert.status !== 'resolved' && (
                    <div className="mt-2 flex justify-end space-x-2">
                      <Button size="sm" variant="ghost">Ignore</Button>
                      <Button size="sm" variant="default">Investigate</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Storage Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Department Storage</CardTitle>
            <CardDescription>Storage allocation and usage by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentUsage.map((dept) => (
                <div key={dept.department} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{dept.department}</span>
                    <span className="text-sm text-muted-foreground">
                      {dept.used}GB / {dept.total}GB
                    </span>
                  </div>
                  <Progress value={dept.percentage} className="h-2" />
                </div>
              ))}
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Storage</span>
                <span className="text-sm">768GB / 1450GB</span>
              </div>
              <Progress value={53} className="h-2" />
              <div className="text-xs text-muted-foreground">
                53% of total storage capacity used
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <DatabaseIcon className="mr-2 h-4 w-4" />
                Manage Storage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current operational status of system components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border">
              <div className="flex items-center mb-2">
                <CheckCircleIcon className="h-5 w-5 text-emerald-500 mr-2" />
                <span className="font-medium">Authentication Service</span>
              </div>
              <p className="text-xs text-muted-foreground">Operational</p>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center mb-2">
                <CheckCircleIcon className="h-5 w-5 text-emerald-500 mr-2" />
                <span className="font-medium">Document Storage</span>
              </div>
              <p className="text-xs text-muted-foreground">Operational</p>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center mb-2">
                <CheckCircleIcon className="h-5 w-5 text-emerald-500 mr-2" />
                <span className="font-medium">Search Index</span>
              </div>
              <p className="text-xs text-muted-foreground">Operational</p>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center mb-2">
                <CheckCircleIcon className="h-5 w-5 text-emerald-500 mr-2" />
                <span className="font-medium">PDF Processing</span>
              </div>
              <p className="text-xs text-muted-foreground">Operational</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">Last system check: Today at 09:45 AM</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
