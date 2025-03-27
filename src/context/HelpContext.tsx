
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

type HelpContextType = {
  helpMode: boolean;
  toggleHelpMode: () => void;
  showContextHelp: (helpId: string) => void;
};

const HelpContext = createContext<HelpContextType | undefined>(undefined);

// Collection of help tips for different pages and elements
const helpTips: Record<string, { title: string; description: string }> = {
  // Login page
  'login': {
    title: 'Bem-vindo ao DocuGuardian',
    description: 'Use as credenciais fornecidas para acessar o sistema como administrador ou usuário padrão.'
  },
  'login-email': {
    title: 'Email de acesso',
    description: 'Insira o email associado à sua conta. Para teste, use admin@docuguardian.com (admin) ou user@docuguardian.com (usuário).'
  },
  'login-password': {
    title: 'Senha',
    description: 'Digite sua senha. Para teste, use admin123 (admin) ou user123 (usuário).'
  },
  
  // Dashboard
  'dashboard': {
    title: 'Painel Principal',
    description: 'Aqui você pode visualizar estatísticas e dados resumidos do sistema.'
  },
  'dashboard-stats': {
    title: 'Estatísticas',
    description: 'Estes cartões mostram métricas importantes como documentos pendentes, armazenamento disponível e mais.'
  },
  
  // Documents
  'documents': {
    title: 'Gestão de Documentos',
    description: 'Gerencie todos os documentos do sistema, com opções para filtrar por status.'
  },
  'documents-table': {
    title: 'Tabela de Documentos',
    description: 'Veja os documentos listados com opções para visualizar, aprovar, rejeitar, arquivar ou excluir.'
  },
  'documents-actions': {
    title: 'Ações de Documentos',
    description: 'Clique nos ícones para realizar ações como aprovar (✓), rejeitar (×), visualizar (👁️) ou mais opções (⋮).'
  },
  'documents-view': {
    title: 'Visualizar Documento',
    description: 'Abre o documento para visualização detalhada. Você poderá ver o conteúdo completo e metadados associados.'
  },
  'documents-approve': {
    title: 'Aprovar Documento',
    description: 'Marca o documento como aprovado, tornando-o disponível para uso no sistema. Esta ação pode requerer permissões especiais.'
  },
  'documents-reject': {
    title: 'Rejeitar Documento',
    description: 'Marca o documento como rejeitado, indicando que ele não atende aos requisitos necessários. É possível adicionar um motivo para rejeição.'
  },
  'documents-archive': {
    title: 'Arquivar Documento',
    description: 'Move o documento para o arquivo, mantendo-o no sistema mas removendo-o das listas ativas. Documentos arquivados podem ser restaurados posteriormente.'
  },
  'documents-restore': {
    title: 'Restaurar Documento',
    description: 'Retorna um documento arquivado para seu status anterior, tornando-o novamente visível nas listas ativas.'
  },
  'documents-delete': {
    title: 'Excluir Documento',
    description: 'Remove permanentemente o documento do sistema. Esta ação não pode ser desfeita e requer confirmação.'
  },
  'documents-more-actions': {
    title: 'Mais Ações',
    description: 'Opções adicionais disponíveis para este documento, como download, edição ou compartilhamento.'
  },
  
  // Storage
  'storage': {
    title: 'Armazenamento',
    description: 'Visualize o uso de armazenamento por departamento e tipos de arquivo.'
  },
  
  // Security
  'security': {
    title: 'Configurações de Segurança',
    description: 'Gerencie permissões, logs de acesso e configurações de segurança do sistema.'
  },
  'security-roles': {
    title: 'Papéis e Permissões',
    description: 'Configure quais ações cada papel de usuário pode realizar no sistema.'
  },
  'security-logs': {
    title: 'Logs de Auditoria',
    description: 'Visualize tentativas de login e ações importantes realizadas no sistema.'
  },
  'security-api': {
    title: 'Comunicação API',
    description: 'Documentação sobre como o frontend se comunica com o backend.'
  },
  
  // Users
  'users': {
    title: 'Gestão de Usuários',
    description: 'Adicione, edite ou remova usuários do sistema.'
  },
  'users-add': {
    title: 'Adicionar Usuário',
    description: 'Preencha os campos para criar um novo usuário no sistema.'
  },
  
  // Departments
  'departments': {
    title: 'Gestão de Departamentos',
    description: 'Gerencie departamentos da organização e suas configurações.'
  }
};

export const HelpProvider = ({ children }: { children: React.ReactNode }) => {
  const [helpMode, setHelpMode] = useState(false);
  const location = useLocation();
  
  // Show context-specific help when path changes if helpMode is on
  useEffect(() => {
    if (helpMode) {
      // Extract the last part of the path to identify the current page
      const pathSegments = location.pathname.split('/');
      const currentPage = pathSegments[pathSegments.length - 1] || 'dashboard';
      
      // Show the relevant help tip for the current page
      const helpTip = helpTips[currentPage];
      if (helpTip) {
        toast({
          variant: "help",
          title: helpTip.title,
          description: helpTip.description,
          duration: 8000,
        });
      }
    }
  }, [location.pathname, helpMode]);
  
  const toggleHelpMode = () => {
    const newHelpMode = !helpMode;
    setHelpMode(newHelpMode);
    
    if (newHelpMode) {
      toast({
        variant: "help",
        title: "Modo de Ajuda Ativado",
        description: "Dicas contextuais serão exibidas automaticamente enquanto você navega pelo sistema. Clique no botão de ajuda novamente para desativar.",
        duration: 5000,
      });
    } else {
      toast({
        variant: "default",
        title: "Modo de Ajuda Desativado",
        description: "As dicas contextuais não serão mais exibidas automaticamente.",
        duration: 3000,
      });
    }
  };
  
  const showContextHelp = (helpId: string) => {
    const helpTip = helpTips[helpId];
    if (helpTip) {
      toast({
        variant: "help",
        title: helpTip.title,
        description: helpTip.description,
        duration: 5000,
      });
    }
  };
  
  return (
    <HelpContext.Provider value={{ helpMode, toggleHelpMode, showContextHelp }}>
      {children}
    </HelpContext.Provider>
  );
};

export const useHelp = () => {
  const context = useContext(HelpContext);
  if (context === undefined) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
};
