import React from "react";
import { FooterProps } from "@/shared/types/layout";

export default function Footer({
  companyName = "Sistema de Gestión",
  year = new Date().getFullYear(),
}: FooterProps) {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-center text-sm text-gray-500">
          © {year} {companyName}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
