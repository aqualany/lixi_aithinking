// React Context for root CMS data — ensures child routes can access on both SSR & CSR
import React, { createContext, useContext } from "react";
import type { HeroProps, FixedNavProps, SectionTabsProps, ResearchFullProps, ExperimentsListProps, ResumeProps, FooterProps, PageSeoProps, SiteSettingsRow } from "@/lib/cms/types";

export interface CmsRootData {
  siteSettings: SiteSettingsRow | null;
  heroProps: HeroProps | null;
  footerProps: FooterProps | null;
  fixedNavProps: FixedNavProps | null;
  researchProps: ResearchFullProps | null;
  experimentsListProps: ExperimentsListProps | null;
  resumeProps: ResumeProps | null;
  sectionTabsProps: SectionTabsProps | null;
  pageSeoMap: Record<string, PageSeoProps>;
}

const CmsContext = createContext<CmsRootData | null>(null);

export function CmsProvider({ data, children }: { data: CmsRootData | null; children: React.ReactNode }) {
  return <CmsContext.Provider value={data}>{children}</CmsContext.Provider>;
}

export function useCmsData(): CmsRootData | null {
  return useContext(CmsContext);
}
