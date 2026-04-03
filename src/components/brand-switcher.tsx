"use client";

import { useState, useEffect, useRef } from "react";
import { Brand } from "@/types/brand";

export function BrandSwitcher({
  onBrandChange,
}: {
  onBrandChange: (brandId: string | null) => void;
}) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [activeBrandId, setActiveBrandId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("activeBrandId");
    if (stored) setActiveBrandId(stored);

    async function loadBrands() {
      try {
        const res = await fetch("/api/brands");
        if (res.ok) {
          const { brands: b } = await res.json();
          setBrands(b);
          // If stored brand doesn't exist anymore, clear it
          if (stored && !b.find((br: Brand) => br.id === stored)) {
            localStorage.removeItem("activeBrandId");
            setActiveBrandId(null);
          }
        }
      } catch {
        // silent
      }
    }
    loadBrands();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectBrand(brandId: string) {
    localStorage.setItem("activeBrandId", brandId);
    setActiveBrandId(brandId);
    setIsOpen(false);
    onBrandChange(brandId);
  }

  const activeBrand = brands.find((b) => b.id === activeBrandId);

  if (brands.length === 0) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-raised border border-border hover:border-border-hover transition-all text-sm"
      >
        {activeBrand ? (
          <>
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: activeBrand.primaryColor || "#666" }}
            />
            <span className="text-foreground font-medium truncate max-w-[140px]">
              {activeBrand.name}
            </span>
          </>
        ) : (
          <span className="text-muted">Select company</span>
        )}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className={`text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-surface-raised border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => selectBrand(brand.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left hover:bg-surface-hover transition-colors ${
                brand.id === activeBrandId ? "bg-surface-hover" : ""
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: brand.primaryColor || "#666" }}
              />
              <div className="min-w-0">
                <div className="font-medium text-foreground truncate">{brand.name}</div>
                <div className="text-[10px] text-muted truncate">{brand.domain}</div>
              </div>
            </button>
          ))}
          <div className="border-t border-border">
            <button
              onClick={() => {
                localStorage.removeItem("activeBrandId");
                setActiveBrandId(null);
                setIsOpen(false);
                onBrandChange(null);
              }}
              className="w-full px-3 py-2.5 text-xs text-brand text-left hover:bg-surface-hover transition-colors"
            >
              + Add new company
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
