
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, UserCog, ShieldCheck, ShieldAlert, Users, FileCheck, FileX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for roles
const ROLES = [
  {
    id: 1,
    name: 'Administrador',
    description: 'Acesso completo ao sistema',
    userCount: 3,
    isSystem: true,
    permissions: {
      documents: {
        create: true,
        read: true,
        update: true,
        delete: true,
        approve: true
      },
      users: {
        create: true,
        read: true,
        update: true,
        delete: true
      },
      departments: {
        create: true,
        read: true,
        update: true,
        delete: true
      },
      security: {
        roles: true,
        auditLogs: true,
        settings: true
      }
    }
  },
  {
    id: 2,
    name: 'Gerente',
    description: 'Pode gerenciar departamentos e aprovar documentos',
    userCount: 5,
    isSystem: false,
    permissions: {
      documents: {
        create: true,
        read: true,
        update: true,
        delete: false,
        approve: true
      },
      users: {
        create: false,
        read: true,
        update: false,
        delete: false
      },
      departments: {
        create: false,
        read: true,
        update: true,
        delete: false
      },
      security: {
        roles: false,
        auditLogs: true,
        settings: false
      }
    }
  },
  {
    id: 3,
    name: 'Editor',
    description: 'Pode criar e editar documentos',
    userCount: 12,
    isSystem: false,
    permissions: {
      documents: {
        create: true,
        read: true,
        update: true,
        delete: false,
        approve: false
      },
      users: {
        create: false,
        read: true,
        update: false,
        delete: false
      },
      departments: {
        create: false,
        read: true,
        update: false,
        delete: false
      },
      security: {
        roles: false,
        auditLogs: false,
        settings: false
      }
    }
  },
  {
    id: 4,
    name: 'Leitor',
    description: 'Pode apenas visualizar documentos',
    userCount: 25,
    isSystem: false,
    permissions: {
      documents: {
        create: false,
        read: true,
        update: false,
        delete: false,
        approve: false
      },
      users: {
        create: false,
        read: false,
        update: false,
        delete: false
      },
      departments: {
        create: false,
        read: true,
        update: false,
        delete: false
      },
      security: {
        roles: false,
        auditLogs: false,
        settings: false
      }
    }
  }
];

// Mock users for assignment
const USERS = [
  { id: 1, name: 'João Silva', email: 'joao.silva@example.com', role: 'Administrador' },
  { id: 2, name: 'Maria Souza', email: 'maria.souza@example.com', role: 'Gerente' },
  { id: 3, name: 'Pedro Santos', email: 'pedro.santos@example.com', role: 'Editor' },
  { id: 4, name: 'Ana Oliveira', email: 'ana.oliveira@example.com', role: 'Leitor' },
  { id: 5, name: 'Carlos Ferreira', email: 'carlos.ferreira@example.com', role: 'Gerente' },
  { id: 6, name: 'Lucia Pereira', email: 'lucia.pereira@example.com', role: 'Editor' }
];

type Role = typeof ROLES[0];

