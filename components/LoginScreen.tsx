
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';
import { supabase } from '../supabase';
import NotificationModal from './NotificationModal';
import { ShieldCheck, UserCircle, Lock, Mail, ArrowLeft, Loader2, X, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
    onLogin: (role: UserRole) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secretCode, setSecretCode] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const ADMIN_REGISTRATION_CODE = '280911'; // Código secreto para registrar cuentas administrativas

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
        setError('');
    };

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isSignUp && (selectedRole === 'admin' || selectedRole === 'superadmin')) {
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
                            role: selectedRole || 'admin'
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
    
    const handleCancel = () => {
        setSelectedRole(null);
        setError('');
        setIsSignUp(false);
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
                        {!selectedRole ? (
                            <motion.div 
                                key="role-selection"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-5"
                            >
                                <RoleButton 
                                    onClick={() => handleRoleSelect('admin')} 
                                    text="Administrador" 
                                    description="Gestión de productos y pedidos"
                                    icon={<UserCircle className="w-6 h-6" />}
                                    variant="primary"
                                />
                                <RoleButton 
                                    onClick={() => handleRoleSelect('superadmin')} 
                                    text="Superadministrador" 
                                    description="Control total del sistema"
                                    icon={<ShieldCheck className="w-6 h-6" />}
                                    variant="secondary"
                                />
                                
                                <div className="pt-8 text-center">
                                    <a href="#" className="text-sm font-medium text-muted-mauve hover:text-rose-gold transition-colors inline-flex items-center gap-2">
                                        <ArrowLeft className="w-4 h-4" />
                                        Volver a la tienda
                                    </a>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.form 
                                key="auth-form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleAuthSubmit} 
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-4 mb-8 p-4 bg-cream/50 rounded-2xl border border-rose-gold/10">
                                    <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center shadow-sm">
                                        {selectedRole === 'superadmin' ? <ShieldCheck className="w-6 h-6 text-gray-700" /> : <UserCircle className="w-6 h-6 text-cocoa-brown" />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-rose-gold">Acceso como</p>
                                        <p className="font-serif font-bold text-cocoa-brown capitalize">{selectedRole}</p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={handleCancel}
                                        className="ml-auto p-2 text-muted-mauve hover:text-cocoa-brown transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

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
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

interface RoleButtonProps {
    onClick: () => void;
    text: string;
    description: string;
    icon: React.ReactNode;
    variant: 'primary' | 'secondary';
}

const RoleButton: React.FC<RoleButtonProps> = ({ onClick, text, description, icon, variant }) => (
    <button
        onClick={onClick}
        className={`w-full p-6 rounded-3xl transition-all duration-300 flex items-center gap-5 group text-left border-2 ${
            variant === 'primary' 
            ? 'bg-cream border-rose-gold/20 hover:border-rose-gold hover:shadow-xl hover:shadow-rose-gold/5' 
            : 'bg-gray-50 border-gray-200 hover:border-gray-400 hover:shadow-xl hover:shadow-gray-200/50'
        }`}
    >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
            variant === 'primary' ? 'bg-cream text-rose-gold group-hover:bg-rose-gold group-hover:text-white' : 'bg-cream text-gray-600 group-hover:bg-gray-700 group-hover:text-white'
        }`}>
            {icon}
        </div>
        <div>
            <p className="font-serif font-bold text-xl text-cocoa-brown">{text}</p>
            <p className="text-sm text-muted-mauve">{description}</p>
        </div>
    </button>
);

export default LoginScreen;
