
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileTextIcon, FolderIcon, ClockIcon, UsersIcon, ArrowUpRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

// Mock recent activities
const recentActivities = [
  { id: 1, type: 'edit', file: 'Q4 Marketing Plan.docx', time: '2 hours ago', user: 'You' },
  { id: 2, type: 'share', file: 'Budget 2023.xlsx', time: '5 hours ago', user: 'You' },
  { id: 3, type: 'view', file: 'Product Roadmap.pdf', time: 'Yesterday', user: 'Jane Smith' },
  { id: 4, type: 'comment', file: 'Client Presentation.pptx', time: 'Yesterday', user: 'Mark Johnson' },
];

// Mock document categories
const documentCategories = [
  { name: 'Recent Documents', count: 12, icon: ClockIcon, color: 'bg-blue-500' },
  { name: 'My Documents', count: 56, icon: FileTextIcon, color: 'bg-emerald-500' },
  { name: 'Shared with Me', count: 18, icon: UsersIcon, color: 'bg-violet-500' },
  { name: 'Department Folders', count: 7, icon: FolderIcon, color: 'bg-amber-500' },
];

// Activity icon mapping
const activityIcons: Record<string, React.ReactNode> = {
  edit: <FileTextIcon className="w-4 h-4 text-blue-500" />,
  share: <UsersIcon className="w-4 h-4 text-emerald-500" />,
  view: <ClockIcon className="w-4 h-4 text-violet-500" />,
  comment: <FileTextIcon className="w-4 h-4 text-amber-500" />,
};

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {user.name}</h1>
        <p className="text-muted-foreground">Here's an overview of your documents and recent activity.</p>
      </div>
      
      {/* Quick Access Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {documentCategories.map((category) => (
          <Card key={category.name} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={`${category.color} p-2 rounded-md`}>
                  <category.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-semibold">{category.count}</p>
              </div>
              <h3 className="mt-3 font-medium">{category.name}</h3>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full justify-between">
                  <span>View all</span>
                  <ArrowUpRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your document interactions in the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-muted p-2 rounded-md">
                        {activityIcons[activity.type]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.file}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.user} {activity.type === 'edit' ? 'edited' : 
                            activity.type === 'share' ? 'shared' : 
                            activity.type === 'view' ? 'viewed' : 
                            'commented on'} this file
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="link" className="p-0">View all activity</Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common document tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start">
              <FileTextIcon className="mr-2 h-4 w-4" />
              Upload New Document
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FolderIcon className="mr-2 h-4 w-4" />
              Create New Folder
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <UsersIcon className="mr-2 h-4 w-4" />
              Share Document
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <ClockIcon className="mr-2 h-4 w-4" />
              View Version History
            </Button>
            
            <Separator />
            
            <div className="rounded-lg border border-dashed p-4">
              <h4 className="font-medium mb-2">Need help?</h4>
              <p className="text-sm text-muted-foreground mb-4">Check out our documentation for guides and tutorials.</p>
              <Button variant="link" className="p-0 h-auto">Browse Documentation</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
