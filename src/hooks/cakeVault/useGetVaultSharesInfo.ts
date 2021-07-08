import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { convertSharesToVegan } from 'views/Pools/helpers'
import { useCakeVaultContract } from 'hooks/useContract'
import makeBatchRequest from 'utils/makeBatchRequest'

const useGetVaultSharesInfo = (lastUpdated?: number) => {
  const cakeVaultContract = useCakeVaultContract()
  const [totalShares, setTotalShares] = useState(null)
  const [totalVeganInVault, setTotalVeganInVault] = useState(null)
  const [pricePerFullShare, setPricePerFullShare] = useState(null)

  useEffect(() => {
    const getTotalShares = async () => {
      const [sharePrice, shares] = await makeBatchRequest([
        cakeVaultContract.methods.getPricePerFullShare().call,
        cakeVaultContract.methods.totalShares().call,
      ])
      const sharePriceAsBigNumber = new BigNumber(sharePrice as string)
      const totalSharesAsBigNumber = new BigNumber(shares as string)
      const totalVeganInVaultEstimate = convertSharesToVegan(totalSharesAsBigNumber, sharePriceAsBigNumber)
      setPricePerFullShare(sharePriceAsBigNumber)
      setTotalShares(totalSharesAsBigNumber)
      setTotalVeganInVault(totalVeganInVaultEstimate.veganAsBigNumber)
    }
    getTotalShares()
  }, [cakeVaultContract, lastUpdated])

  return { totalShares, totalVeganInVault, pricePerFullShare }
}

export default useGetVaultSharesInfo
