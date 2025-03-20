
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CloudIcon,
  FolderOpenIcon,
  UploadIcon,
  FolderIcon,
  FileIcon,
  ImageIcon,
  FileTextIcon,
  MoreHorizontalIcon,
  PlusIcon,
  RefreshCwIcon,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock storage providers and usage data
const storageProviders = [
  { id: 'gdrive', name: 'Google Drive', icon: CloudIcon, color: 'text-blue-500', usage: 75, capacity: '15 GB' },
  { id: 'onedrive', name: 'OneDrive', icon: CloudIcon, color: 'text-blue-600', usage: 45, capacity: '5 GB' },
  { id: 's3', name: 'AWS S3', icon: CloudIcon, color: 'text-yellow-600', usage: 20, capacity: '100 GB' },
  { id: 'azure', name: 'Azure Storage', icon: CloudIcon, color: 'text-blue-400', usage: 10, capacity: '50 GB' },
];

// Mock folders
const folders = [
  { id: 1, name: 'Documents', fileCount: 24, icon: FolderIcon },
  { id: 2, name: 'Images', fileCount: 128, icon: FolderIcon },
  { id: 3, name: 'Projects', fileCount: 16, icon: FolderIcon },
  { id: 4, name: 'Backups', fileCount: 8, icon: FolderIcon },
  { id: 5, name: 'Marketing', fileCount: 32, icon: FolderIcon },
  { id: 6, name: 'Reports', fileCount: 20, icon: FolderIcon },
];

// Mock recent files
const recentFiles = [
  { id: 1, name: 'Annual Report.pdf', type: 'PDF', size: '4.2 MB', icon: FileTextIcon, modified: '2 hours ago' },
  { id: 2, name: 'Product Image.png', type: 'Image', size: '2.8 MB', icon: ImageIcon, modified: 'Yesterday' },
  { id: 3, name: 'Team Data.xlsx', type: 'Spreadsheet', size: '1.5 MB', icon: FileIcon, modified: '2 days ago' },
  { id: 4, name: 'Project Brief.docx', type: 'Document', size: '650 KB', icon: FileTextIcon, modified: '3 days ago' },
  { id: 5, name: 'Marketing Presentation.pptx', type: 'Presentation', size: '8.2 MB', icon: FileIcon, modified: '5 days ago' },
];

const StoragePage: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Cloud Storage</h1>
          <p className="text-muted-foreground">Manage your documents across multiple cloud providers</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button className="flex-1 md:flex-none">
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
          <Button variant="outline" className="flex-1 md:flex-none">
            <FolderOpenIcon className="mr-2 h-4 w-4" />
            New Folder
          </Button>
          <Button size="icon" variant="ghost">
            <RefreshCwIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="allFiles" className="w-full">
        <TabsList className="w-full max-w-md grid grid-cols-3">
          <TabsTrigger value="allFiles">All Files</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="allFiles" className="space-y-6 mt-6">
          {/* Storage Statistics Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Storage Overview</CardTitle>
              <CardDescription>Manage your cloud storage capacity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {storageProviders.map((provider) => (
                  <div key={provider.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <provider.icon className={`h-5 w-5 ${provider.color} mr-2`} />
                        <span className="font-medium">{provider.name}</span>
                      </div>
                    </div>
                    <Progress value={provider.usage} className="h-2 mb-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{provider.usage}% used</span>
                      <span>{provider.capacity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Folders */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Folders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {folders.map((folder) => (
                  <div key={folder.id} className="border rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer flex flex-col items-center text-center">
                    <folder.icon className="h-12 w-12 text-muted-foreground mb-2" />
                    <span className="font-medium truncate w-full">{folder.name}</span>
                    <span className="text-xs text-muted-foreground">{folder.fileCount} files</span>
                  </div>
                ))}
                <div className="border border-dashed rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer flex flex-col items-center justify-center text-center h-full">
                  <Button size="icon" variant="ghost">
                    <PlusIcon className="h-10 w-10 text-muted-foreground" />
                  </Button>
                  <span className="text-sm text-muted-foreground mt-2">Add Folder</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Files */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentFiles.map((file) => (
                  <div 
                    key={file.id} 
                    className="flex items-center justify-between py-2 px-3 hover:bg-accent rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <file.icon className="h-8 w-8 text-muted-foreground p-1.5 bg-muted rounded" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.type} • {file.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground hidden sm:inline">{file.modified}</span>
                      <Button size="icon" variant="ghost">
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shared" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Shared Files</CardTitle>
              <CardDescription>Files and folders shared with you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 text-center">
                <div className="max-w-sm">
                  <p className="text-muted-foreground">No files have been shared with you yet.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="providers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Storage Providers</CardTitle>
              <CardDescription>Connect and manage your cloud storage providers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {storageProviders.map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between border rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <provider.icon className={`h-8 w-8 ${provider.color}`} />
                      <div>
                        <p className="font-medium">{provider.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Progress value={provider.usage} className="h-2 w-24" />
                          <span className="text-xs text-muted-foreground">{provider.usage}% of {provider.capacity}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                ))}
                <Button className="w-full">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Connect New Provider
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoragePage;
