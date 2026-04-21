export async function loader() {
  const user = await ["User", "Admin"];
  return { user };
}
