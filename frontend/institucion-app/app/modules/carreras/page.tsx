import AppLayout from "@/shared/components/Layout/AppLayout";
import TableCarreras from "@/modules/carreras/components/TableCarreras";
import { mainNavItems, appConfig } from "@/shared/config/navigation";

export default function CarrerasPage() {
  return (
    <AppLayout
      title="Gestión de Carreras"
      companyName={appConfig.companyName}
      navItems={mainNavItems}
    >
      <div className="space-y-6">
        {/* Encabezado de la página */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Carreras</h1>
          <p className="mt-2 text-gray-600">
            Administra las carreras académicas disponibles en la institución.
            Crea, edita y organiza las carreras por modalidad.
          </p>
        </div>
        <TableCarreras />
      </div>
    </AppLayout>
  );
}
