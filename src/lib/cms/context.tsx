// Global CMS data store — survives all navigations (SSR + CSR)
// Not a cache: beforeLoad runs on every SSR request and updates the store
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

// Module-level global store — written by beforeLoad, read by any component
let _store: CmsRootData | null = null;

export function setCmsData(data: CmsRootData) {
  _store = data;
}

export function getCmsData(): CmsRootData | null {
  return _store;
}

const CmsContext = createContext<CmsRootData | null>(null);

export function CmsProvider({ data, children }: { data: CmsRootData | null; children: React.ReactNode }) {
  return <CmsContext.Provider value={data}>{children}</CmsContext.Provider>;
}

export function useCmsData(): CmsRootData | null {
  // Try React Context first (SSR/CSR default)
  const ctx = useContext(CmsContext);
  if (ctx) return ctx;
  // Fallback to global store (reliable across all navigations)
  return _store;
}
