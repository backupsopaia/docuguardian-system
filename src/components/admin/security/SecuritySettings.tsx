
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ShieldAlertIcon, KeyIcon, LockIcon, RefreshCwIcon } from 'lucide-react';

const SecuritySettings = () => {
  const handleGenerateNewKey = () => {
    // Logic to generate new API key would go here
    alert('Esta funcionalidade geraria uma nova chave de API em um sistema real.');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <LockIcon className="h-5 w-5 text-primary" />
            <CardTitle>Autenticação</CardTitle>
          </div>
          <CardDescription>
            Configure os métodos de autenticação e políticas de senhas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="mfa">Autenticação de dois fatores (MFA)</Label>
                <p className="text-sm text-muted-foreground">
                  Exigir autenticação de dois fatores para todos os usuários
                </p>
              </div>
              <Switch id="mfa" />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="password-expiry">Expiração de senhas</Label>
                <p className="text-sm text-muted-foreground">
                  Forçar alteração de senha a cada 90 dias
                </p>
              </div>
              <Switch id="password-expiry" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sso">Login único (SSO)</Label>
                <p className="text-sm text-muted-foreground">
                  Permitir autenticação via provedores externos (Google, Microsoft)
                </p>
              </div>
              <Switch id="sso" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlertIcon className="h-5 w-5 text-primary" />
            <CardTitle>Proteção contra ameaças</CardTitle>
          </div>
          <CardDescription>
            Configure as proteções contra acesso não autorizado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ip-blocking">Bloqueio automático de IPs suspeitos</Label>
                <p className="text-sm text-muted-foreground">
                  Bloquear IPs após 5 tentativas de login malsucedidas
                </p>
              </div>
              <Switch id="ip-blocking" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="session-timeout">Timeout de sessão</Label>
                <p className="text-sm text-muted-foreground">
                  Encerrar sessões inativas após 30 minutos
                </p>
              </div>
              <Switch id="session-timeout" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="device-verification">Verificação de dispositivos</Label>
                <p className="text-sm text-muted-foreground">
                  Exigir confirmação para novos dispositivos
                </p>
              </div>
              <Switch id="device-verification" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <KeyIcon className="h-5 w-5 text-primary" />
            <CardTitle>Chaves de API</CardTitle>
          </div>
          <CardDescription>
            Gerencie chaves de API para integrações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Chave de API atual</p>
                <p className="font-mono text-xs bg-background p-1 rounded">sk_live_xxxxxxxxxxxxxxxxxxxxx</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Última atualização: 15 de agosto de 2023
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={handleGenerateNewKey}>
                <RefreshCwIcon className="mr-2 h-4 w-4" />
                Gerar nova chave
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
