
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Shield, CalendarDays, LucideMousePointer2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

const formSchema = z.object({
  ipRestriction: z.boolean(),
  allowedIps: z.string().optional(),
  timeRestriction: z.boolean(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  dayRestriction: z.boolean(),
  allowedDays: z.array(z.string()),
  allowDownload: z.boolean(),
  allowUpload: z.boolean(),
  allowShare: z.boolean(),
  allowEdit: z.boolean(),
  allowDelete: z.boolean(),
});

interface AccessRestrictionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any | null;
}

export const AccessRestrictionsDialog: React.FC<AccessRestrictionsDialogProps> = ({ 
  open, 
  onOpenChange, 
  user 
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ipRestriction: false,
      allowedIps: '',
      timeRestriction: false,
      startTime: '08:00',
      endTime: '18:00',
      dayRestriction: false,
      allowedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      allowDownload: true,
      allowUpload: true,
      allowShare: true,
      allowEdit: true,
      allowDelete: false,
    },
  });
  
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, you would make an API call here
    console.log(values);
    
    toast.success(`Permissões e restrições de ${user?.name} atualizadas com sucesso`);
    
    onOpenChange(false);
  };
  
  const watchIpRestriction = form.watch('ipRestriction');
  const watchTimeRestriction = form.watch('timeRestriction');
  const watchDayRestriction = form.watch('dayRestriction');
  
  const days = [
    { id: 'monday', label: 'Segunda-feira' },
    { id: 'tuesday', label: 'Terça-feira' },
    { id: 'wednesday', label: 'Quarta-feira' },
    { id: 'thursday', label: 'Quinta-feira' },
    { id: 'friday', label: 'Sexta-feira' },
    { id: 'saturday', label: 'Sábado' },
    { id: 'sunday', label: 'Domingo' },
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Permissões e Restrições de Acesso</DialogTitle>
          <DialogDescription>
            Configure permissões e restrições de acesso para {user?.name}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
            <Tabs defaultValue="restrictions">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="restrictions">
                  <Shield className="mr-2 h-4 w-4" />
                  Restrições de Acesso
                </TabsTrigger>
                <TabsTrigger value="permissions">
                  <LucideMousePointer2 className="mr-2 h-4 w-4" />
                  Permissões de Ação
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="restrictions" className="space-y-4 py-4">
                <Card>
                  <CardContent className="pt-6">
                    {/* IP Restriction */}
                    <FormField
                      control={form.control}
                      name="ipRestriction"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3 mb-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center">
                              <FormLabel className="text-base">Restrição por IP</FormLabel>
                            </div>
                            <FormDescription>
                              Restringir acesso apenas a endereços IP específicos
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {watchIpRestriction && (
                      <FormField
                        control={form.control}
                        name="allowedIps"
                        render={({ field }) => (
                          <FormItem className="ml-4 mb-4">
                            <FormLabel>IPs Permitidos</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Ex: 192.168.1.1, 10.0.0.1"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Insira os endereços IP permitidos, separados por vírgula
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    {/* Time Restriction */}
                    <FormField
                      control={form.control}
                      name="timeRestriction"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3 mb-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              <FormLabel className="text-base">Restrição por Horário</FormLabel>
                            </div>
                            <FormDescription>
                              Permitir acesso apenas em horários específicos
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {watchTimeRestriction && (
                      <div className="grid grid-cols-2 gap-4 ml-4 mb-4">
                        <FormField
                          control={form.control}
                          name="startTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Horário Inicial</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="endTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Horário Final</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    
                    {/* Day Restriction */}
                    <FormField
                      control={form.control}
                      name="dayRestriction"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3 mb-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center">
                              <CalendarDays className="mr-2 h-4 w-4" />
                              <FormLabel className="text-base">Restrição por Dia da Semana</FormLabel>
                            </div>
                            <FormDescription>
                              Permitir acesso apenas em dias específicos da semana
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {watchDayRestriction && (
                      <div className="ml-4">
                        <FormField
                          control={form.control}
                          name="allowedDays"
                          render={() => (
                            <FormItem>
                              <div className="mb-2">
                                <FormLabel>Dias Permitidos</FormLabel>
                              </div>
                              <div className="space-y-2">
                                {days.map((day) => (
                                  <FormField
                                    key={day.id}
                                    control={form.control}
                                    name="allowedDays"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={day.id}
                                          className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(day.id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, day.id])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) => value !== day.id
                                                      )
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            {day.label}
                                          </FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="permissions" className="py-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <FormField
                      control={form.control}
                      name="allowDownload"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Permissão para Download</FormLabel>
                            <FormDescription>
                              Permitir que o usuário faça download de documentos
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="allowUpload"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Permissão para Upload</FormLabel>
                            <FormDescription>
                              Permitir que o usuário faça upload de documentos
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="allowShare"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Permissão para Compartilhamento</FormLabel>
                            <FormDescription>
                              Permitir que o usuário compartilhe documentos
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="allowEdit"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Permissão para Edição</FormLabel>
                            <FormDescription>
                              Permitir que o usuário edite documentos
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="allowDelete"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Permissão para Exclusão</FormLabel>
                            <FormDescription>
                              Permitir que o usuário exclua documentos
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Configurações
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
