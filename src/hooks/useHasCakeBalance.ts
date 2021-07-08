import BigNumber from 'bignumber.js'
import { getVeganAddress } from 'utils/addressHelpers'
import useTokenBalance from './useTokenBalance'

/**
 * A hook to check if a wallet's VEGAN balance is at least the amount passed in
 */
const useHasCakeBalance = (minimumBalance: BigNumber) => {
  const veganBalance = useTokenBalance(getVeganAddress())
  return veganBalance.gte(minimumBalance)
}

export default useHasCakeBalance
