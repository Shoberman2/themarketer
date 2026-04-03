"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Brand } from "@/types/brand";

interface BrandWithStats extends Brand {
  planCount: number;
  reportCount: number;
  latestPlanId?: string;
}

export default function DashboardPage() {
  const [brands, setBrands] = useState<BrandWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [brandsRes, plansRes, perfRes] = await Promise.all([
          fetch("/api/brands"),
          fetch("/api/plans"),
          fetch("/api/performance"),
        ]);

        const brandsData = brandsRes.ok ? await brandsRes.json() : { brands: [] };
        const plansData = plansRes.ok ? await plansRes.json() : { plans: [] };
        const perfData = perfRes.ok ? await perfRes.json() : { reports: [] };

        const brandStats: BrandWithStats[] = brandsData.brands.map((brand: Brand) => {
          const brandPlans = plansData.plans?.filter(
            (p: { brandId: string }) => p.brandId === brand.id
          ) || [];
          const brandReports = perfData.reports?.filter(
            (r: { brandId?: string }) => r.brandId === brand.id
          ) || [];

          return {
            ...brand,
            planCount: brandPlans.length,
            reportCount: brandReports.length,
            latestPlanId: brandPlans[0]?.id,
          };
        });

        setBrands(brandStats);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function selectBrand(brandId: string) {
    localStorage.setItem("activeBrandId", brandId);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <h1 className="font-serif italic text-3xl text-foreground">Dashboard</h1>
        <p className="text-muted text-sm">
          No brands yet. Paste a URL on the homepage to create your first campaign.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-2.5 bg-brand text-white text-sm font-medium"
        >
          Create your first campaign
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="font-serif italic text-3xl text-foreground">Dashboard</h1>
        <p className="text-sm text-muted mt-1">
          {brands.length} brand{brands.length !== 1 ? "s" : ""} managed
        </p>
      </div>

      {/* Brand cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {brands.map((brand) => (
          <div key={brand.id} className="border border-border p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 flex items-center justify-center text-[11px] font-bold text-white"
                  style={{ backgroundColor: brand.primaryColor || "#404040" }}
                >
                  {brand.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">{brand.name}</h2>
                  <p className="text-[11px] text-muted">{brand.domain}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted">Campaigns</div>
                <div className="text-lg font-semibold text-foreground">{brand.planCount}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted">Reports</div>
                <div className="text-lg font-semibold text-foreground">{brand.reportCount}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted">Industry</div>
                <div className="text-xs text-foreground truncate">{brand.industry}</div>
              </div>
            </div>

            <div className="flex gap-2">
              {brand.latestPlanId && (
                <Link
                  href={`/campaign/${brand.latestPlanId}`}
                  onClick={() => selectBrand(brand.id)}
                  className="flex-1 py-2 text-center text-xs font-medium bg-brand text-white hover:bg-brand-light transition-colors"
                >
                  Calendar
                </Link>
              )}
              <Link
                href="/"
                onClick={() => selectBrand(brand.id)}
                className="flex-1 py-2 text-center text-xs font-medium border border-border text-foreground hover:bg-surface transition-colors"
              >
                New Campaign
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Quick action */}
      <div className="border border-dashed border-border p-8 text-center">
        <Link
          href="/"
          onClick={() => localStorage.removeItem("activeBrandId")}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          + Add a new company
        </Link>
      </div>
    </div>
  );
}
