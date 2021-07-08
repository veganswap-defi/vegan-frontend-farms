import React from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout } from '@pancakeswap-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/layout/Page'
import FarmStakingCard from 'views/Home/components/FarmStakingCard'
import LotteryCard from 'views/Home/components/LotteryCard'
import TwitterCard from 'views/Home/components/TwitterCard'
import CakeStats from 'views/Home/components/CakeStats'
import TotalValueLockedCard from 'views/Home/components/TotalValueLockedCard'
import EarnAPRCard from 'views/Home/components/EarnAPRCard'
import EarnAssetCard from 'views/Home/components/EarnAssetCard'
import WinCard from 'views/Home/components/WinCard'

const Hero = styled.div`
  /* align-items: center; */
  /* background: url('/images/banner.png') no-repeat center; */
  /* background-size: cover; */
  /* background-repeat: no-repeat; */
  /* background-position: top center; */
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  /* padding-top: 116px; */
  /* height: 200px; */
  text-align: center;

  /* ${({ theme }) => theme.mediaQueries.lg} {
    background-image: url('/images/pan-bg2.svg'), url('/images/pan-bg.svg');
    background-position: left center, right center;
    height: 165px;
    padding-top: 0;
  } */
`

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`

const CTACards = styled(BaseLayout)`
  align-items: start;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`

const ImgWrapper = styled.section`
  border-radius: 32px;
  overflow: hidden;
  display: flex;
  img {
    max-height: 220px;
  }
`

const Home: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Page>
      <Hero>
        <ImgWrapper>
          <img src="/images/banner.png" alt="vegan banner" />
        </ImgWrapper>
        {/* <Heading as="h1" size="xl" mb="24px" color="secondary">
          {t('VeganSwap')}
        </Heading>
        <Text>{t('The #1 AMM and yield farm on Binance Smart Chain.')}</Text> */}
      </Hero>
      <div>
        <Cards>
          <FarmStakingCard />
          <TwitterCard />
        </Cards>
        <CTACards>
          <EarnAPRCard />
          <EarnAssetCard />
          {/* <WinCard /> */}
        </CTACards>
        <Cards>
          <CakeStats />
          <TotalValueLockedCard />
        </Cards>
      </div>
    </Page>
  )
}

export default Home
