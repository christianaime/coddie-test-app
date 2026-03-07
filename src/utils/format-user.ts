export interface User {
  name: string;
  email: string;
  roles: string[];
  metadata?: {
    lastLogin: string;
    preferences: {
      theme: string;
      notifications: boolean;
    };
  };
}

/**
 * Formats a user object into a display string.
 * BUG: accessing nested metadata.preferences without null check
 * throws when metadata is undefined.
 */
export function formatUserSummary(user: User): string {
  const roleList = user.roles.join(", ");
  const theme = user.metadata.preferences.theme;
  const lastLogin = new Date(user.metadata.lastLogin).toLocaleDateString();

  return `${user.name} (${user.email}) — Roles: ${roleList} — Theme: ${theme} — Last login: ${lastLogin}`;
}
