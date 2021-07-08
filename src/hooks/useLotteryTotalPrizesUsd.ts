import { usePriceVeganBusd } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalRewards } from './useTickets'

const useLotteryTotalPrizesUsd = () => {
  const totalRewards = useTotalRewards()
  const totalVegan = getBalanceNumber(totalRewards)
  const veganPriceBusd = usePriceVeganBusd()

  return totalVegan * veganPriceBusd.toNumber()
}

export default useLotteryTotalPrizesUsd
