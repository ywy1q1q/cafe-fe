import fermentation12 from '@/assets/processing/fermentation-12h.png'
import fermentation24 from '@/assets/processing/fermentation-24h.png'
import fermentation48 from '@/assets/processing/fermentation-48h.png'
import fermentation72 from '@/assets/processing/fermentation-72h.png'

export interface FermentationStage {
  time: string
  title: string
  subtitle: string
  flavor: string
  description: string
  image: string
}

export const fermentationStages: FermentationStage[] = [
  {
    time: '12h',
    title: 'Clean and Bright',
    subtitle: 'Clean & Bright',
    flavor: 'Citrus and floral notes',
    description: 'A clean and bright profile with a lively acidity.',
    image: fermentation12,
  },
  {
    time: '24h',
    title: 'Balanced and Sweet',
    subtitle: 'Balanced & Sweet',
    flavor: 'Caramel, honey and soft fruit',
    description: 'More sweetness develops while acidity and body stay balanced.',
    image: fermentation24,
  },
  {
    time: '48h',
    title: 'Fruity and Jammy',
    subtitle: 'Fruity & Jammy',
    flavor: 'Berry and ripe fruit notes',
    description: 'Longer fermentation creates a richer fruity and jammy profile.',
    image: fermentation48,
  },
  {
    time: '72h',
    title: 'Winey and Complex',
    subtitle: 'Winey & Complex',
    flavor: 'Wine, dark fruit and cocoa',
    description: 'A deeper and more complex profile with winey fruit character.',
    image: fermentation72,
  },
]
