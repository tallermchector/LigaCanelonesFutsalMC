'use client'
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
            },
        },
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-background to-card overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                style={
                    {
                        backgroundImage: `url('https://1000marcas.net/wp-content/uploads/2025/04/fondo-de-pantalla-azul-para-el-fondo.png')`
                    }
                }
                data-ai-hint="futsal court">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
            </div>

            <div className="relative pt-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div 
                    className="flex min-h-screen items-center justify-center text-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="max-w-5xl">
                        <motion.div className="relative" variants={itemVariants}>
                            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight font-orbitron">
                                <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent drop-shadow-md">
                                    La Pasión del
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-primary via-red-500 to-red-600 bg-clip-text text-transparent">
                                    Futsal
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-secondary via-blue-400 to-blue-500 bg-clip-text text-transparent">
                                    en Canelones
                                </span>
                            </h1>
                        </motion.div>

                        <motion.p 
                            className="mt-8 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto"
                            variants={itemVariants}
                        >
                            Sigue cada partido, cada gol y cada jugada. La plataforma definitiva para los
                            amantes del fútbol sala en la región.
                        </motion.p>

                        <motion.div 
                            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                            variants={itemVariants}
                        >
                            <Link href="/partidos" className="group relative inline-block px-8 py-4 text-base sm:text-lg font-bold text-primary-foreground rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-2xl hover:shadow-primary/25 w-full sm:w-auto">
                                <div className="absolute inset-0 bg-primary group-hover:bg-primary/90 transition-colors"></div>
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Ver Partidos
                                </span>
                            </Link>

                            <Link href="/posiciones" className="group relative inline-block px-8 py-4 text-base sm:text-lg font-bold text-foreground bg-background/50 backdrop-blur-sm rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-2xl hover:shadow-white/10 w-full sm:w-auto border border-border">
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Ver Posiciones
                                </span>
                            </Link>
                        </motion.div>

                    </div>

                </motion.div>
            </div>
        </div>
    )
}
