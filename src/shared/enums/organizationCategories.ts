/**
 * Enum for organization categories used in dropdown options
 */
export enum OrganizationCategory {
  NON_PROFIT = 'Non-Profit',
  GOVERNMENT = 'Government',
  COOPERATIVES = 'Cooperatives',
  EDUCATIONAL_BASED = 'Educational-based',
  COMMUNITY_BASED = 'Community-based'
}

/**
 * Array of organization categories for dropdown options
 */
export const organizationCategoryOptions = Object.values(OrganizationCategory);