/** 1232 → "1,232+" */
export const plus = (n: number) => `${n.toLocaleString("en-IN")}+`;
/** 4.7 → "4.7★" */
export const stars = (n: number) => `${n.toFixed(1)}★`;
