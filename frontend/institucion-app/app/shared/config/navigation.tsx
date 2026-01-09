import React from "react";
import type { NavItem } from '../types/layout';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Settings,
  Users,
  Bell,
  HelpCircle
} from "lucide-react";

/**
 * Items de navegación principales
 */
export const mainNavItems: NavItem[] = [
  { 
    label: "Inicio", 
    href: "/",
    icon: <LayoutDashboard className="w-5 h-5" />
  },
  { 
    label: "Modalidades", 
    href: "/modules/modalidades",
    icon: <BookOpen className="w-5 h-5" />
  },
  { 
    label: "Carreras", 
    href: "/modules/carreras",
    icon: <GraduationCap className="w-5 h-5" />
  },
];

/**
 * Información de la empresa/institución
 */
export const appConfig = {
  companyName: "Institución Educativa",
  appTitle: "Sistema de Gestión Académica",
};
