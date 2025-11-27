/**
 * Formats a JavaScript Date object or a Firestore Timestamp into a relative, human-readable string.
 * e.g., "2 hours ago", "Yesterday", "3 days ago"
 * @param {Date | {seconds: number}} date - The date or timestamp to format.
 * @returns {string} A formatted relative time string.
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';

  // Convert Firestore Timestamp to JS Date if necessary
  const jsDate = date.seconds ? new Date(date.seconds * 1000) : date;
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - jsDate) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;

  // For older dates, return the simple date string
  return jsDate.toLocaleDateString();
};