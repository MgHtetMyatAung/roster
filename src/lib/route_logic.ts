export function getUrl(path: string) {
  return `/${path}`;
}

export function getRoute(path: string) {
  const paths = path.split("/");
  return paths[paths.length - 1];
}
