/**
 * Calculate the profile strength percentage and get detailed breakdown
 * @param profile - The user's profile object
 * @returns Object with strength percentage and completion details
 */

interface ProfileStrengthResult {
  percentage: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  completedItems: string[];
  incompleteItems: string[];
  totalItems: number;
  completedItemsCount: number;
}

export function calculateProfileStrength(profile: any): ProfileStrengthResult {
  const completedItems: string[] = [];
  const incompleteItems: string[] = [];

  // Check basic info
  if (profile?.fullName) {
    completedItems.push('Full name');
  } else {
    incompleteItems.push('Full name');
  }

  if (profile?.email) {
    completedItems.push('Email address');
  } else {
    incompleteItems.push('Email address');
  }

  if (profile?.phone) {
    completedItems.push('Phone number');
  } else {
    incompleteItems.push('Phone number');
  }

  if (profile?.location) {
    completedItems.push('Location');
  } else {
    incompleteItems.push('Location');
  }

  // Check professional info
  if (profile?.headline) {
    completedItems.push('Headline');
  } else {
    incompleteItems.push('Headline');
  }

  if (profile?.professionalSummary) {
    completedItems.push('Professional summary');
  } else {
    incompleteItems.push('Professional summary');
  }

  // Check portfolio/links
  if (profile?.linkedin) {
    completedItems.push('LinkedIn profile');
  } else {
    incompleteItems.push('LinkedIn profile');
  }

  if (profile?.portfolio) {
    completedItems.push('Portfolio website');
  } else {
    incompleteItems.push('Portfolio website');
  }

  // Check resume
  if (profile?.resume && profile.resume.filename) {
    completedItems.push('Resume uploaded');
  } else {
    incompleteItems.push('Resume uploaded');
  }

  // Check skills
  if (profile?.designTools && profile.designTools.length > 0) {
    completedItems.push('Design tools listed');
  } else {
    incompleteItems.push('Design tools listed');
  }

  if (profile?.technicalSkills && profile.technicalSkills.length > 0) {
    completedItems.push('Technical skills listed');
  } else {
    incompleteItems.push('Technical skills listed');
  }

  if (profile?.softSkills && profile.softSkills.length > 0) {
    completedItems.push('Soft skills listed');
  } else {
    incompleteItems.push('Soft skills listed');
  }

  // Check languages
  if (profile?.languages && profile.languages.length > 0) {
    completedItems.push('Languages added');
  } else {
    incompleteItems.push('Languages added');
  }

  // Check experience
  if (profile?.experience && profile.experience.length > 0) {
    completedItems.push('Work experience added');
  } else {
    incompleteItems.push('Work experience added');
  }

  // Check education
  if (profile?.education && profile.education.length > 0) {
    completedItems.push('Education added');
  } else {
    incompleteItems.push('Education added');
  }

  // Check projects
  if (profile?.projects && profile.projects.length > 0) {
    completedItems.push('Projects added');
  } else {
    incompleteItems.push('Projects added');
  }

  // Check job preferences
  if (profile?.jobPreferences?.desiredRole) {
    completedItems.push('Desired role set');
  } else {
    incompleteItems.push('Desired role set');
  }

  if (profile?.jobPreferences?.preferredLocations && profile.jobPreferences.preferredLocations.length > 0) {
    completedItems.push('Preferred locations set');
  } else {
    incompleteItems.push('Preferred locations set');
  }

  const totalItems = completedItems.length + incompleteItems.length;
  const completedItemsCount = completedItems.length;
  const percentage = Math.round((completedItemsCount / totalItems) * 100);

  // Determine level
  let level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' = 'Beginner';
  if (percentage >= 75) {
    level = 'Expert';
  } else if (percentage >= 50) {
    level = 'Advanced';
  } else if (percentage >= 25) {
    level = 'Intermediate';
  }

  return {
    percentage,
    level,
    completedItems,
    incompleteItems,
    totalItems,
    completedItemsCount
  };
}

/**
 * Get profile strength color based on percentage
 */
export function getProfileStrengthColor(percentage: number): string {
  if (percentage >= 75) return 'text-emerald-600';
  if (percentage >= 50) return 'text-blue-600';
  if (percentage >= 25) return 'text-amber-600';
  return 'text-red-600';
}
