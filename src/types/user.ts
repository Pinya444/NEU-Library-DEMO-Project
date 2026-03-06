export type UserRole = "admin" | "user";

export interface NEUUser {
  uid:             string;
  email:           string;
  fullName:        string;
  role:            UserRole;
  college_office:  string;
  isSetupComplete: boolean;
  createdAt:       string;
  photoURL?:       string;
  isBlocked:       boolean;
  blockReason?:    string;
  blockedAt?:      string;
  blockedBy?:      string;
}

export type UserDoc = Omit<NEUUser, "uid">;

export interface BlockAction {
  isBlocked:  boolean;
  reason?:    string;
  adminUid:   string;
}
