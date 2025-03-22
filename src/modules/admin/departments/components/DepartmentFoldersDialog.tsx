
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Plus, Folder, FileText, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DepartmentFoldersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: any | null;
}

// Mock data for folders and documents
const mockFolders = [
  { id: '1', name: 'Projetos', documentCount: 5 },
  { id: '2', name: 'Processos', documentCount: 8 },
  { id: '3', name: 'Relatórios', documentCount: 3 },
];

export const DepartmentFoldersDialog: React.FC<DepartmentFoldersDialogProps> = ({ 
  open, 
  onOpenChange, 
  department 
}) => {
  const [folders, setFolders] = useState(mockFolders);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  
  const handleAddFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      documentCount: 0
    };
    
    setFolders([...folders, newFolder]);
    setNewFolderName('');
    toast.success('Pasta adicionada com sucesso');
  };
  
  const handleDeleteFolder = (folderId: string) => {
    setFolders(folders.filter(folder => folder.id !== folderId));
    if (selectedFolder === folderId) {
      setSelectedFolder(null);
    }
    toast.success('Pasta removida com sucesso');
  };
  
  const handleSave = () => {
    // In a real app, you would make an API call here
    console.log('Saving department folders:', folders);
    
    toast.success(`Pastas do departamento ${department?.name} atualizadas com sucesso`);
    onOpenChange(false);
  };
  
  if (!department) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pastas e Documentos: {department.name}</DialogTitle>
          <DialogDescription>
            Gerencie as pastas e documentos associados a este departamento
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          <div className="flex gap-2">
            <Input 
              placeholder="Nome da pasta..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddFolder}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Pasta
            </Button>
          </div>
          
          <div className="rounded-md border max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Documentos</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {folders.map(folder => (
                  <TableRow key={folder.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Folder className="h-4 w-4 mr-2 text-blue-500" />
                        {folder.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{folder.documentCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedFolder(folder.id === selectedFolder ? null : folder.id)}>
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteFolder(folder.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {folders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                      Nenhuma pasta encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
