
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircleIcon, SettingsIcon } from 'lucide-react';

interface SecurityAlert {
  id: number;
  level: 'high' | 'medium' | 'low';
  message: string;
  time: string;
  status: 'resolved' | 'investigating' | 'unresolved';
}

interface SecurityAlertsProps {
  alerts: SecurityAlert[];
}

const SecurityAlerts: React.FC<SecurityAlertsProps> = ({ alerts }) => {
  return (
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
          {alerts.map((alert) => (
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
  );
};

export default SecurityAlerts;
