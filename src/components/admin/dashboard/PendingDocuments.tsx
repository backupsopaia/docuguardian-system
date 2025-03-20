
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClockIcon, FileCheckIcon } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  submitter: string;
  department: string;
  submitted: string;
  priority: 'high' | 'medium' | 'low';
}

interface PendingDocumentsProps {
  documents: Document[];
}

const PendingDocuments: React.FC<PendingDocumentsProps> = ({ documents }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Documents Awaiting Approval</CardTitle>
          <CardDescription>Documents pending review and approval</CardDescription>
        </div>
        <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {documents.length} Pending
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 rounded-lg border">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                <div>
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="font-medium">{doc.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {doc.id} • Submitted by {doc.submitter} • {doc.department}
                  </p>
                </div>
                <Badge 
                  className={`mt-2 sm:mt-0 ${
                    doc.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                    doc.priority === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' : 
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}
                >
                  {doc.priority} priority
                </Badge>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-muted-foreground">Submitted {doc.submitted}</p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">Reject</Button>
                  <Button size="sm" variant="default">
                    <FileCheckIcon className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingDocuments;
