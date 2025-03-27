
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeBlock } from '@/components/ui/code-block';
import { 
  ServerIcon, 
  ShieldIcon, 
  ArrowRightIcon, 
  ArrowLeftIcon, 
  RefreshCwIcon,
  PlusCircleIcon,
  PencilIcon,
  TrashIcon
} from 'lucide-react';

const ApiCommunication = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldIcon className="h-5 w-5 text-primary" />
            <CardTitle>Autenticação</CardTitle>
          </div>
          <CardDescription>
            Fluxo de autenticação e comunicação com o backend
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="info" className="bg-blue-50 border-blue-200">
            <ServerIcon className="h-4 w-4" />
            <AlertTitle>Fluxo de Autenticação</AlertTitle>
            <AlertDescription>
              <ol className="list-decimal pl-5 space-y-2 mt-2">
                <li>Frontend envia credenciais para <code>POST /api/auth/login</code></li>
                <li>Backend valida e retorna token JWT</li>
                <li>Frontend armazena token na memória e localStorage (se "lembrar-me")</li>
                <li>Token é enviado em todas as requisições subsequentes</li>
                <li>Token expira após tempo determinado e é renovado automaticamente</li>
              </ol>
            </AlertDescription>
          </Alert>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Exemplo de requisição de login:</h3>
            <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto text-xs">
              {`// Requisição
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "rememberMe": true
}

// Resposta
{
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "id": "123",
    "name": "Nome do Usuário",
    "email": "usuario@exemplo.com",
    "role": "admin"
  },
  "expiresAt": 1687654321000
}`}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ServerIcon className="h-5 w-5 text-primary" />
            <CardTitle>Comunicação API</CardTitle>
          </div>
          <CardDescription>
            Métodos HTTP utilizados e formato de respostas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="get" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="get" className="flex items-center gap-1">
                <RefreshCwIcon className="h-4 w-4" />
                GET
              </TabsTrigger>
              <TabsTrigger value="post" className="flex items-center gap-1">
                <PlusCircleIcon className="h-4 w-4" />
                POST
              </TabsTrigger>
              <TabsTrigger value="put" className="flex items-center gap-1">
                <PencilIcon className="h-4 w-4" />
                PUT
              </TabsTrigger>
              <TabsTrigger value="delete" className="flex items-center gap-1">
                <TrashIcon className="h-4 w-4" />
                DELETE
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="get" className="space-y-4">
              <Alert>
                <AlertTitle>GET - Busca de Dados</AlertTitle>
                <AlertDescription>
                  Utilizado para recuperar recursos e dados do servidor.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Exemplos:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><code>GET /api/documents</code> - Lista de documentos</li>
                  <li><code>GET /api/users</code> - Lista de usuários</li>
                  <li><code>GET /api/departments</code> - Lista de departamentos</li>
                  <li><code>GET /api/login-logs</code> - Logs de autenticação</li>
                  <li><code>GET /api/roles</code> - Lista de papéis disponíveis</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Exemplo de requisição com autenticação:</h3>
                <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto text-xs">
                  {`// Requisição
GET /api/documents?page=1&limit=10&sort=createdAt&order=desc
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInT...

// Resposta
{
  "data": [
    {
      "id": "1",
      "title": "Documento 1",
      "createdAt": "2023-05-20T10:00:00Z"
    },
    // ...mais documentos
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}`}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="post" className="space-y-4">
              <Alert>
                <AlertTitle>POST - Criação de Recursos</AlertTitle>
                <AlertDescription>
                  Utilizado para criar novos recursos ou enviar dados para processamento.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Exemplos:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><code>POST /api/documents</code> - Criar novo documento</li>
                  <li><code>POST /api/users</code> - Registrar novo usuário</li>
                  <li><code>POST /api/documents/share</code> - Compartilhar documento</li>
                  <li><code>POST /api/roles/assign</code> - Atribuir papel a usuário</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Exemplo de requisição com autenticação:</h3>
                <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto text-xs">
                  {`// Requisição
POST /api/documents
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInT...
Content-Type: application/json

{
  "title": "Novo Documento",
  "content": "Conteúdo do documento",
  "departmentId": "123"
}

// Resposta
{
  "id": "456",
  "title": "Novo Documento",
  "content": "Conteúdo do documento",
  "departmentId": "123",
  "createdAt": "2023-05-21T15:30:00Z"
}`}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="put" className="space-y-4">
              <Alert>
                <AlertTitle>PUT - Atualização de Recursos</AlertTitle>
                <AlertDescription>
                  Utilizado para atualizar recursos existentes.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Exemplos:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><code>PUT /api/documents/456</code> - Atualizar documento</li>
                  <li><code>PUT /api/users/123</code> - Atualizar usuário</li>
                  <li><code>PUT /api/documents/456/status</code> - Mudar status de documento</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Exemplo de requisição com autenticação:</h3>
                <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto text-xs">
                  {`// Requisição
PUT /api/documents/456
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInT...
Content-Type: application/json

{
  "title": "Documento Atualizado",
  "content": "Novo conteúdo"
}

// Resposta
{
  "id": "456",
  "title": "Documento Atualizado",
  "content": "Novo conteúdo",
  "updatedAt": "2023-05-22T09:45:00Z"
}`}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="delete" className="space-y-4">
              <Alert>
                <AlertTitle>DELETE - Remoção de Recursos</AlertTitle>
                <AlertDescription>
                  Utilizado para remover recursos do sistema.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Exemplos:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><code>DELETE /api/documents/456</code> - Excluir documento</li>
                  <li><code>DELETE /api/users/123</code> - Remover usuário</li>
                  <li><code>DELETE /api/settings/notification/5</code> - Remover configuração</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Exemplo de requisição com autenticação:</h3>
                <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto text-xs">
                  {`// Requisição
DELETE /api/documents/456
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInT...

// Resposta
{
  "success": true,
  "message": "Documento removido com sucesso"
}`}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <RefreshCwIcon className="h-5 w-5 text-primary" />
            <CardTitle>Eventos em Tempo Real</CardTitle>
          </div>
          <CardDescription>
            WebSockets para notificações e atualizações em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTitle>WebSockets</AlertTitle>
            <AlertDescription>
              Além das requisições HTTP tradicionais, a aplicação pode utilizar WebSockets para eventos em tempo real.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Exemplos de eventos:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Notificação de novo documento atribuído</li>
              <li>Alerta de tentativa de login suspeita</li>
              <li>Atualização de status de documento em tempo real</li>
              <li>Notificação de comentário em documento compartilhado</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Exemplo de conexão WebSocket:</h3>
            <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto text-xs">
              {`// Conexão
const socket = new WebSocket('wss://api.exemplo.com/ws?token=eyJhbGciOiJIUzI1...');

// Receber eventos
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'DOCUMENT_ASSIGNED':
      // Mostrar notificação
      break;
    case 'LOGIN_ATTEMPT':
      // Atualizar logs
      break;
  }
};

// Enviar mensagem
socket.send(JSON.stringify({
  type: 'SUBSCRIBE',
  channel: 'document_updates',
  documentId: '456'
}));`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiCommunication;
