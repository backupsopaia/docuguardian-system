
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { DatabaseIcon } from 'lucide-react';

interface DepartmentUsage {
  department: string;
  used: number;
  total: number;
  percentage: number;
}

interface DepartmentStorageProps {
  departmentUsage: DepartmentUsage[];
  totalUsed: number;
  totalCapacity: number;
}

const DepartmentStorage: React.FC<DepartmentStorageProps> = ({ 
  departmentUsage, 
  totalUsed, 
  totalCapacity 
}) => {
  const totalPercentage = Math.round((totalUsed / totalCapacity) * 100);
  
  return (
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
            <span className="text-sm">{totalUsed}GB / {totalCapacity}GB</span>
          </div>
          <Progress value={totalPercentage} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {totalPercentage}% of total storage capacity used
          </div>
          <Button variant="outline" size="sm" className="w-full">
            <DatabaseIcon className="mr-2 h-4 w-4" />
            Manage Storage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentStorage;
