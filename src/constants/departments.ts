export const DEPARTMENTS = [
  'Children',
  'Teens',
  'TeamOne',
  'Ushering',
  'Sanitation',
  'Edification',
  'Protocol',
  'Welfare',
  'Security',
  'Programs',
  'Alpha',
  'Logistics And Technical',
] as const

export type Department = (typeof DEPARTMENTS)[number]
