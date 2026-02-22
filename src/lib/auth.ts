export interface User {
  email: string;
  name: string;
}

const USERS_KEY = "covercraft_users";
const SESSION_KEY = "covercraft_session";

interface StoredUser {
  email: string;
  name: string;
  password: string;
}

function getUsers(): StoredUser[] {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function signUp(name: string, email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    return { success: false, error: "An account with this email already exists." };
  }
  users.push({ name, email, password });
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email, name }));
  return { success: true };
}

export function signIn(email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return { success: false, error: "Invalid email or password." };
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, name: user.name }));
  return { success: true };
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("covercraft_theme")
  document.documentElement.classList.remove("dark")
}

export function getSession(): User | null {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}
