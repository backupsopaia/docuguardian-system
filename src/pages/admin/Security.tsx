
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SecurityAlerts from '@/components/admin/dashboard/SecurityAlerts';
import LoginActivityMonitor from '@/components/admin/dashboard/LoginActivityMonitor';
import SecuritySettings from '@/components/admin/security/SecuritySettings';
import AuditLogs from '@/components/admin/security/AuditLogs';
import LoginAuditLogs from '@/components/admin/security/LoginAuditLogs';
import RolesPermissions from '@/components/admin/security/RolesPermissions';
import { securityAlerts, loginAttempts } from '@/modules/admin/dashboard/data/security';
import { ShieldCheck, UserCog, AlertTriangle, History, Settings, ServerIcon } from 'lucide-react';
import ApiCommunication from '@/components/admin/security/ApiCommunication';

const Security = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Segurança</h1>
        <p className="text-muted-foreground">
          Gerencie configurações de segurança e monitore atividades suspeitas.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4" />
            Papéis e Permissões
          </TabsTrigger>
          <TabsTrigger value="login-logs" className="flex items-center gap-1">
            <UserCog className="h-4 w-4" />
            Logs de Login
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            Logs de Auditoria
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-1">
            <ServerIcon className="h-4 w-4" />
            API Comunicação
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <SecurityAlerts alerts={securityAlerts} />
            <LoginActivityMonitor loginAttempts={loginAttempts} />
          </div>
        </TabsContent>

        <TabsContent value="roles">
          <RolesPermissions />
        </TabsContent>

        <TabsContent value="login-logs">
          <LoginAuditLogs />
        </TabsContent>

        <TabsContent value="logs">
          <AuditLogs />
        </TabsContent>

        <TabsContent value="settings">
          <SecuritySettings />
        </TabsContent>
        
        <TabsContent value="api">
          <ApiCommunication />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Security;
