import fs from "fs";
import path from "path";
import { BrandingProject, User } from "@/types";

interface DbUser extends User {
  passwordHash: string;
  resetToken?: string;
  resetTokenExpires?: number;
}

interface DatabaseSchema {
  users: DbUser[];
  projects: BrandingProject[];
  settings: {
    systemPromptVersion: string;
  };
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "brandspark-db.json");

const initialData: DatabaseSchema = {
  users: [],
  projects: [],
  settings: {
    systemPromptVersion: "1.0.0",
  },
};

// Ensure data directory and file exist
function initDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
      return initialData;
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Database initialization error:", err);
    return initialData;
  }
}

let dbMemoryCache: DatabaseSchema = initDb();

function saveDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempFile, DB_FILE);
    dbMemoryCache = data;
  } catch (err) {
    console.error("Database save error:", err);
  }
}

function getDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      dbMemoryCache = JSON.parse(raw);
    }
  } catch {
    // fallback to cache
  }
  return dbMemoryCache;
}

// User Methods
export function getUserByEmail(email: string): DbUser | null {
  const db = getDb();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function getUserById(id: string): DbUser | null {
  const db = getDb();
  return db.users.find((u) => u.id === id) || null;
}

export function createUser(userData: {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatar?: string;
}): User {
  const db = getDb();
  const now = new Date().toISOString();
  const newUser: DbUser = {
    id: userData.id,
    name: userData.name,
    email: userData.email.toLowerCase(),
    passwordHash: userData.passwordHash,
    avatar: userData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`,
    createdAt: now,
    updatedAt: now,
  };

  db.users.push(newUser);
  saveDb(db);

  // Return user without passwordHash
  const { passwordHash: _, resetToken: __, resetTokenExpires: ___, ...userSafe } = newUser;
  return userSafe;
}

export function updateUser(
  id: string,
  updates: Partial<Omit<DbUser, "id" | "createdAt">>
): User | null {
  const db = getDb();
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  db.users[index] = {
    ...db.users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveDb(db);
  const { passwordHash: _, resetToken: __, resetTokenExpires: ___, ...userSafe } = db.users[index];
  return userSafe;
}

export function setPasswordResetToken(
  email: string,
  token: string,
  expiresMs: number = 3600000 // 1 hour
): boolean {
  const db = getDb();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return false;

  user.resetToken = token;
  user.resetTokenExpires = Date.now() + expiresMs;
  saveDb(db);
  return true;
}

export function verifyAndResetPassword(token: string, newPasswordHash: string): boolean {
  const db = getDb();
  const user = db.users.find(
    (u) => u.resetToken === token && u.resetTokenExpires && u.resetTokenExpires > Date.now()
  );
  if (!user) return false;

  user.passwordHash = newPasswordHash;
  delete user.resetToken;
  delete user.resetTokenExpires;
  user.updatedAt = new Date().toISOString();
  saveDb(db);
  return true;
}

// Project Methods
export function getUserProjects(userId: string): BrandingProject[] {
  const db = getDb();
  return db.projects
    .filter((p) => p.userId === userId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getProjectById(projectId: string, userId?: string): BrandingProject | null {
  const db = getDb();
  const project = db.projects.find((p) => p.id === projectId);
  if (!project) return null;
  if (userId && project.userId !== userId) return null;
  return project;
}

export function saveProject(project: BrandingProject): BrandingProject {
  const db = getDb();
  const index = db.projects.findIndex((p) => p.id === project.id);
  const now = new Date().toISOString();

  if (index >= 0) {
    db.projects[index] = {
      ...project,
      updatedAt: now,
    };
  } else {
    db.projects.push({
      ...project,
      createdAt: project.createdAt || now,
      updatedAt: now,
    });
  }

  saveDb(db);
  return index >= 0 ? db.projects[index] : db.projects[db.projects.length - 1];
}

export function deleteProject(projectId: string, userId: string): boolean {
  const db = getDb();
  const initialLen = db.projects.length;
  db.projects = db.projects.filter((p) => !(p.id === projectId && p.userId === userId));
  if (db.projects.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}

export function duplicateProject(projectId: string, userId: string): BrandingProject | null {
  const original = getProjectById(projectId, userId);
  if (!original) return null;

  const now = new Date().toISOString();
  const duplicated: BrandingProject = {
    ...JSON.parse(JSON.stringify(original)),
    id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: `${original.name} (Copy)`,
    createdAt: now,
    updatedAt: now,
  };

  return saveProject(duplicated);
}
