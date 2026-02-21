import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format timestamp based on age for message display
 */
export function formatMessageTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  const timeStr = date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  // Today: "2:34 PM"
  if (diffDays === 0 && date.getDate() === now.getDate()) {
    return timeStr;
  }
  
  // Yesterday: "Yesterday 2:34 PM"
  if (diffDays === 1 || (diffDays === 0 && date.getDate() === now.getDate() - 1)) {
    return `Yesterday ${timeStr}`;
  }
  
  // This week: "Monday 2:34 PM"
  if (diffDays < 7) {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return `${dayName} ${timeStr}`;
  }
  
  // This year: "Feb 15, 2:34 PM"
  if (date.getFullYear() === now.getFullYear()) {
    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${monthDay}, ${timeStr}`;
  }
  
  // Different year: "Feb 15, 2024, 2:34 PM"
  const fullDate = date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  return `${fullDate}, ${timeStr}`;
}

/**
 * Get date separator text for message grouping
 */
export function getDateSeparator(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // Today: "Today"
  if (diffDays === 0 && date.getDate() === now.getDate()) {
    return "Today";
  }
  
  // Yesterday: "Yesterday"
  if (diffDays === 1 || (diffDays === 0 && date.getDate() === now.getDate() - 1)) {
    return "Yesterday";
  }
  
  // This week: Day name (e.g., "Monday")
  if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }
  
  // This year: "February 15"
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  }
  
  // Different year: "February 15, 2024"
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

/**
 * Check if date separator should be shown between messages
 */
export function shouldShowDateSeparator(
  currentTimestamp: number, 
  previousTimestamp: number | null
): boolean {
  if (previousTimestamp === null) {
    return true;
  }
  
  const currentDate = new Date(currentTimestamp);
  const previousDate = new Date(previousTimestamp);
  
  // Different day
  return currentDate.getDate() !== previousDate.getDate() ||
         currentDate.getMonth() !== previousDate.getMonth() ||
         currentDate.getFullYear() !== previousDate.getFullYear();
}
