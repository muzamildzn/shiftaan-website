export const siteUrl: string;
export const posts: string[][];
export const faqs: string[][];
export const pageMeta: Record<string, { title: string; description: string; canonical?: string }>;
export const notFoundMeta: { title: string; description: string };
export function blogMeta(p: string[]): { title: string; description: string };
