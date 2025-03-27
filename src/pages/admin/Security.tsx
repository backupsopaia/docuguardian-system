
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SecurityAlerts from '@/components/admin/dashboard/SecurityAlerts';
import LoginActivityMonitor from '@/components/admin/dashboard/LoginActivityMonitor';
import SecuritySettings from '@/components/admin/security/SecuritySettings';
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
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <SecurityAlerts alerts={securityAlerts} />
            <LoginActivityMonitor loginAttempts={loginAttempts} />
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Auditoria</CardTitle>
              <CardDescription>Registros detalhados de atividades de segurança no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Os logs de auditoria serão exibidos aqui. Eles fornecem informações detalhadas sobre ações de usuários, 
                alterações de configuração e eventos de segurança.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Security;
