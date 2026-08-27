import type { ReactNode } from "react";
export interface CtaAuditRealisationsSlugProps { locale?: "fr" | "en"; webhookUrl?: string; redirectUrl?: string; onComplete?: (data: {name:string;email:string;phone:string;revenue:string;website:string}) => void; }
declare const CtaAuditRealisationsSlug: (props: CtaAuditRealisationsSlugProps) => ReactNode;
export default CtaAuditRealisationsSlug;
