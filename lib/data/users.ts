import type { User } from "@/lib/types";
import { createId, readData, writeData } from "./store";

export async function getUsers(): Promise<User[]> {
  return readData<User[]>("users");
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = await getUsers();
  const normalised = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === normalised);
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const users = await getUsers();
  const existing = users.find((u) => u.email.toLowerCase() === input.email.toLowerCase());
  if (existing) return existing;

  const user: User = {
    id: createId("user"),
    name: input.name,
    email: input.email,
    password: input.password,
    createdAt: new Date().toISOString(),
  };
  await writeData("users", [...users, user]);
  return user;
}
