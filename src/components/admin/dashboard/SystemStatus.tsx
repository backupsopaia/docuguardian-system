
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircleIcon } from 'lucide-react';

interface SystemStatusProps {
  lastChecked: string;
}

const SystemStatus: React.FC<SystemStatusProps> = ({ lastChecked }) => {
  const services = [
    { name: 'Authentication Service', status: 'Operational' },
    { name: 'Document Storage', status: 'Operational' },
    { name: 'Search Index', status: 'Operational' },
    { name: 'PDF Processing', status: 'Operational' },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>Current operational status of system components</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <div key={service.name} className="p-4 rounded-lg border">
              <div className="flex items-center mb-2">
                <CheckCircleIcon className="h-5 w-5 text-emerald-500 mr-2" />
                <span className="font-medium">{service.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{service.status}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">Last system check: {lastChecked}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;
