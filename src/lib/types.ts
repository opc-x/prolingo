export type Domain = {
  id: number;
  slug: string;
  name: string;
};

export type Term = {
  id: number;
  term: string;
  definitionZh: string;
  example?: string | null;
  domainName: string;
  domainSlug: string;
  phonetic?: string | null;
  pos?: string | null;
  exampleZh?: string | null;
  sceneNote?: string | null;
};

export type Lesson = {
  index: number;
  name: string;
  terms: Term[];
};
