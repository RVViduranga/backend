/**
 * Format date to human-readable string
 * @param dateString - Date string in format "YYYY-MM-DD"
 * @returns Formatted date string (e.g., "Nov 10, 2025")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString; // Return original if invalid
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format date to relative time (e.g., "2 days ago", "1 week ago")
 * @param dateString - Date string in format "YYYY-MM-DD"
 * @returns Relative time string
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString;
  }

  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 60) return "1 month ago";
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return formatDate(dateString);
}

/**
 * Calculate days until deadline
 * @param deadlineString - Date string in format "YYYY-MM-DD"
 * @returns Number of days until deadline, or null if past
 */
export function getDaysUntilDeadline(deadlineString: string): number | null {
  const deadline = new Date(deadlineString);
  if (isNaN(deadline.getTime())) {
    return null;
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 0 ? diffDays : null;
}









