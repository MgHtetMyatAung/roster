export default function JsonView({ data }: { data: unknown }) {
  return (
    <pre
      className=" bg-gray-100 text-gray-800
        dark:bg-gray-900 dark:text-green-300
        p-4 rounded-lg overflow-x-auto text-sm
        border border-gray-200 dark:border-gray-700"
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
