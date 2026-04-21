import { useLoaderData } from "react-router";

export function useTypedLoaderData<T>() {
  return useLoaderData() as T;
}
