import React, { useEffect, useMemo } from 'react'
import addresses from 'config/constants/contracts'
import { Route, useRouteMatch } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, Flex, Image } from '@pancakeswap-libs/uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { Pool } from 'state/types'
import { useAppDispatch } from 'state'
import { fetchFarmsPublicDataAsync, setLoadArchivedFarmsData } from 'state/farms'
import tokens from 'config/constants/tokens'
import { PoolCategory } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { fetchFarmUserDataAsync } from 'state/actions'
import useRefresh from 'hooks/useRefresh'
import usePersistState from 'hooks/usePersistState'
import { usePools, useBlock, useFarms } from 'state/hooks'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
import PoolCard from './components/PoolCard'
import CakeVaultCard from './components/CakeVaultCard'
import PoolTabButtons from './components/PoolTabButtons'
import BountyCard from './components/BountyCard'

const Pools: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const pools = usePools(account)
  const { currentBlock } = useBlock()
  const [stakedOnly, setStakedOnly] = usePersistState(false, 'pancake_pool_staked')

  const [finishedPools, openPools] = useMemo(
    () => partition(pools, (pool) => pool.isFinished || currentBlock > pool.endBlock),
    [currentBlock, pools],
  )
  const stakedOnlyPools = useMemo(
    () => openPools.filter((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)),
    [openPools],
  )
  const hasStakeInFinishedPools = useMemo(
    () => finishedPools.some((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)),
    [finishedPools],
  )
  // This pool is passed explicitly to the vegan vault
  const veganPoolData = useMemo(() => openPools.find((pool) => pool.sousId === 3), [openPools])

  const { data: farms } = useFarms()
  // console.log({ farms })
  const { fastRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  useEffect(() => {
    // Immediately request data for archived farms so users don't have to wait
    // 60 seconds for public data and 10 seconds for user data
    dispatch(fetchFarmsPublicDataAsync())
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [dispatch, account])

  // const farmPools: Pool[] = []
  const farmPools: Pool[] = farms
    .filter((el) => el.isTokenOnly)
    .map((farm) => {
      console.log(farm)
      return {
        sousId: farm.pid,
        stakingToken: farm.token,
        harvest: true,
        isFinished: false,
        sortOrder: 1,
        earningToken: tokens.vegan,
        poolCategory: PoolCategory.CORE,
        contractAddress: addresses.masterChef,
        tokenPerBlock: '1',
        poolWeight: new BigNumber(farm.poolWeight),
        totalStaked: new BigNumber(farm.tokenAmount || 0).times(DEFAULT_TOKEN_DECIMAL),
        userData: {
          allowance: farm.userData.allowance,
          pendingReward: farm.userData.earnings,
          sousId: farm.pid,
          stakedBalance: farm.userData.stakedBalance,
          stakingTokenBalance: '0',
        },
      }
    })

  console.log({ farmPools, openPools })

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, 'row']}>
          <Flex flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" size="xxl" color="secondary" mb="24px">
              {t('Vegan Pools')}
            </Heading>
            <Heading size="md" color="text">
              {t('Simply stake tokens to earn.')}
            </Heading>
            <Heading size="md" color="text">
              {t('High APR, low risk.')}
            </Heading>
          </Flex>
          <Flex height="fit-content" justifyContent="center" alignItems="center" mt={['24px', null, '0']}>
            <BountyCard />
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <PoolTabButtons
          stakedOnly={stakedOnly}
          setStakedOnly={setStakedOnly}
          hasStakeInFinishedPools={hasStakeInFinishedPools}
        />
        <FlexLayout>
          <Route exact path={`${path}`}>
            <div>
              <CakeVaultCard pool={veganPoolData} account={account} />
              {stakedOnly
                ? orderBy(stakedOnlyPools, ['sortOrder']).map((pool) => (
                    <PoolCard key={pool.sousId} pool={pool} account={account} />
                  ))
                : orderBy(openPools, ['sortOrder']).map((pool) => (
                    <PoolCard key={pool.sousId} pool={pool} account={account} />
                  ))}

              {farmPools.map((farmPool) => {
                return <PoolCard key={farmPool.sousId} pool={farmPool} account={account} />
              })}
            </div>
          </Route>
          <Route path={`${path}/history`}>
            {orderBy(finishedPools, ['sortOrder']).map((pool) => (
              <PoolCard key={pool.sousId} pool={pool} account={account} />
            ))}
          </Route>
        </FlexLayout>
        <Image mx="auto" mt="12px" src="/images/logo-wide.svg" alt="Vegan illustration" width={300} height={100} />
      </Page>
    </>
  )
}

export default Pools
