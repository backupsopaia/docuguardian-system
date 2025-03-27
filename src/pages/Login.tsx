
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { EyeIcon, EyeOffIcon, KeyIcon, MailIcon, ShieldIcon } from 'lucide-react';
import { useAuth } from '@/modules/auth';
import Logo from '@/components/Logo';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { useHelp } from '@/context/HelpContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading, error } = useAuth();
  const { showContextHelp } = useHelp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password, rememberMe);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-dms-blue-light to-dms-blue-dark">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <h2 className="text-2xl font-medium text-white mb-2">Secure Document Management</h2>
          <p className="text-dms-neutral-300">Enterprise-grade security for your documents</p>
        </div>
        
        <Card className="w-full backdrop-blur-sm bg-white/10 border-white/20 text-white shadow-xl animate-fade-in relative">
          <div className="absolute right-3 top-3">
            <HelpTooltip 
              helpId="login" 
              className="text-white/70 hover:text-white" 
              text="Clique para mais informações sobre a tela de login"
            />
          </div>
          
          <CardHeader>
            <CardTitle className="text-xl font-medium">Sign In</CardTitle>
            <CardDescription className="text-dms-neutral-300">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email" className="text-dms-neutral-200">Email</Label>
                  <HelpTooltip 
                    helpId="login-email" 
                    text="Digite seu email de acesso. Para teste, use admin@docuguardian.com" 
                    side="top"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-dms-neutral-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-dms-neutral-400"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-dms-neutral-200">Password</Label>
                  <HelpTooltip 
                    helpId="login-password" 
                    text="Digite sua senha. Para teste, use admin123 ou user123" 
                    side="top"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyIcon className="h-5 w-5 text-dms-neutral-400" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-dms-neutral-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5 text-dms-neutral-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-dms-neutral-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary border-white/20"
                  />
                  <Label htmlFor="remember" className="text-sm text-dms-neutral-300">Remember me</Label>
                </div>
                <Link to="/forgot-password" className="text-sm text-dms-neutral-300 hover:text-white transition-colors">
                  Forgot password?
                </Link>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-dms-blue text-white hover:bg-dms-blue-light transition-colors flex items-center justify-center" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <ShieldIcon className="mr-2 h-4 w-4" />
                    Sign in securely
                  </span>
                )}
              </Button>
              
              <div className="text-center text-sm text-dms-neutral-300">
                <span>Demo credentials: </span>
                <button 
                  type="button" 
                  onClick={() => {setEmail('admin@docuguardian.com'); setPassword('admin123')}}
                  className="text-primary hover:underline"
                >
                  Admin
                </button>
                <span> | </span>
                <button 
                  type="button" 
                  onClick={() => {setEmail('user@docuguardian.com'); setPassword('user123')}}
                  className="text-primary hover:underline"
                >
                  User
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-6 text-center text-sm text-dms-neutral-300">
          <span>© 2023 DocuGuardian. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
