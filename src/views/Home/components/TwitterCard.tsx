import React from 'react'
import { Card, CardBody, Heading } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { Timeline } from 'react-twitter-widgets'
import { useTranslation } from 'contexts/Localization'

const StyledTwitterCard = styled(Card)`
  margin-left: auto;
  margin-right: auto;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`

const TwitterCard = () => {
  const { t } = useTranslation()

  return (
    <StyledTwitterCard>
      <CardBody>
        <Heading size="xl" mb="24px">
          {t('Announcements')}
        </Heading>
        <Timeline
          dataSource={{
            sourceType: 'profile',
            screenName: 'veganswap',
          }}
          options={{
            height: '250',
            chrome: 'noheader, nofooter',
            width: '100%',
          }}
        />
      </CardBody>
    </StyledTwitterCard>
  )
}

export default TwitterCard