// Gallery cases. Images live in public/img/gallery/<id>-<n>.webp (1-based).
// kind 'pair'  = before / after slider (2 photos)
// kind 'steps' = a sequence of photos of one case (3+ photos)
export type CaseCat = 'hygiene' | 'caries' | 'restoration';
export interface CaseDef { id: string; cat: CaseCat; kind: 'pair' | 'steps'; n: number; text: string; ratio: string }

export const cases: CaseDef[] = [
  { id: 'h-lower-1', cat: 'hygiene', kind: 'pair', n: 2, text: 'hygieneLower', ratio: '3/2' },
  { id: 'h-front-1', cat: 'hygiene', kind: 'pair', n: 2, text: 'hygieneFront', ratio: '3/2' },
  { id: 'caries-dam', cat: 'caries', kind: 'steps', n: 3, text: 'cariesDam', ratio: '3/2' },
  { id: 'h-lower-2', cat: 'hygiene', kind: 'pair', n: 2, text: 'hygieneLower', ratio: '3/2' },
  { id: 'old-1', cat: 'caries', kind: 'pair', n: 2, text: 'oldCaries', ratio: '1/1' },
  { id: 'h-front-2', cat: 'hygiene', kind: 'pair', n: 2, text: 'hygieneFront', ratio: '3/2' },
  { id: 'old-3', cat: 'hygiene', kind: 'pair', n: 2, text: 'calculus', ratio: '1/1' },
  { id: 'restore-steps', cat: 'restoration', kind: 'steps', n: 4, text: 'restoreSteps', ratio: '3/4' },
  { id: 'h-lower-3', cat: 'hygiene', kind: 'pair', n: 2, text: 'hygieneLower', ratio: '3/2' },
  { id: 'old-4', cat: 'hygiene', kind: 'pair', n: 2, text: 'hygieneJaw', ratio: '3/2' },
  { id: 'h-front-3', cat: 'hygiene', kind: 'pair', n: 2, text: 'hygieneFront', ratio: '3/2' },
  { id: 'h-lower-4', cat: 'hygiene', kind: 'pair', n: 2, text: 'hygieneLower', ratio: '3/2' },
  { id: 'old-5', cat: 'hygiene', kind: 'pair', n: 2, text: 'plaque', ratio: '4/3' },
  { id: 'h-front-4', cat: 'hygiene', kind: 'pair', n: 2, text: 'hygieneFront', ratio: '3/2' },
];
