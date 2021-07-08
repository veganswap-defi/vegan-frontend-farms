import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'VeganSwap',
  description:
    'The most popular AMM on BSC by user count! Earn VEGAN through yield farming or win it in the Lottery, then stake it in Vegan Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by VeganSwap), NFTs, and more, on a platform you can trust.',
  image: 'ttps://veganswap.finance/images/vegan.png',
}

export const customMeta: { [key: string]: PageMeta } = {
  '/': {
    title: 'Home | VeganSwap',
  },
  '/competition': {
    title: 'Trading Battle | VeganSwap',
  },
  '/prediction': {
    title: 'Prediction | VeganSwap',
  },
  '/farms': {
    title: 'Farms | VeganSwap',
  },
  '/pools': {
    title: 'Pools | VeganSwap',
  },
  '/lottery': {
    title: 'Lottery | VeganSwap',
  },
  '/collectibles': {
    title: 'Collectibles | VeganSwap',
  },
  '/ifo': {
    title: 'Initial Farm Offering | VeganSwap',
  },
  '/teams': {
    title: 'Leaderboard | VeganSwap',
  },
  '/profile/tasks': {
    title: 'Task Center | VeganSwap',
  },
  '/profile': {
    title: 'Your Profile | VeganSwap',
  },
}
