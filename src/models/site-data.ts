/**
 * Site Data Model - Shared Utility Types
 * 
 * This model contains site-wide branding and navigation type definitions.
 * Static configuration objects are in @/constants/app.ts
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
        
      