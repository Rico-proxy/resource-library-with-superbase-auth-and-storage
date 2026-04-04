import type { ResourceCategory, ResourceCategorySlug, ResourceDocument } from '@/types/resources'

type RawDoc = [title: string, author: string, rating: number, votes: number]
const fallbackCoverTone = 'from-zinc-200 to-zinc-300'

const makeDocs = (prefix: string, docs: RawDoc[]): ResourceDocument[] => {
  return docs.map((doc, index) => ({
    id: `${prefix}-${index + 1}`,
    title: doc[0],
    author: doc[1],
    rating: doc[2],
    votes: doc[3],
    format: 'PDF',
    coverTone: fallbackCoverTone,
  }))
}

const educationalPool = makeDocs('edu', [
  ['JAMB Complete Biology Revision Pack', 'Amina Bello', 93, 241],
  ['WAEC Mathematics Drill Workbook', 'Tobi Adeyemi', 89, 188],
  ['SS3 Physics Formula Handbook', 'Grace Okoro', 91, 162],
  ['Economics Essentials for Senior Secondary', 'Daniel Ojo', 87, 125],
  ['Chemistry Past Questions 2018-2025', 'Hassan Abdullahi', 95, 301],
  ['Study Techniques for Academic Excellence', 'Chioma Nwosu', 84, 96],
  ['English Comprehension Master Guide', 'Rita Adesanya', 90, 143],
  ['Introduction to Research Methods', 'Victor James', 86, 117],
])

const literaturePool = makeDocs('lit', [
  ['African Poetry Anthology for Students', 'Kemi Afolabi', 92, 173],
  ['Modern Drama Analysis Companion', 'Favour Musa', 88, 121],
  ['Classic Novels Reading Journal', 'Samuel Ibeh', 85, 99],
  ['Creative Writing Prompts and Exercises', 'Evelyn Okafor', 94, 207],
  ['Shakespeare Simplified Notes', 'John Eze', 83, 88],
  ['Contemporary Fiction Discussion Guide', 'Dami Onuoha', 90, 132],
  ['Poetic Devices Explained with Examples', 'Adaeze Iroha', 91, 158],
  ['World Literature Timeline Handbook', 'Yusuf Lawal', 87, 104],
])

const businessCareerPool = makeDocs('biz', [
  ['Personal Finance for Students', 'Harriet Udo', 94, 267],
  ['Entrepreneurship Starter Workbook', 'Emeka Chukwu', 89, 149],
  ['CV and Cover Letter Master Guide', 'Maryam Ibrahim', 90, 175],
  ['Interview Prep Question Bank', 'Stephen Oke', 86, 108],
  ['Remote Work Skills Handbook', 'Lilian Umeh', 88, 136],
  ['Business Communication Essentials', 'David Olanrewaju', 93, 214],
  ['Startup Fundamentals for Beginners', 'Blessing Jatau', 87, 127],
  ['Project Management Basics', 'Oluwatoyin Femi', 91, 166],
])

const historyPool = makeDocs('hist', [
  ['Ancient Civilizations Overview Notes', 'Ahmed Sule', 95, 318],
  ['Pre-Colonial African Kingdoms Reader', 'Juliet Okechukwu', 91, 184],
  ['World War II Timeline and Key Events', 'Chidi Nnamani', 89, 146],
  ['Nigerian History from 1800 to Present', 'Aisha Garba', 90, 171],
  ['Roman Empire Government Structure', 'Ifeoma Umeh', 87, 109],
  ['Medieval Europe Study Companion', 'Rasheed Bello', 86, 98],
  ['History Essay Writing Framework', 'Mercy Nwafor', 84, 74],
  ['Historical Maps and Interpretation', 'Kenneth Obi', 88, 122],
])

export const resourceCategories: ResourceCategory[] = [
  {
    slug: 'educational',
    name: 'Educational',
    shortDescription: 'Textbooks, class notes, exam prep, and learning resources.',
    headline: 'Educational Documents',
    intro: 'Explore practical study materials created for academic success.',
    about:
      'Educational resources cover classroom learning, exam preparation, and guided practice. From worksheets and lecture notes to revision packs, this category helps students build confidence and improve performance across key subjects.',
    recommended: educationalPool.slice(0, 6),
    trending: educationalPool.slice(2, 8),
    recentlyAdded: [...educationalPool].reverse().slice(0, 6),
  },
  {
    slug: 'literature',
    name: 'Literature',
    shortDescription: 'Poetry, prose, drama, and literary analysis resources.',
    headline: 'Literature Documents',
    intro: 'Discover reading and writing materials for literature students.',
    about:
      'The literature collection focuses on analysis, interpretation, and creative expression. Students can find guides for poetry and drama, simplified notes for classic texts, and practical writing resources for essays, reviews, and storytelling.',
    recommended: literaturePool.slice(0, 6),
    trending: literaturePool.slice(2, 8),
    recentlyAdded: [...literaturePool].reverse().slice(0, 6),
  },
  {
    slug: 'business-career',
    name: 'Business & Career',
    shortDescription: 'Career guides, business basics, and professional growth materials.',
    headline: 'Business & Career Documents',
    intro: 'Build practical business skills and career confidence.',
    about:
      'Business and career resources focus on employability, entrepreneurship, and workplace readiness. Students can learn resume writing, interview strategy, communication, and practical business foundations that help bridge school and real-world opportunities.',
    recommended: businessCareerPool.slice(0, 6),
    trending: businessCareerPool.slice(2, 8),
    recentlyAdded: [...businessCareerPool].reverse().slice(0, 6),
  },
  {
    slug: 'history',
    name: 'History',
    shortDescription: 'Ancient, modern, and regional history documents.',
    headline: 'History Documents',
    intro: 'Step through time with rich historical notes and references.',
    about:
      'History resources provide context and perspective on civilizations, political shifts, and social change. Students can access timelines, curated notes, and topic breakdowns that make historical narratives easier to understand and discuss.',
    recommended: historyPool.slice(0, 6),
    trending: historyPool.slice(2, 8),
    recentlyAdded: [...historyPool].reverse().slice(0, 6),
  },
]

export const getCategoryBySlug = (slug: string): ResourceCategory | undefined => {
  return resourceCategories.find((category) => category.slug === slug)
}

export const getCategoryBySlugStrict = (slug: ResourceCategorySlug): ResourceCategory => {
  return resourceCategories.find((category) => category.slug === slug) ?? resourceCategories[0]
}

export const recommendedForYou = resourceCategories.flatMap((category) => category.recommended).slice(0, 10)
