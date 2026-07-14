export const DEPARTMENTS = [
  'Children Dept.',
  'Teens Dept.',
  'TeamOne',
  'Light Team',
  'Sanitation Dept.',
  'Edification Team',
  'Protocol Dept.',
  'Welfare Dept.',
  'Security Dept.',
  'Programs Dept.',
  'Alpha Team',
  'Logistics And Technical Dept.',
] as const

export type Department = (typeof DEPARTMENTS)[number]
