import { Role, MatchStatus } from "@prisma/client";

export type { Role, MatchStatus };

export interface TeacherWithUser {
  id: string;
  userId: string;
  bio: string | null;
  subjects: string[];
  location: string | null;
  hourlyRate: number | null;
  experience: number | null;
  available: boolean;
  phone: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

export interface CenterWithUser {
  id: string;
  userId: string;
  centerName: string;
  address: string | null;
  description: string | null;
  phone: string | null;
  website: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

export interface MatchRequestWithDetails {
  id: string;
  status: MatchStatus;
  subject: string | null;
  message: string | null;
  schedule: string | null;
  salary: number | null;
  createdAt: Date;
  teacher: {
    id: string;
    subjects: string[];
    user: { name: string; email: string };
  };
  center: {
    id: string;
    centerName: string;
    user: { name: string; email: string };
  };
}

export interface MessageWithUsers {
  id: string;
  content: string;
  read: boolean;
  createdAt: Date;
  sender: { id: string; name: string; image: string | null };
  receiver: { id: string; name: string; image: string | null };
}

// NextAuth 타입 확장
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      role: string;
    };
  }
}
