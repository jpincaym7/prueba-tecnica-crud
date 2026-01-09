"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/shared/components/Layout/AppLayout";
import { mainNavItems, appConfig } from "@/shared/config/navigation";
import { 
  GraduationCap, 
  BookOpen, 
  ArrowRight,
  Calendar,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { carreraService } from "@/modules/carreras/services/carrera.service";
import { modalidadService } from "@/modules/modalidades/services/modalidad.service";

export default function Home() {
  const [stats, setStats] = useState({
    carreras: { count: 0, loading: true },
    modalidades: { count: 0, loading: true },
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [carrerasRes, modalidadesRes] = await Promise.all([
          carreraService.list(),
          modalidadService.list(),
        ]);
        
        setStats({
          carreras: { count: carrerasRes.count || carrerasRes.data.length, loading: false },
          modalidades: { count: modalidadesRes.count || modalidadesRes.data.length, loading: false },
        });
      } catch (error) {
        console.error("Error loading stats:", error);
        setStats({
          carreras: { count: 0, loading: false },
          modalidades: { count: 0, loading: false },
        });
      }
    };

    loadStats();
  }, []);

  const currentMonth = new Date().toLocaleString('es-ES', { month: 'long' });
  const currentYear = new Date().getFullYear();

  return (
    <AppLayout
      title={appConfig.appTitle}
      companyName={appConfig.companyName}
      navItems={mainNavItems}
    >
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-3">
              Bienvenido al Sistema de Gestión Académica
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl text-lg">
              Administra de forma eficiente las modalidades, carreras de tu institución desde una plataforma centralizada.
            </p>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 right-20 -mb-8 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
          <GraduationCap className="absolute right-8 bottom-6 h-24 w-24 text-white/10" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Carreras</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats.carreras.loading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    stats.carreras.count
                  )}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Modalidades</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats.modalidades.loading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    stats.modalidades.count
                  )}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Este Mes</p>
                <p className="text-2xl font-bold text-foreground mt-1 capitalize">{currentMonth}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-muted-foreground">
              <span>{currentYear}</span>
            </div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Acceso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/modules/modalidades"
              className="group bg-card rounded-xl border p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    Modalidades
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Administra las modalidades académicas disponibles en la institución. 
                    Crea, edita y gestiona modalidades como Presencial, Virtual o Semipresencial.
                  </p>
                  <span className="inline-flex items-center text-sm font-medium text-primary">
                    Gestionar modalidades
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>

            <Link 
              href="/modules/carreras"
              className="group bg-card rounded-xl border p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    Carreras
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Gestiona las carreras académicas disponibles. Organiza las carreras 
                    por modalidad y mantén actualizada la oferta educativa.
                  </p>
                  <span className="inline-flex items-center text-sm font-medium text-primary">
                    Gestionar carreras
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
