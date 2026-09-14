export const DEPARTMENTS = [
  'children dept.',
  'teens dept.',
  'teamone',
  'light team',
  'sanitation dept.',
  'edification team',
  'protocol dept.',
  'welfare dept.',
  'security dept.',
  'programs dept.',
  'alpha team',
  'logistics and technical dept.',
] as const

export type Department = (typeof DEPARTMENTS)[number]

export const DEPARTMENT_LABELS: Record<Department, string> = {
  'children dept.': 'Children',
  'teens dept.': 'Teens',
  'teamone': 'TeamOne',
  'light team': 'Light Team',
  'sanitation dept.': 'Sanitation',
  'edification team': 'Edification',
  'protocol dept.': 'Protocol',
  'welfare dept.': 'Welfare',
  'security dept.': 'Security',
  'programs dept.': 'Programs',
  'alpha team': 'Alpha',
  'logistics and technical dept.': 'Logistics And Technical',
}
