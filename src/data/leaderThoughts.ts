/**
 * Soumy's operating principles — edit this file to update hero book pages.
 */
export type LeaderThought = {
  id: string;
  title: string;
  thought: string;
  source?: string;
};

export const BOOK_TITLE = "The Operator's Codex";
export const BOOK_SUBTITLE = 'Principles I lead by';

export const leaderThoughts: LeaderThought[] = [
  {
    id: 'perimeter',
    title: 'Perimeter is a mindset',
    thought: 'Security is not a product you buy at the end. It is the architecture of trust you build before the first line of code ships.',
    source: 'Field note',
  },
  {
    id: 'clarity',
    title: 'Clarity beats complexity',
    thought: 'The best defenders make hard problems legible. If the board cannot understand the risk, you have not finished the analysis.',
    source: 'Executive briefing',
  },
  {
    id: 'adversary',
    title: 'Think like the adversary',
    thought: 'Empathy for the attacker is not cynicism — it is craft. Model intent, not just indicators.',
    source: 'Red team ethos',
  },
  {
    id: 'teach',
    title: 'Teach what you defend',
    thought: 'Training 2M+ learners taught me that scale changes culture. A secure organization is a learning organization.',
    source: 'Training philosophy',
  },
  {
    id: 'stage',
    title: 'The stage is a lab',
    thought: 'Every keynote is an experiment in persuasion. If the room does not leave with one actionable idea, the talk was décor.',
    source: 'ISS World stage',
  },
  {
    id: 'ai',
    title: 'AI needs guardrails, not fear',
    thought: 'The future is not humans versus machines. It is governed autonomy — policy, provenance, and proof at machine speed.',
    source: 'AI security',
  },
  {
    id: 'gov',
    title: 'Mission over ego',
    thought: 'Government and telecom work demands humility. Critical infrastructure does not care about your résumé — only your reliability.',
    source: 'Gov engagements',
  },
  {
    id: 'venture',
    title: 'Build, then secure, then scale',
    thought: 'Founders move fast. Security leaders move fast without breaking trust. The art is enabling velocity with verifiable control.',
    source: 'Venture advisory',
  },
  {
    id: 'story',
    title: 'Stories move budgets',
    thought: 'A CVE number rarely changes behavior. A narrative about what breaks at 2 AM does.',
    source: 'Board communication',
  },
  {
    id: 'curiosity',
    title: 'Stay dangerously curious',
    thought: 'The threat landscape rewards the restless. Read widely, prototype wildly, publish generously.',
    source: 'Research habit',
  },
  {
    id: 'team',
    title: 'Lift the room',
    thought: 'Leadership is measured in who gets credit when things go right — and who gets cover when they do not.',
    source: 'Team principle',
  },
  {
    id: 'craft',
    title: 'Craft is credibility',
    thought: 'Demos, labs, and working exploits are the dialect of this field. Fluency earns the right to advise.',
    source: 'Hands-on craft',
  },
  {
    id: 'resilience',
    title: 'Resilience is rehearsal',
    thought: 'Incident response is muscle memory. You do not rise to the occasion — you fall to the level of your preparation.',
    source: 'SOC doctrine',
  },
  {
    id: 'legacy',
    title: 'Leave the grid better',
    thought: 'Impact is not followers or titles. It is whether the systems you touched are harder to harm after you leave.',
    source: 'Closing thought',
  },
];
