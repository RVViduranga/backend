/**
 * Profile Calculation Utilities
 * Helper functions for calculating numeric scores from profile arrays
 */

import type { ExperienceModel, EducationModel } from "@/models/user-profile";

/**
 * Calculate total years of experience from experience array
 * Sums up the years between startDate and endDate (or current date) for each experience
 */
export function calculateExperienceYears(
  experience: ExperienceModel[]
): number {
  if (!experience || experience.length === 0) {
    return 0;
  }

  let totalYears = 0;

  for (const exp of experience) {
    if (!exp.startDate) continue;

    const startDate = new Date(exp.startDate);
    const endDate = exp.endDate ? new Date(exp.endDate) : new Date();
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      continue;
    }

    const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    totalYears += Math.max(0, years);
  }

  return Math.round(totalYears * 10) / 10; // Round to 1 decimal place
}

/**
 * Calculate qualification score from education array
 * Based on highest degree level (PhD = 10, Master's = 8, Bachelor's = 6, Diploma = 4, Certificate = 2)
 */
export function calculateQualificationScore(
  education: EducationModel[]
): number {
  if (!education || education.length === 0) {
    return 0;
  }

  let maxScore = 0;

  for (const edu of education) {
    if (!edu.degree) continue;

    const degreeLower = edu.degree.toLowerCase();
    let score = 0;

    // Assign scores based on degree level
    if (degreeLower.includes("phd") || degreeLower.includes("doctorate") || degreeLower.includes("doctoral")) {
      score = 10;
    } else if (degreeLower.includes("master") || degreeLower.includes("mba") || degreeLower.includes("msc") || degreeLower.includes("ma")) {
      score = 8;
    } else if (degreeLower.includes("bachelor") || degreeLower.includes("bsc") || degreeLower.includes("ba") || degreeLower.includes("b.tech") || degreeLower.includes("b.eng")) {
      score = 6;
    } else if (degreeLower.includes("diploma") || degreeLower.includes("associate")) {
      score = 4;
    } else if (degreeLower.includes("certificate") || degreeLower.includes("cert")) {
      score = 2;
    } else {
      // Default score for other degrees
      score = 3;
    }

    maxScore = Math.max(maxScore, score);
  }

  return maxScore;
}

/**
 * Calculate skill score from experience and education
 * Formula: (experienceYears * 0.5) + (qualificationScore * 0.5)
 * Max score: 10
 */
export function calculateSkillScore(
  experience: ExperienceModel[],
  education: EducationModel[]
): number {
  const experienceYears = calculateExperienceYears(experience);
  const qualificationScore = calculateQualificationScore(education);

  // Weighted formula: 50% experience, 50% qualification
  const skillScore = (experienceYears * 0.5) + (qualificationScore * 0.5);

  // Cap at 10
  return Math.min(10, Math.round(skillScore * 10) / 10);
}

/**
 * Split full name into firstName and lastName
 * Handles various name formats
 */
export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  if (!fullName || !fullName.trim()) {
    return { firstName: "", lastName: "" };
  }

  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/);

  if (parts.length === 0) {
    return { firstName: "", lastName: "" };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }

  // First part is firstName, rest is lastName
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");

  return { firstName, lastName };
}
