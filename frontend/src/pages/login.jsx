import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth.js";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { useToast } from "@/hooks/use-toast.js";

export default function LoginPage() {
  const { login, register, isLoggingIn, isRegistering } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ fullName: "", email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    try { 
      await login({ email: loginForm.email, password: loginForm.password }); 
      toast({ title: "Welcome back!", description: "Successfully signed in." });
      setLocation("/");
    }
    catch (err) { 
      toast({ 
        title: "Login failed", 
        description: err.response?.data?.message || err.message, 
        variant: "destructive" 
      }); 
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try { 
      await register({ 
        fullName: registerForm.fullName, 
        email: registerForm.email, 
        password: registerForm.password 
      }); 
      toast({ title: "Account created!", description: "Welcome to OrderFlow." });
      setLocation("/");
    }
    catch (err) { 
      toast({ 
        title: "Registration failed", 
        description: err.response?.data?.message || err.message, 
        variant: "destructive" 
      }); 
    }
  };


  const isLoading = isLoggingIn || isRegistering;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">O</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">OrderFlow</h1>
          </div>
          <p className="text-muted-foreground">Social commerce order management for Moroccan & African merchants</p>
        </div>

        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Create Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Sign in to your OrderFlow account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="you@example.com" 
                      value={loginForm.email} 
                      onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input 
                      id="login-password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={loginForm.password} 
                      onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))} 
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoggingIn ? "Signing in…" : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create your account</CardTitle>
                <CardDescription>Start managing your orders today</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Full Name</Label>
                    <Input 
                      id="reg-name" 
                      placeholder="Ahmed Benali" 
                      value={registerForm.fullName} 
                      onChange={(e) => setRegisterForm((f) => ({ ...f, fullName: e.target.value }))} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input 
                      id="reg-email" 
                      type="email" 
                      placeholder="you@example.com" 
                      value={registerForm.email} 
                      onChange={(e) => setRegisterForm((f) => ({ ...f, email: e.target.value }))} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input 
                      id="reg-password" 
                      type="password" 
                      placeholder="Min. 6 characters" 
                      value={registerForm.password} 
                      onChange={(e) => setRegisterForm((f) => ({ ...f, password: e.target.value }))} 
                      required 
                      minLength={6} 
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isRegistering ? "Creating account…" : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <p className="text-center text-xs text-muted-foreground">OrderFlow SaaS - All Rights Reserved</p>
      </div>
    </div>
  );
}

