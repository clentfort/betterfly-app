import {
  ParseDate,
  ParseFile,
  ParseObject,
  ParsePointer,
} from "@/parse-client";

export interface Category extends ParseObject {}
export interface Equipment extends ParseObject {}
export interface Muscle extends ParseObject {}
export interface Exercise extends ParseObject {
  number: string;
  name: string;
  type: string;
  strength: unknown;
  defaultImageUrl: string;
  defaultVideoUrl: string;
  muscle: ParsePointer<"Muscle", Muscle>;
  equipment: ParsePointer<"Equipment", Equipment>;
  createdAt: string;
  updatedAt: string;
  restriction: unknown[];
  description: string;
  deleted: boolean;
  edited: boolean;
  image: unknown;
  video: unknown;
  videoUrl: string;
  favorit: boolean;
}

export interface PlanRating {
  feedback: string;
  date: string;
}

export interface Plan extends ParseObject {
  startedAt: ParseDate;
  endedAt: ParseDate;
  name: string;
  text: string;
  user: ParsePointer<"User", UserExtended>;
  ratings?: PlanRating[];
  isTemplate?: boolean;
  minRepetition?: number;
  category?: ParsePointer<"Category", Category>;
  isMailSended?: boolean;
  storeId?: string;
  trainer?: string;
  isRunning?: boolean;
}

export interface PlanItemTimeSet {
  type: "TIME";
  time: number;
}

export interface PlanItemWeightSet {
  type: "WEIGHT";
  weight: number;
  repetitions: number;
}

export type PlanItemSet = PlanItemTimeSet | PlanItemWeightSet;

export type PlanItemSetHistory = {
  /** Date as YYYY-MM-DD */
  date: string;
  sets: PlanItemSet[];
};

export interface PlanItem extends ParseObject {
  currentSetIndex: null | number;
  exercise: ParsePointer<"Exercise", Exercise>;
  finishedSets: PlanItemSet[];
  history: PlanItemSetHistory[];
  note: string;
  openSets: PlanItemSet[];
  plan: ParsePointer<"Plan", Plan>;
  position: number;
  sets: PlanItemSet[];
  type: string;
}

interface UserExtended extends ParseObject {
  avatar: ParseFile;
  birthdate: ParseDate;
  cardId: string;
  category: ParsePointer<"Category", Category>;
  checkinAt: unknown | null;
  createdAt: string;
  currentPlan: ParsePointer<"Plan", Plan>;
  email: string;
  endedAt: unknown | null;
  externalId: string;
  isMailBlocked: boolean;
  isPrivacyAccepted: boolean;
  lastCheckinAt: ParseDate;
  level: number;
  male: boolean;
  name: string;
  number: string;
  onlineAt: ParseDate;
  sessionToken: string;
  standort: number;
  updatedAt: string;
  username: string;
}

declare module "@/parse-client" {
  interface User extends UserExtended {}

  interface PointerTypeToClassMap {
    Category: Category;
    Equipment: Equipment;
    Exercise: Exercise;
    Muscle: Muscle;
    Plan: Plan;
    PlanItem: PlanItem;
    User: UserExtended;
  }
}
