import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from '@pancakeswap-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { useGetStats } from 'hooks/api'
import { useTotalValue } from 'state/hooks'
import CardValue from './CardValue'

const StyledTotalValueLockedCard = styled(Card)`
  align-items: center;
  display: flex;
  flex: 1;
`

const TotalValueLockedCard = () => {
  const { t } = useTranslation()
  const totalValue = useTotalValue()
  // const data = useGetStats()
  // const tvl = data ? data.total_value_locked_all.toLocaleString('en', { maximumFractionDigits: 0 }) : null

  return (
    <StyledTotalValueLockedCard>
      <CardBody>
        <Heading size="lg" mb="24px">
          {t('Total Value Locked (TVL)')}
        </Heading>
        {totalValue ? (
          <>
            <CardValue value={totalValue.toNumber()} prefix="$" decimals={2} />
            <Text color="textSubtle">{t('Across all LPs and Pools')}</Text>
          </>
        ) : (
          <Skeleton height={66} />
        )}
      </CardBody>
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard
