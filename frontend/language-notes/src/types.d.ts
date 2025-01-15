type PageNode = {
    id: number;
    name: string;
    sets: SetDetails[];
};

type SetDetails = {
    id: number;
    name: string;
};

type TranslationCard = {
  id: number;
  creator_id: string; // UUID
  english: string;
  meaning: string;
  translated: string;
  created_at: string; // ISO date string
  set_id: number;
  language: string;
};