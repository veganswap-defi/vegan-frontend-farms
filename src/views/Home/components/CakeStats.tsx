import BigNumber from 'bignumber.js'
import React from 'react'
import { Card, CardBody, Heading, Text } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalSupply, useBurnedBalance, useVeganPerBlock } from 'hooks/useTokenBalance'
import { useTranslation } from 'contexts/Localization'
import { getVeganAddress } from 'utils/addressHelpers'
import { useFarms, usePriceVeganBusd } from 'state/hooks'
import CardValue from './CardValue'

const StyledCakeStats = styled(Card)`
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

const CakeStats = () => {
  const { t } = useTranslation()
  const totalSupply = useTotalSupply()
  const burnedBalance = getBalanceNumber(useBurnedBalance(getVeganAddress()))
  const veganSupply = totalSupply ? getBalanceNumber(totalSupply) - burnedBalance : 0
  const veganPerBlock = useVeganPerBlock()
  const veganPriceUsd = usePriceVeganBusd()
  const marketCap = veganPriceUsd.times(veganSupply)

  return (
    <StyledCakeStats>
      <CardBody>
        <Heading size="xl" mb="24px">
          {t('Vegan Stats')}
        </Heading>
        <Row>
          <Text fontSize="14px">{t('Market Cap')}</Text>
          <CardValue fontSize="14px" decimals={0} prefix="$" value={marketCap.toNumber()} />
        </Row>
        <Row>
          <Text fontSize="14px">{t('Total VEGAN Supply')}</Text>
          {veganSupply && <CardValue fontSize="14px" value={veganSupply} />}
        </Row>
        <Row>
          <Text fontSize="14px">{t('New VEGAN/block')}</Text>
          <CardValue fontSize="14px" decimals={0} value={veganPerBlock.toNumber()} />
        </Row>
      </CardBody>
    </StyledCakeStats>
  )
}

export default CakeStats
