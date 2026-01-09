import AppLayout from "@/shared/components/Layout/AppLayout";
import TableModalidades from "@/modules/modalidades/components/TableModalidades";
import { mainNavItems, appConfig } from "@/shared/config/navigation";

export default function ModalidadesPage() {
  return (
    <AppLayout
      title="Gestión de Modalidades"
      companyName={appConfig.companyName}
      navItems={mainNavItems}
    >
      <div className="space-y-6">
        {/* Encabezado de la página */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modalidades</h1>
          <p className="mt-2 text-gray-600">
            Administra las modalidades académicas disponibles en la institución.
            Crea, edita y organiza las diferentes modalidades de estudio.
          </p>
        </div>

        {/* Tabla de modalidades con todas las funcionalidades integradas */}
        <TableModalidades />
      </div>
    </AppLayout>
  );
}