const RolesPermissions = () => {
  const [roles, setRoles] = useState(ROLES);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const { toast } = useToast();

  const handleAddRole = () => {
    setEditingRole(null);
    setIsDialogOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setIsDialogOpen(true);
  };

  const handleDeleteRole = (roleId: number) => {
    if (confirm('Tem certeza que deseja excluir este papel?')) {
      setRoles(roles.filter(role => role.id !== roleId));
      toast({
        title: "Papel excluído",
        description: "O papel foi removido com sucesso.",
      });
    }
  };

  const handleOpenAssignDialog = (role: Role) => {
    setSelectedRole(role);
    setIsAssignDialogOpen(true);
  };

  const handleSaveRole = (formData: any) => {
    // In a real app, this would save to the backend
    if (editingRole) {
      setRoles(roles.map(role => 
        role.id === editingRole.id ? { ...role, ...formData } : role
      ));
      toast({
        title: "Papel atualizado",
        description: `O papel ${formData.name} foi atualizado com sucesso.`,
      });
    } else {
      const newRole = {
        id: roles.length + 1,
        name: formData.name,
        description: formData.description,
        userCount: 0,
        isSystem: false,
        permissions: formData.permissions
      };
      setRoles([...roles, newRole]);
      toast({
        title: "Papel criado",
        description: `O papel ${formData.name} foi criado com sucesso.`,
      });
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Papéis (Roles)
            </CardTitle>
            <CardDescription>
              Gerenciar papéis e suas permissões no sistema
            </CardDescription>
          </div>
          <Button onClick={handleAddRole}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Papel
          </Button>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Usuários</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>{role.userCount} usuários</TableCell>
                    <TableCell>
                      {role.isSystem ? (
                        <Badge variant="secondary">Sistema</Badge>
                      ) : (
                        <Badge variant="outline">Personalizado</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleOpenAssignDialog(role)}
                        >
                          <Users className="h-4 w-4" />
                          <span className="sr-only">Atribuir</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditRole(role)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        {!role.isSystem && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteRole(role.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Role Editor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRole ? `Editar Papel: ${editingRole.name}` : "Criar Novo Papel"}
            </DialogTitle>
            <DialogDescription>
              {editingRole 
                ? "Atualize os detalhes e permissões deste papel" 
                : "Defina um novo papel com permissões específicas"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role-name">Nome do Papel</Label>
                <Input 
                  id="role-name" 
                  defaultValue={editingRole?.name || ""} 
                  placeholder="Ex: Gerente de Documentos"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-description">Descrição</Label>
                <Input 
                  id="role-description" 
                  defaultValue={editingRole?.description || ""} 
                  placeholder="Ex: Pode gerenciar todos os documentos"
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Permissões</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <FileCheck className="mr-2 h-4 w-4 text-primary" />
                    Documentos
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="doc-create" defaultChecked={editingRole?.permissions.documents.create} />
                      <Label htmlFor="doc-create">Criar</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="doc-read" defaultChecked={editingRole?.permissions.documents.read} />
                      <Label htmlFor="doc-read">Visualizar</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="doc-update" defaultChecked={editingRole?.permissions.documents.update} />
                      <Label htmlFor="doc-update">Editar</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="doc-delete" defaultChecked={editingRole?.permissions.documents.delete} />
                      <Label htmlFor="doc-delete">Excluir</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="doc-approve" defaultChecked={editingRole?.permissions.documents.approve} />
                      <Label htmlFor="doc-approve">Aprovar</Label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Users className="mr-2 h-4 w-4 text-primary" />
                    Usuários
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="user-create" defaultChecked={editingRole?.permissions.users.create} />
                      <Label htmlFor="user-create">Criar</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="user-read" defaultChecked={editingRole?.permissions.users.read} />
                      <Label htmlFor="user-read">Visualizar</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="user-update" defaultChecked={editingRole?.permissions.users.update} />
                      <Label htmlFor="user-update">Editar</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="user-delete" defaultChecked={editingRole?.permissions.users.delete} />
                      <Label htmlFor="user-delete">Excluir</Label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <ShieldAlert className="mr-2 h-4 w-4 text-primary" />
                    Segurança
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="security-roles" defaultChecked={editingRole?.permissions.security.roles} />
                      <Label htmlFor="security-roles">Gerenciar Papéis</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="security-logs" defaultChecked={editingRole?.permissions.security.auditLogs} />
                      <Label htmlFor="security-logs">Ver Logs de Auditoria</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="security-settings" defaultChecked={editingRole?.permissions.security.settings} />
                      <Label htmlFor="security-settings">Configurações de Segurança</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              // Mock implementation of saving
              const formData = {
                name: (document.getElementById('role-name') as HTMLInputElement).value,
                description: (document.getElementById('role-description') as HTMLInputElement).value,
                permissions: {
                  documents: {
                    create: (document.getElementById('doc-create') as HTMLInputElement).checked,
                    read: (document.getElementById('doc-read') as HTMLInputElement).checked,
                    update: (document.getElementById('doc-update') as HTMLInputElement).checked,
                    delete: (document.getElementById('doc-delete') as HTMLInputElement).checked,
                    approve: (document.getElementById('doc-approve') as HTMLInputElement).checked
                  },
                  users: {
                    create: (document.getElementById('user-create') as HTMLInputElement).checked,
                    read: (document.getElementById('user-read') as HTMLInputElement).checked,
                    update: (document.getElementById('user-update') as HTMLInputElement).checked,
                    delete: (document.getElementById('user-delete') as HTMLInputElement).checked
                  },
                  security: {
                    roles: (document.getElementById('security-roles') as HTMLInputElement).checked,
                    auditLogs: (document.getElementById('security-logs') as HTMLInputElement).checked,
                    settings: (document.getElementById('security-settings') as HTMLInputElement).checked
                  }
                }
              };
              handleSaveRole(formData);
            }}>
              {editingRole ? "Salvar alterações" : "Criar papel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Role Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atribuir Papel: {selectedRole?.name}</DialogTitle>
            <DialogDescription>
              Selecione os usuários que terão este papel
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Papel Atual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {USERS.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300" 
                          defaultChecked={user.role === selectedRole?.name}
                        />
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              setIsAssignDialogOpen(false);
              toast({
                title: "Papéis atualizados",
                description: `As atribuições de papel foram atualizadas com sucesso.`,
              });
            }}>
              Salvar atribuições
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RolesPermissions;
