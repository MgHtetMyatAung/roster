export async function loader() {
  const employees = await [
    {
      id: 1,
      name: "John Doe",
      role: "Employee",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Manager",
    },
  ];
  return { employees };
}
