export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary-500 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Cargando Panel de Administración</h2>
        <p className="text-gray-600">Un momento por favor...</p>
      </div>
    </div>
  );
}
