/**
 * Soumy's operating principles — edit this file to update hero book pages.
 * `image` — URL for the page illustration (swap with your own anytime).
 */
export type LeaderThought = {
  id: string;
  title: string;
  thought: string;
  source?: string;
  image: string;
};

export const BOOK_TITLE = "The Operator's Codex";
export const BOOK_SUBTITLE = 'Principles I lead by';
export const BOOK_COVER_IMAGE = '/assets/speaking/profile.jpg';

const img = (file: string) => `/assets/speaking/${file}`;

export const leaderThoughts: LeaderThought[] = [
  {
    id: 'perimeter',
    title: 'Perimeter is a mindset',
    thought: 'Security is not a product you buy at the end. It is the architecture of trust you build before the first line of code ships.',
    source: 'Field note',
    image: img('speaking-03.jpg'),
  },
  {
    id: 'clarity',
    title: 'Clarity beats complexity',
    thought: 'The best defenders make hard problems legible. If the board cannot understand the risk, you have not finished the analysis.',
    source: 'Executive briefing',
    image: img('speaking-02.jpg'),
  },
  {
    id: 'adversary',
    title: 'Think like the adversary',
    thought: 'Empathy for the attacker is not cynicism — it is craft. Model intent, not just indicators.',
    source: 'Red team ethos',
    image: img('speaking-01.jpg'),
  },
  {
    id: 'teach',
    title: 'Teach what you defend',
    thought: 'Training 2M+ learners taught me that scale changes culture. A secure organization is a learning organization.',
    source: 'Training philosophy',
    image: img('speaking-08.jpg'),
  },
  {
    id: 'stage',
    title: 'The stage is a lab',
    thought: 'Every keynote is an experiment in persuasion. If the room does not leave with one actionable idea, the talk was décor.',
    source: 'ISS World stage',
    image: img('speaking-06.jpg'),
  },
  {
    id: 'ai',
    title: 'AI needs guardrails, not fear',
    thought: 'The future is not humans versus machines. It is governed autonomy — policy, provenance, and proof at machine speed.',
    source: 'AI security',
    image: img('speaking-04.jpg'),
  },
  {
    id: 'gov',
    title: 'Mission over ego',
    thought: 'Government and telecom work demands humility. Critical infrastructure does not care about your résumé — only your reliability.',
    source: 'Gov engagements',
    image: img('speaking-07.jpg'),
  },
  {
    id: 'venture',
    title: 'Build, then secure, then scale',
    thought: 'Founders move fast. Security leaders move fast without breaking trust. The art is enabling velocity with verifiable control.',
    source: 'Venture advisory',
    image: img('speaking-05.jpg'),
  },
  {
    id: 'story',
    title: 'Stories move budgets',
    thought: 'A CVE number rarely changes behavior. A narrative about what breaks at 2 AM does.',
    source: 'Board communication',
    image: img('profile.jpg'),
  },
  {
    id: 'curiosity',
    title: 'Stay dangerously curious',
    thought: 'The threat landscape rewards the restless. Read widely, prototype wildly, publish generously.',
    source: 'Research habit',
    image: img('speaking-03.jpg'),
  },
  {
    id: 'team',
    title: 'Lift the room',
    thought: 'Leadership is measured in who gets credit when things go right — and who gets cover when they do not.',
    source: 'Team principle',
    image: img('speaking-02.jpg'),
  },
  {
    id: 'craft',
    title: 'Craft is credibility',
    thought: 'Demos, labs, and working exploits are the dialect of this field. Fluency earns the right to advise.',
    source: 'Hands-on craft',
    image: img('speaking-01.jpg'),
  },
  {
    id: 'resilience',
    title: 'Resilience is rehearsal',
    thought: 'Incident response is muscle memory. You do not rise to the occasion — you fall to the level of your preparation.',
    source: 'SOC doctrine',
    image: img('speaking-06.jpg'),
  },
  {
    id: 'legacy',
    title: 'Leave the grid better',
    thought: 'Impact is not followers or titles. It is whether the systems you touched are harder to harm after you leave.',
    source: 'Closing thought',
    image: img('speaking-08.jpg'),
  },
];
