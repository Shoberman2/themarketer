"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CampaignIndexPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [noCampaign, setNoCampaign] = useState(false);

  useEffect(() => {
    async function findCampaign() {
      try {
        const brandId = localStorage.getItem("activeBrandId");
        const res = await fetch("/api/plans");
        if (!res.ok) {
          setNoCampaign(true);
          setLoading(false);
          return;
        }
        const { plans } = await res.json();
        const brandPlans = brandId
          ? plans?.filter((p: { brandId: string }) => p.brandId === brandId)
          : plans;

        if (brandPlans?.length > 0) {
          router.replace(`/campaign/${brandPlans[0].id}`);
        } else {
          setNoCampaign(true);
          setLoading(false);
        }
      } catch {
        setNoCampaign(true);
        setLoading(false);
      }
    }
    findCampaign();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  if (noCampaign) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <h1 className="font-serif italic text-3xl text-foreground">Campaign Calendar</h1>
        <p className="text-muted text-sm">
          No campaign found for this brand. Generate one from the homepage.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-2.5 bg-brand text-white text-sm font-medium"
        >
          Generate a campaign
        </Link>
      </div>
    );
  }

  return null;
}
