import React from 'react'
import styled from 'styled-components'
import orderBy from 'lodash/orderBy'
import { Heading, Card, CardBody, Flex, ArrowForwardIcon } from '@pancakeswap-libs/uikit'
import { NavLink } from 'react-router-dom'
import pools from 'config/constants/pools'
import { Pool } from 'state/types'

const StyledFarmStakingCard = styled(Card)`
  background: linear-gradient(#53dee9, #30c67e);
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }

  transition: opacity 200ms;
  &:hover {
    opacity: 0.65;
  }
`
const CardMidContent = styled(Heading).attrs({ size: 'xl' })`
  line-height: 44px;
`
const EarnAssetCard = () => {
  const activeNonVeganPools = pools.filter((pool) => !pool.isFinished && !pool.earningToken.symbol.includes('VEGAN'))
  const latestPools: Pool[] = orderBy(activeNonVeganPools, ['sortOrder', 'pid'], ['desc', 'desc']).slice(0, 3)
  // Always include VEGAN
  const assets = ['VEGAN', ...latestPools.map((pool) => pool.earningToken.symbol)].join(', ')

  return (
    <StyledFarmStakingCard>
      <NavLink exact activeClassName="active" to="/syrup" id="pool-cta">
        <CardBody>
          <Heading color="contrast" size="lg">
            Earn
          </Heading>
          <CardMidContent color="invertedContrast">{assets}</CardMidContent>
          <Flex justifyContent="space-between">
            <Heading color="contrast" size="lg">
              in Pools
            </Heading>
            <NavLink exact activeClassName="active" to="/syrup" id="pool-cta">
              <ArrowForwardIcon mt={30} color="primary" />
            </NavLink>
          </Flex>
        </CardBody>
      </NavLink>
    </StyledFarmStakingCard>
  )
}

export default EarnAssetCard
