
import React, { useState } from 'react';
import { UserRole } from '../types';
import { supabase } from '../supabase';

interface LoginScreenProps {
    onLogin: (role: UserRole) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
        setError('');
    };

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            role: selectedRole || 'admin'
                        }
                    }
                });
                if (error) throw error;
                if (data.user) {
                    alert('Registro exitoso. Por favor, revisa tu correo para confirmar (si está habilitado) o intenta iniciar sesión.');
                    setIsSignUp(false);
                }
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                if (error) throw error;
                if (data.user) {
                    const role = (data.user.user_metadata?.role as UserRole) || 'admin';
                    onLogin(role);
                }
            }
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error durante la autenticación.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleCancel = () => {
        setSelectedRole(null);
        setError('');
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-cream p-4">
            <div className="w-full max-w-md bg-white p-8 sm:p-12 rounded-2xl shadow-2xl transition-all duration-300">
                <h1 className="text-4xl sm:text-5xl font-serif font-bold text-cocoa-brown mb-4 text-center">
                    Acceso Administrativo
                </h1>

                {!selectedRole ? (
                    <>
                        <p className="text-muted-mauve mb-10 text-center">
                            Por favor, selecciona tu rol para continuar.
                        </p>
                        <div className="space-y-4">
                            <LoginButton 
                                onClick={() => handleRoleSelect('admin')} 
                                text="Entrar como Administrador" 
                                bgColor="bg-cocoa-brown" 
                                hoverColor="hover:bg-opacity-80"
                            />
                            <LoginButton 
                                onClick={() => handleRoleSelect('superadmin')} 
                                text="Entrar como Superadministrador" 
                                bgColor="bg-gray-700" 
                                hoverColor="hover:bg-gray-600"
                            />
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleAuthSubmit} className="space-y-4">
                        <p className="text-muted-mauve mb-6 text-center">
                            {isSignUp ? 'Crea una cuenta para' : 'Ingresa tus credenciales para'} <span className="font-bold capitalize text-cocoa-brown">{selectedRole}</span>.
                        </p>
                        
                        <div>
                            <label className="block text-sm font-medium text-cocoa-brown mb-1">Correo Electrónico</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-cream/50 border-2 border-blush-pink rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rose-gold"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-cocoa-brown mb-1">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-cream/50 border-2 border-blush-pink rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rose-gold"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center animate-shake">{error}</p>}
                        
                        <div className="space-y-4 pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-rose-gold text-cocoa-brown font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Procesando...' : (isSignUp ? 'Registrarse' : 'Iniciar Sesión')}
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="w-full text-sm text-muted-mauve hover:text-cocoa-brown underline"
                            >
                                {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
                            </button>

                             <button
                                type="button"
                                onClick={handleCancel}
                                className="w-full bg-gray-200 text-cocoa-brown font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Volver
                            </button>
                        </div>
                    </form>
                )}

                <div className="mt-8 text-center">
                    <a href="#" className="text-sm text-muted-mauve hover:text-cocoa-brown underline">
                        Volver a la tienda
                    </a>
                </div>
            </div>
        </div>
    );
};

interface LoginButtonProps {
    onClick: () => void;
    text: string;
    bgColor: string;
    hoverColor: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick, text, bgColor, hoverColor }) => (
    <button
        onClick={onClick}
        className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 ${bgColor} ${hoverColor}`}
    >
        {text}
    </button>
);

export default LoginScreen;
