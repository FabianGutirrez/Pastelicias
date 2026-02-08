
import React from 'react';

const ContactPage: React.FC = () => {
    return (
        <section id="contact" className="bg-white p-8 rounded-lg shadow-lg max-w-5xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-center mb-8 text-dark-choco">Contáctanos</h2>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold font-serif text-brown-sugar mb-3">Nuestra Ubicación</h3>
                    <p>Calle Ficticia 123,</p>
                    <p>Ciudad Dulce, CP 54321</p>
                    <h3 className="text-xl font-bold font-serif text-brown-sugar mt-6 mb-3">Horario</h3>
                    <p>Lunes a Sábado: 9am - 8pm</p>
                    <p>Domingo: 10am - 6pm</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold font-serif text-brown-sugar mb-3 text-center md:text-left">Envíanos un mensaje</h3>
                    <form action="#" method="POST" className="space-y-4" onSubmit={(e) => {
                        e.preventDefault();
                        alert('Gracias por tu mensaje. (Esto es una simulación)');
                    }}>
                        <input type="text" placeholder="Tu Nombre" required className="w-full px-3 py-2 border border-peach rounded-md focus:ring-brown-sugar focus:border-brown-sugar bg-cream/50" />
                        <input type="email" placeholder="Tu Email" required className="w-full px-3 py-2 border border-peach rounded-md focus:ring-brown-sugar focus:border-brown-sugar bg-cream/50" />
                        <textarea placeholder="Tu Mensaje" rows={4} required className="w-full px-3 py-2 border border-peach rounded-md focus:ring-brown-sugar focus:border-brown-sugar bg-cream/50"></textarea>
                        <button type="submit" className="w-full bg-brown-sugar text-cream font-bold py-2 px-4 rounded-md hover:bg-dark-choco transition-colors">Enviar Mensaje</button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactPage;
