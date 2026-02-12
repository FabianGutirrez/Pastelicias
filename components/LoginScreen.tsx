
import React from 'react';
import { UserRole } from '../types';

interface LoginScreenProps {
    onLogin: (role: UserRole) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-cream p-4">
            <div className="w-full max-w-md text-center bg-white p-8 sm:p-12 rounded-2xl shadow-2xl">
                <h1 className="text-4xl sm:text-5xl font-serif font-bold text-cocoa-brown mb-4">
                    Acceso Administrativo
                </h1>
                <p className="text-muted-mauve mb-10">
                    Por favor, selecciona tu rol para continuar.
                </p>
                <div className="space-y-4">
                    <LoginButton 
                        onClick={() => onLogin('admin')} 
                        text="Entrar como Administrador" 
                        bgColor="bg-cocoa-brown" 
                        hoverColor="hover:bg-opacity-80"
                    />
                    <LoginButton 
                        onClick={() => onLogin('superadmin')} 
                        text="Entrar como Superadministrador" 
                        bgColor="bg-gray-700" 
                        hoverColor="hover:bg-gray-600"
                    />
                </div>
                 <div className="mt-8">
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