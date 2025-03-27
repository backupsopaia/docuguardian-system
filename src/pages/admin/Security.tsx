
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SecurityAlerts from '@/components/admin/dashboard/SecurityAlerts';
import LoginActivityMonitor from '@/components/admin/dashboard/LoginActivityMonitor';
import SecuritySettings from '@/components/admin/security/SecuritySettings';
import AuditLogs from '@/components/admin/security/AuditLogs';
import { securityAlerts, loginAttempts } from '@/modules/admin/dashboard/data/security';

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
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="logs">Logs de Auditoria</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <SecurityAlerts alerts={securityAlerts} />
            <LoginActivityMonitor loginAttempts={loginAttempts} />
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <AuditLogs />
        </TabsContent>

        <TabsContent value="settings">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Security;
