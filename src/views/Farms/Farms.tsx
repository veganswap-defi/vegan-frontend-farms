import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { Route, useRouteMatch, useLocation } from 'react-router-dom'
import { useAppDispatch } from 'state'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Image, Heading, RowType, Toggle, Text } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import CakeVaultCard from 'views/Pools/components/CakeVaultCard'
import PoolCard from 'views/Pools/components/PoolCard'
import { MigrationV2 } from 'components/Banner'
import { BLOCKS_PER_YEAR } from 'config'
import tokens from 'config/constants/tokens'
import { useFarms, usePriceVeganBusd, useGetApiPrices, usePriceBnbBusd, useBlock, usePools } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { useVeganPerBlock } from 'hooks/useTokenBalance'
import { fetchFarmUserDataAsync } from 'state/actions'
import usePersistState from 'hooks/usePersistState'
import { Farm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { getFarmApr } from 'utils/apr'
import { orderBy, partition } from 'lodash'
import { getAddress } from 'utils/addressHelpers'
import isArchivedPid from 'utils/farmHelpers'
import PageHeader from 'components/PageHeader'
import { fetchFarmsPublicDataAsync, setLoadArchivedFarmsData } from 'state/farms'
import Select, { OptionProps } from 'components/Select/Select'
import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'
import Table from './components/FarmTable/FarmTable'
import FarmTabButtons from './components/FarmTabButtons'
import SearchInput from './components/SearchInput'
import { RowProps } from './components/FarmTable/Row'
import ToggleView from './components/ToggleView/ToggleView'
import { DesktopColumnSchema, ViewMode } from './components/types'

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

const StyledImage = styled(Image)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 58px;
`
const NUMBER_OF_FARMS_VISIBLE = 12

export interface FarmsProps {
  tokenMode?: boolean
}

const Farms: React.FC<FarmsProps> = (farmsProps) => {
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { data: farmsLP, userDataLoaded } = useFarms()
  const veganPerBlock = useVeganPerBlock()
  const veganPrice = usePriceVeganBusd()
  const bnbPrice = usePriceBnbBusd()
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = usePersistState(ViewMode.TABLE, 'pancake_farm_view')
  const { account } = useWeb3React()
  const [sortOption, setSortOption] = useState('hot')
  const prices = useGetApiPrices()
  const { tokenMode } = farmsProps
  const pools = usePools(account)
  const { currentBlock } = useBlock()
  const [finishedPools, openPools] = useMemo(
    () => partition(pools, (pool) => pool.isFinished || currentBlock > pool.endBlock),
    [currentBlock, pools],
  )
  const stakedOnlyPools = useMemo(
    () => openPools.filter((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)),
    [openPools],
  )

  // This pool is passed explicitly to the vegan vault
  const veganPoolData = useMemo(() => openPools.find((pool) => pool.sousId === 3), [openPools])

  const dispatch = useAppDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const isArchived = pathname.includes('archived')
  const isInactive = pathname.includes('history')
  const isActive = !isInactive && !isArchived

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && userDataLoaded)

  const [stakedOnly, setStakedOnly] = useState(!isActive)
  useEffect(() => {
    setStakedOnly(!isActive)
  }, [isActive])

  useEffect(() => {
    // Makes the main scheduled fetching to request archived farms data
    dispatch(setLoadArchivedFarmsData(isArchived))

    // Immediately request data for archived farms so users don't have to wait
    // 60 seconds for public data and 10 seconds for user data
    if (isArchived) {
      dispatch(fetchFarmsPublicDataAsync())
      if (account) {
        dispatch(fetchFarmUserDataAsync(account))
      }
    }
  }, [isArchived, dispatch, account])

  const activeFarms = farmsLP.filter(
    (farm) => !!farm.isTokenOnly === !!tokenMode && farm.multiplier !== '0X' && !isArchivedPid(farm.pid),
  )
  const inactiveFarms = farmsLP.filter(
    (farm) => !!farm.isTokenOnly === !!tokenMode && farm.multiplier === '0X' && !isArchivedPid(farm.pid),
  )
  const archivedFarms = farmsLP.filter((farm) => isArchivedPid(farm.pid))

  const stakedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const stakedInactiveFarms = inactiveFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const stakedArchivedFarms = archivedFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const farmsList = useCallback(
    (farmsToDisplay: Farm[]): FarmWithStakedValue[] => {
      const cakePriceVsBNB = new BigNumber(farmsLP.find((farm) => farm.pid === 1)?.tokenPriceVsQuote || 0)

      let farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay
        .filter((farm) => farm.pid !== 3)
        .map((farm) => {
          if (!farm.lpTotalInQuoteToken || !prices) {
            return farm
          }

          const quoteTokenPriceUsd = prices[getAddress(farm.quoteToken.address).toLowerCase()]
          const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(quoteTokenPriceUsd)

          const cakeRewardPerBlock = veganPerBlock.times(farm.poolWeight)
          const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)
          let apr = cakePriceVsBNB.times(cakeRewardPerYear).div(farm.lpTotalInQuoteToken)

          if (farm.quoteToken.symbol === tokens.busd.symbol || farm.quoteToken.symbol === 'UST') {
            apr = cakePriceVsBNB.times(cakeRewardPerYear).div(farm.lpTotalInQuoteToken).times(bnbPrice)
          } else if (farm.quoteToken.symbol === tokens.vegan.symbol) {
            apr = cakeRewardPerYear.div(farm.lpTotalInQuoteToken)
          } else if (farm.dual) {
            const cakeApy =
              farm && cakePriceVsBNB.times(cakeRewardPerBlock).times(BLOCKS_PER_YEAR).div(farm.lpTotalInQuoteToken)
            const dualApy =
              farm.tokenPriceVsQuote &&
              new BigNumber(farm.tokenPriceVsQuote)
                .times(farm.dual.rewardPerBlock)
                .times(BLOCKS_PER_YEAR)
                .div(farm.lpTotalInQuoteToken)

            apr = cakeApy && dualApy && cakeApy.plus(dualApy)
          }

          return { ...farm, apr: apr.times(100).toNumber(), liquidity: totalLiquidity }
        })

      if (query) {
        const lowercaseQuery = query.toLowerCase()
        farmsToDisplayWithAPR = farmsToDisplayWithAPR.filter((farm: FarmWithStakedValue) => {
          return farm.lpSymbol.toLowerCase().includes(lowercaseQuery)
        })
      }
      return farmsToDisplayWithAPR
    },
    [prices, bnbPrice, farmsLP, query, veganPerBlock],
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const loadMoreRef = useRef<HTMLDivElement>(null)

  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)

  const farmsStakedMemoized = useMemo(() => {
    let farmsStaked = []

    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case 'apr':
          return orderBy(farms, (farm: FarmWithStakedValue) => farm.apr, 'desc')
        case 'multiplier':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0),
            'desc',
          )
        case 'earned':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.userData ? Number(farm.userData.earnings) : 0),
            'desc',
          )
        case 'liquidity':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc')
        default:
          return farms
      }
    }

    if (isActive) {
      farmsStaked = stakedOnly ? farmsList(stakedOnlyFarms) : farmsList(activeFarms)
    }
    if (isInactive) {
      farmsStaked = stakedOnly ? farmsList(stakedInactiveFarms) : farmsList(inactiveFarms)
    }
    if (isArchived) {
      farmsStaked = stakedOnly ? farmsList(stakedArchivedFarms) : farmsList(archivedFarms)
    }

    return sortFarms(farmsStaked).slice(0, numberOfFarmsVisible)
  }, [
    sortOption,
    activeFarms,
    farmsList,
    inactiveFarms,
    archivedFarms,
    isActive,
    isInactive,
    isArchived,
    stakedArchivedFarms,
    stakedInactiveFarms,
    stakedOnly,
    stakedOnlyFarms,
    numberOfFarmsVisible,
  ])

  useEffect(() => {
    const showMoreFarms = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfFarmsVisible((farmsCurrentlyVisible) => farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE)
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMoreFarms, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [farmsStakedMemoized, observerIsSet])

  const rowData = farmsStakedMemoized.map((farm) => {
    const { token, quoteToken } = farm
    const tokenAddress = token.address
    const quoteTokenAddress = quoteToken.address
    const lpLabel = farm.lpSymbol && farm.lpSymbol.split(' ')[0].toUpperCase().replace('PANCAKE', '')

    let totalLiquidity: BigNumber

    if (!farm.lpTotalInQuoteToken) {
      totalLiquidity = null
    } else if (farm.quoteToken.symbol === tokens.wbnb.symbol) {
      totalLiquidity = bnbPrice.times(farm.lpTotalInQuoteToken)
    } else if (farm.quoteToken.symbol === tokens.vegan.symbol) {
      totalLiquidity = veganPrice.times(farm.lpTotalInQuoteToken)
    } else {
      totalLiquidity = farm.lpTotalInQuoteToken
    }

    const row: RowProps = {
      apr: {
        value: farm.apr && farm.apr.toLocaleString('en', { maximumFractionDigits: 2 }),
        multiplier: farm.multiplier,
        lpLabel,
        tokenAddress,
        quoteTokenAddress,
        veganPrice,
        originalValue: farm.apr,
      },
      farm: {
        image: farm.lpSymbol.split(' ')[0].toLocaleLowerCase(),
        label: lpLabel,
        pid: farm.pid,
      },
      earned: {
        earnings: getBalanceNumber(new BigNumber(farm.userData.earnings)),
        pid: farm.pid,
      },
      liquidity: {
        liquidity: totalLiquidity,
      },
      multiplier: {
        multiplier: farm.multiplier,
      },
      details: farm,
    }

    return row
  })

  const renderContent = (): JSX.Element => {
    if (viewMode === ViewMode.TABLE && rowData.length && !tokenMode) {
      const columnSchema = DesktopColumnSchema

      const columns = columnSchema.map((column) => ({
        id: column.id,
        name: column.name,
        label: column.label,
        sort: (a: RowType<RowProps>, b: RowType<RowProps>) => {
          switch (column.name) {
            case 'farm':
              return b.id - a.id
            case 'apr':
              if (a.original.apr.value && b.original.apr.value) {
                return Number(a.original.apr.value) - Number(b.original.apr.value)
              }

              return 0
            case 'earned':
              return a.original.earned.earnings - b.original.earned.earnings
            default:
              return 1
          }
        },
        sortable: column.sortable,
      }))

      return <Table data={rowData} columns={columns} userDataReady={userDataReady} />
    }

    return (
      <div>
        <FlexLayout>
          {!!tokenMode && (
            <>
              <CakeVaultCard pool={veganPoolData} account={account} />
              {stakedOnly
                ? orderBy(stakedOnlyPools, ['sortOrder']).map((pool) => (
                    <PoolCard key={pool.sousId} pool={pool} account={account} />
                  ))
                : orderBy(openPools, ['sortOrder']).map((pool) => (
                    <PoolCard key={pool.sousId} pool={pool} account={account} />
                  ))}
            </>
          )}
        </FlexLayout>
        <FlexLayout>
          <Route exact path={`${path}`}>
            {farmsStakedMemoized.map((farm) => (
              <FarmCard
                key={farm.pid}
                farm={farm}
                bnbPrice={bnbPrice}
                veganPrice={veganPrice}
                account={account}
                removed={false}
              />
            ))}
          </Route>
          <Route exact path={`${path}/history`}>
            {farmsStakedMemoized.map((farm) => (
              <FarmCard
                key={farm.pid}
                farm={farm}
                bnbPrice={bnbPrice}
                veganPrice={veganPrice}
                account={account}
                removed
              />
            ))}
          </Route>
          <Route exact path={`${path}/archived`}>
            {farmsStakedMemoized.map((farm) => (
              <FarmCard
                key={farm.pid}
                farm={farm}
                bnbPrice={bnbPrice}
                veganPrice={veganPrice}
                account={account}
                removed
              />
            ))}
          </Route>
        </FlexLayout>
      </div>
    )
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  return (
    <>
      <PageHeader>
        <Heading as="h1" size="xxl" color="secondary" mb="24px">
          {tokenMode ? t('Pools') : t('Farms')}
        </Heading>
        <Heading size="lg" color="text">
          {tokenMode ? t('Stake tokens to earn.') : t('Stake Liquidity Pool (LP) tokens to earn.')}
        </Heading>
      </PageHeader>
      {/* <MigrationV2 /> */}
      <Page>
        {!tokenMode && (
          <ControlContainer>
            <ViewControls>
              <ToggleView viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} />
              <ToggleWrapper>
                <Toggle checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} scale="sm" />
                <Text> {t('Staked only')}</Text>
              </ToggleWrapper>
              <FarmTabButtons
                hasStakeInFinishedFarms={stakedInactiveFarms.length > 0}
                hasStakeInArchivedFarms={stakedArchivedFarms.length > 0}
              />
            </ViewControls>
            <FilterContainer>
              <LabelWrapper>
                <Text>SORT BY</Text>
                <Select
                  options={[
                    {
                      label: 'Hot',
                      value: 'hot',
                    },
                    {
                      label: 'APR',
                      value: 'apr',
                    },
                    {
                      label: 'Multiplier',
                      value: 'multiplier',
                    },
                    {
                      label: 'Earned',
                      value: 'earned',
                    },
                    {
                      label: 'Liquidity',
                      value: 'liquidity',
                    },
                  ]}
                  onChange={handleSortOptionChange}
                />
              </LabelWrapper>
              <LabelWrapper style={{ marginLeft: 16 }}>
                <Text>SEARCH</Text>
                <SearchInput onChange={handleChangeQuery} />
              </LabelWrapper>
            </FilterContainer>
          </ControlContainer>
        )}
        {renderContent()}
        <div ref={loadMoreRef} />
        <StyledImage src="/images/logo-wide.svg" alt="Vegan illustration" width={300} height={100} />
      </Page>
    </>
  )
}

export default Farms
