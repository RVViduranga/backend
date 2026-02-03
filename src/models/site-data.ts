/**
 * Site Data - Type Definitions and Static Configuration
 *
 * FOLDER STRUCTURE:
 * - src/data/     → Type definitions + Static config (this file)
 * - src/mocks/    → All mock data (centralized in @/mocks)
 * - src/types/    → New centralized types (gradual migration target)
 *
 * NOTE: This file contains site-wide branding and navigation type definitions.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface SiteBrandingModel {
  siteName: string;
  logoUrl: string;
  mainHeroImageUrl: string;
  tagline: string;
}

// NOTE: Static configuration object has been moved to @/constants/app.ts
// - SITE_BRANDING

export interface NavigationLinkModel {
  title: string;
  iconName: string;
  url: string;
}
        
      