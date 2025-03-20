
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon, UserX2Icon, EyeIcon } from 'lucide-react';

interface LoginAttempt {
  id: number;
  user: string;
  status: 'success' | 'failed';
  location: string;
  device: string;
  time: string;
  ip: string;
  attempts?: number;
}

interface LoginActivityMonitorProps {
  loginAttempts: LoginAttempt[];
}

const LoginActivityMonitor: React.FC<LoginActivityMonitorProps> = ({ loginAttempts }) => {
  const suspiciousCount = loginAttempts.filter(attempt => attempt.status === 'failed').length;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Login Activity Monitoring</CardTitle>
          <CardDescription>Recent login attempts and suspicious activities</CardDescription>
        </div>
        {suspiciousCount > 0 && (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            {suspiciousCount} Suspicious {suspiciousCount === 1 ? 'Activity' : 'Activities'}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loginAttempts.map((attempt) => (
            <div key={attempt.id} className="p-4 rounded-lg border">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  {attempt.status === 'success' ? (
                    <CheckCircleIcon className="h-5 w-5 text-emerald-500 mr-2" />
                  ) : (
                    <UserX2Icon className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <div>
                    <span className="font-medium">{attempt.user}</span>
                    <p className="text-xs text-muted-foreground">
                      {attempt.ip} • {attempt.location} • {attempt.device}
                    </p>
                  </div>
                </div>
                <Badge variant={attempt.status === 'success' ? 'outline' : 'destructive'}>
                  {attempt.status === 'success' ? 'Successful' : `Failed (${attempt.attempts} attempts)`}
                </Badge>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-muted-foreground">{attempt.time}</p>
                {attempt.status === 'failed' && (
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost">Ignore</Button>
                    <Button size="sm" variant="default">Investigate</Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm">
            <EyeIcon className="mr-2 h-4 w-4" />
            View All Login Attempts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginActivityMonitor;
