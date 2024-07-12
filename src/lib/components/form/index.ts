import { getContext } from "svelte";

export const getFormContext = () =>
  getContext<{ values: any; errors: any }>("form");
