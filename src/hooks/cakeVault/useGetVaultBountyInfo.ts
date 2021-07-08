import { useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { useGetApiPrice } from 'state/hooks'
import { useCakeVaultContract } from 'hooks/useContract'
import { getFullDisplayBalance } from 'utils/formatBalance'
import makeBatchRequest from 'utils/makeBatchRequest'
import { getVeganAddress } from 'utils/addressHelpers'

const useGetVaultBountyInfo = (refresh?: number) => {
  const cakeVaultContract = useCakeVaultContract()
  const [estimatedCallBountyReward, setEstimatedCallBountyReward] = useState(null)
  const [totalPendingVeganRewards, setTotalPendingVeganRewards] = useState(null)
  const [dollarCallBountyToDisplay, setDollarBountyToDisplay] = useState(null)
  const [veganCallBountyToDisplay, setVeganBountyToDisplay] = useState(null)

  const veganPrice = useGetApiPrice(getVeganAddress())

  useEffect(() => {
    // Call contract to get estimated rewards
    const fetchRewards = async () => {
      const [estimatedRewards, pendingVeganRewards] = await makeBatchRequest([
        cakeVaultContract.methods.calculateHarvestVeganRewards().call,
        cakeVaultContract.methods.calculateTotalPendingVeganRewards().call,
      ])
      setEstimatedCallBountyReward(new BigNumber(estimatedRewards as string))
      setTotalPendingVeganRewards(new BigNumber(pendingVeganRewards as string))
    }
    fetchRewards()
  }, [cakeVaultContract, refresh])

  useEffect(() => {
    // Convert estimated rewards to dollars and a vegan display value
    if (estimatedCallBountyReward && veganPrice) {
      const dollarValueOfReward = estimatedCallBountyReward.multipliedBy(veganPrice)
      const estimatedDollars = getFullDisplayBalance(dollarValueOfReward, 18, 2)
      const estimatedVegan = getFullDisplayBalance(estimatedCallBountyReward, 18, 3)
      setDollarBountyToDisplay(estimatedDollars)
      setVeganBountyToDisplay(estimatedVegan)
    }
  }, [veganPrice, estimatedCallBountyReward])

  return { estimatedCallBountyReward, dollarCallBountyToDisplay, veganCallBountyToDisplay, totalPendingVeganRewards }
}

export default useGetVaultBountyInfo
