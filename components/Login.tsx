

import React, { useState } from 'react';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import Logo from './Logo';

interface LoginProps {
  onLogin: () => void;
}

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l4.43-4.43a1.012 1.012 0 0 1 1.431 0l4.43 4.43a1.012 1.012 0 0 1 0 .639l-4.43 4.43a1.012 1.012 0 0 1-1.431 0l-4.43-4.43z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
    </svg>
);
  
const EyeSlashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L6.228 6.228" />
    </svg>
);

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      onLogin();
    } else {
      setError('Username atau password salah.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <div className="inline-block mb-4">
                <Logo className="w-24 h-24" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Admin Desa
            </h2>
            <p className="mt-2 text-sm text-slate-600">
            Selamat datang kembali, silakan masuk.
            </p>
        </div>

        <Card>
            <form className="space-y-6" onSubmit={handleLogin}>
                <Input
                    label="Username"
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    placeholder="default: admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                    label="Password"
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="default: password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    onIconClick={() => setShowPassword(!showPassword)}
                />

              {error && <p className="text-sm text-red-600 text-center">{error}</p>}

              <div>
                <Button type="submit" className="w-full" size="lg">
                  Masuk
                </Button>
              </div>
            </form>
        </Card>
        <p className="text-center text-xs text-slate-500 mt-8">
            Created by <br />
            <strong>[KKN 2025 IAKN KUPANG]</strong>
        </p>
      </div>
    </div>
  );
};

export default Login;