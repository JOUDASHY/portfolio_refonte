export default function Maintenance() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-6 text-center">
      <div className="mb-8 text-8xl">🛠️</div>
      <h1 className="text-4xl font-bold mb-4">Site en maintenance</h1>
      <p className="text-gray-400 text-lg max-w-md mb-2">
        Le serveur est temporairement indisponible. Nous travaillons à rétablir
        le service le plus rapidement possible.
      </p>
      <p className="text-gray-500 text-sm mt-6">
        Revenez dans quelques instants.
      </p>
    </div>
  );
}
