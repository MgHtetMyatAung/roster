export async function loader() {
  const leaves = await [
    {
      id: 1,
      name: "Mg Mg",
      role: "Employee",
      type: "leave",
    },
    {
      id: 2,
      name: "Aung Aung",
      role: "Manager",
      type: "leave",
    },
  ];
  return { leaves };
}
