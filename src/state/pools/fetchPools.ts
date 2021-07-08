import { Pool } from 'state/types'
import poolsConfig from 'config/constants/pools'
import sousChefABI from 'config/abi/sousChef.json'
import veganABI from 'config/abi/cake.json'
import masterchefABI from 'config/abi/masterchef.json'
import wbnbABI from 'config/abi/weth.json'
import multicall from 'utils/multicall'
import { getAddress, getMasterChefAddress, getWbnbAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'

export const fetchPoolsBlockLimits = async () => {
  const poolsWithEnd = poolsConfig.filter((p) => p.sousId !== 3)
  const callsStartBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'startBlock',
    }
  })
  const callsEndBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'bonusEndBlock',
    }
  })

  const starts = await multicall(sousChefABI, callsStartBlock)
  const ends = await multicall(sousChefABI, callsEndBlock)

  return poolsWithEnd.map((veganPoolConfig, index) => {
    const startBlock = starts[index]
    const endBlock = ends[index]
    return {
      sousId: veganPoolConfig.sousId,
      startBlock: new BigNumber(startBlock).toJSON(),
      endBlock: new BigNumber(endBlock).toJSON(),
    }
  })
}

export const fetchPoolsTotalStaking = async () => {
  const nonBnbPools = poolsConfig.filter((p) => p.stakingToken.symbol !== 'BNB')
  const bnbPool = poolsConfig.filter((p) => p.stakingToken.symbol === 'BNB')

  const callsNonBnbPools = nonBnbPools.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.stakingToken.address),
      name: 'balanceOf',
      params: [getAddress(poolConfig.contractAddress)],
    }
  })

  const callsBnbPools = bnbPool.map((poolConfig) => {
    return {
      address: getWbnbAddress(),
      name: 'balanceOf',
      params: [getAddress(poolConfig.contractAddress)],
    }
  })

  async function getPoolsWeight() {
    return Promise.all(
      [...nonBnbPools, ...bnbPool].map(async (pool) => {
        if (pool.sousId !== 3) {
          return {
            sousId: pool.sousId,
            poolWeight: new BigNumber(1),
          }
        }

        const [info, totalAllocPoint] = await multicall(masterchefABI, [
          {
            address: getMasterChefAddress(),
            name: 'poolInfo',
            params: [pool.sousId],
          },
          {
            address: getMasterChefAddress(),
            name: 'totalAllocPoint',
          },
        ])

        const allocPoint = new BigNumber(info.allocPoint._hex)
        const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint))

        return {
          sousId: pool.sousId,
          poolWeight,
        }
      }),
    )
  }

  const nonBnbPoolsTotalStaked = await multicall(veganABI, callsNonBnbPools)
  const bnbPoolsTotalStaked = await multicall(wbnbABI, callsBnbPools)
  const poolsWeight = await getPoolsWeight()

  return [
    ...nonBnbPools.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(nonBnbPoolsTotalStaked[index]).toJSON(),
      poolWeight: poolsWeight.find((el) => el.sousId === p.sousId).poolWeight.toJSON(),
    })),
    ...bnbPool.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(bnbPoolsTotalStaked[index]).toJSON(),
      poolWeight: poolsWeight.find((el) => el.sousId === p.sousId).poolWeight.toJSON(),
    })),
  ]
}
