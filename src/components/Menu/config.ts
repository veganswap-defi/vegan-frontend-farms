import { MenuEntry } from '@pancakeswap-libs/uikit'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    items: [
      {
        label: 'Exchange',
        href: 'https://exchange.veganswap.finance/',
      },
      {
        label: 'Liquidity',
        href: 'https://exchange.veganswap.finance/#/pool',
      },
    ],
  },
  {
    label: 'Farms',
    icon: 'FarmIcon',
    href: '/farms',
  },
  {
    label: 'Pools',
    icon: 'PoolIcon',
    href: '/pools',
  },
  // {
  //   label: 'Pools',
  //   icon: 'PoolIcon',
  //   href: '/pools',
  // },
  // {
  //   label: 'Lottery',
  //   icon: 'TicketIcon',
  //   href: '/lottery',
  // },
  // {
  //   label: 'NFT',
  //   icon: 'NftIcon',
  //   href: '/nft',
  // },
  {
    label: 'Price Chart',
    icon: 'ChartIcon',
    href: '/chart',
  },
  {
    label: 'Audits',
    icon: 'AuditIcon',
    items: [
      {
        label: 'Techrate',
        href: 'https://veganswap.finance/files/techrateAudit.pdf',
      },
    ],
  },
  {
    label: 'Our Partners',
    icon: 'GroupsIcon',
    items: [
      {
        label: 'Whirl Finance',
        href: 'https://whirlfinance.io',
      },
      {
        label: 'FlashX Ultra',
        href: 'https://www.flashxultra.com/',
      },
    ],
  },
  {
    label: 'Listings',
    icon: 'ListingIcon',
    items: [
      {
        label: 'DappRadar',
        href: 'https://dappradar.com/binance-smart-chain/defi/vegan-swap',
      },
      {
        label: 'Blockfolio',
        href: 'https://blockfolio.com/coin/VEGAN',
      },
    ],
  },
  {
    label: 'Info',
    icon: 'InfoIcon',
    items: [
      {
        label: 'Roadmap',
        href: 'https://vegandefi.medium.com/vegan-swap-roadmap-94d69f7653b',
      },
      {
        label: 'Overview',
        href: 'https://pancakeswap.info/token/0x901e58695306b5c33c5169334e921a4cf4841571',
      },
      // {
      //   label: 'CoinGecko',
      //   href: 'https://www.coingecko.com/en/coins/goose-finance',
      // },
      // {
      //   label: 'CoinMarketCap',
      //   href: 'https://coinmarketcap.com/currencies/goose-finance/',
      // },
      // {
      //   label: 'AstroTools',
      //   href: 'https://app.astrotools.io/pancake-pair-explorer/0x19e7cbecdd23a16dfa5573df54d98f7caae03019',
      // },
    ],
  },
  {
    label: 'More',
    icon: 'MoreIcon',
    items: [
      {
        label: 'Github',
        href: 'https://github.com/veganswap-defi/',
      },
      // {
      //   label: 'Docs',
      //   href: 'https://goosedefi.gitbook.io/goose-finance/',
      // },
      {
        label: 'Blog',
        href: 'https://vegandefi.medium.com/',
      },
    ],
  },
  // {
  //   label: 'Partnerships/IFO',
  //   icon: 'GooseIcon',
  //   href:
  //     'https://docs.google.com/forms/d/e/1FAIpQLSe7ycrw8Dq4C5Vjc9WNlRtTxEhFDB1Ny6jlAByZ2Y6qBo7SKg/viewform?usp=sf_link',
  // },
  // {
  //   label: 'Audit by Hacken',
  //   icon: 'AuditIcon',
  //   href: 'https://www.goosedefi.com/files/hackenAudit.pdf',
  // },
  // {
  //   label: 'Audit by CertiK',
  //   icon: 'AuditIcon',
  //   href: 'https://certik.org/projects/goose-finance',
  // },
]

export default config
