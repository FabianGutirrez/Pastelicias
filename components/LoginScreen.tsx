
import React, { useState, useEffect, useRef } from 'react';
import { UserRole } from '../types';

// En una aplicación real, estos PINs deberían ser gestionados de forma segura en el backend.
const ADMIN_PIN = '1234';
const SUPERADMIN_PIN = '5678';

interface LoginScreenProps {
    onLogin: (role: UserRole) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const pinInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (selectedRole && pinInputRef.current) {
            pinInputRef.current.focus();
        }
    }, [selectedRole]);

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
        setPin('');
        setError('');
    };

    const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Permite solo números y limita la longitud a 4
        if (/^\d*$/.test(value) && value.length <= 4) {
            setPin(value);
        }
    };

    const handlePinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let isPinCorrect = false;

        if (selectedRole === 'admin' && pin === ADMIN_PIN) {
            isPinCorrect = true;
        } else if (selectedRole === 'superadmin' && pin === SUPERADMIN_PIN) {
            isPinCorrect = true;
        }

        if (isPinCorrect && selectedRole) {
            onLogin(selectedRole);
        } else {
            setError('PIN incorrecto. Intenta de nuevo.');
            setPin('');
            pinInputRef.current?.focus();
        }
    };
    
    const handleCancel = () => {
        setSelectedRole(null);
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
                    <form onSubmit={handlePinSubmit}>
                        <p className="text-muted-mauve mb-6 text-center">
                            Ingresa el PIN de 4 dígitos para <span className="font-bold capitalize text-cocoa-brown">{selectedRole}</span>.
                        </p>
                        <div className="mb-4">
                            <input
                                ref={pinInputRef}
                                type="password"
                                value={pin}
                                onChange={handlePinChange}
                                maxLength={4}
                                className="w-full text-center text-3xl tracking-[1rem] bg-cream/50 border-2 border-blush-pink rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rose-gold"
                                placeholder="----"
                                required
                                inputMode="numeric"
                                pattern="[0-9]*"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center mb-4 animate-shake">{error}</p>}
                        <div className="space-y-4">
                            <button
                                type="submit"
                                className="w-full bg-rose-gold text-cocoa-brown font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                            >
                                Confirmar
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