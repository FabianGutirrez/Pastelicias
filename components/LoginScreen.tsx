
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';
import { supabase } from '../supabase';
import NotificationModal from './NotificationModal';
import { ShieldCheck, Lock, Mail, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
    onLogin: (role: UserRole) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secretCode, setSecretCode] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const ADMIN_REGISTRATION_CODE = 'PASTEL-2024-SEC';

    const getRoleFromEmail = (email: string): UserRole => {
        const superAdminEmails = ['fabiangcartajena2@gmail.com', 'admin@pastelicia.com'];
        return superAdminEmails.includes(email.toLowerCase()) ? 'superadmin' : 'admin';
    };

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const roleToAssign = getRoleFromEmail(email);

        if (isSignUp) {
            if (secretCode !== ADMIN_REGISTRATION_CODE) {
                setError('Código de acceso administrativo incorrecto. No tienes permiso para crear esta cuenta.');
                return;
            }
        }

        setLoading(true);
        setError('');

        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            role: roleToAssign
                        }
                    }
                });
                if (error) throw error;
                if (data.user) {
                    setSuccessMessage('¡Registro exitoso! Por favor, revisa tu correo para confirmar tu cuenta e intenta iniciar sesión.');
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

    return (
        <div className="min-h-[80vh] w-full flex items-center justify-center bg-cream/30 p-4">
            <NotificationModal 
                isOpen={!!successMessage}
                onClose={() => setSuccessMessage('')}
                title="¡Bienvenido a Pastelicia!"
                message={successMessage}
                type="success"
            />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-cream p-10 sm:p-14 rounded-[2.5rem] shadow-2xl border border-rose-gold/10 relative overflow-hidden"
            >
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blush-pink/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-rose-gold/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 bg-cream rounded-3xl flex items-center justify-center shadow-inner border border-rose-gold/20">
                            <ShieldCheck className="w-10 h-10 text-rose-gold" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-serif font-bold text-cocoa-brown mb-2 text-center">
                        Portal Administrativo
                    </h1>
                    <p className="text-muted-mauve mb-12 text-center text-lg">
                        Gestiona la dulzura de Pastelicia
                    </p>

                    <AnimatePresence mode="wait">
                        <motion.form 
                            key="auth-form"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onSubmit={handleAuthSubmit} 
                            className="space-y-6"
                        >
                            <div className="space-y-4">
                                <div className="relative">
                                    <label className="block text-sm font-bold text-cocoa-brown mb-2 ml-1">Correo Electrónico</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-mauve" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-cream/30 border-2 border-blush-pink/30 rounded-2xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-rose-gold transition-all"
                                            placeholder="ejemplo@pastelicias.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-bold text-cocoa-brown mb-2 ml-1">Contraseña</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-mauve" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-cream/30 border-2 border-blush-pink/30 rounded-2xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-rose-gold transition-all"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                {isSignUp && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="relative pt-2"
                                    >
                                        <label className="block text-sm font-bold text-cocoa-brown mb-2 ml-1">Código de Seguridad</label>
                                        <div className="relative">
                                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-mauve" />
                                            <input
                                                type="password"
                                                value={secretCode}
                                                onChange={(e) => setSecretCode(e.target.value)}
                                                className="w-full bg-cream/30 border-2 border-blush-pink/30 rounded-2xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-rose-gold transition-all"
                                                placeholder="Código administrativo"
                                                required
                                            />
                                        </div>
                                        <p className="text-xs text-muted-mauve mt-2 ml-1 italic">
                                            Requerido para el alta de nuevas cuentas administrativas.
                                        </p>
                                    </motion.div>
                                )}
                            </div>

                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium"
                                >
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                            
                            <div className="space-y-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-rose-gold text-cocoa-brown font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-rose-gold/20 transform hover:-translate-y-1 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'
                                    )}
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    className="w-full text-sm font-bold text-muted-mauve hover:text-rose-gold transition-colors"
                                >
                                    {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
                                </button>

                                <div className="pt-4 text-center">
                                    <a href="/" className="text-sm font-medium text-muted-mauve hover:text-rose-gold transition-colors inline-flex items-center gap-2">
                                        <ArrowLeft className="w-4 h-4" />
                                        Volver a la tienda
                                    </a>
                                </div>
                            </div>
                        </motion.form>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginScreen;
