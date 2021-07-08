import React from 'react'
import { Text } from '@pancakeswap-libs/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalRewards } from 'hooks/useTickets'
import { useTranslation } from 'contexts/Localization'
import { usePriceVeganBusd } from 'state/hooks'
import { BigNumber } from 'bignumber.js'
import CardBusdValue from './CardBusdValue'

const LotteryJackpot = () => {
  const { t } = useTranslation()
  const lotteryPrizeAmount = useTotalRewards()
  const balance = getBalanceNumber(lotteryPrizeAmount)
  const lotteryPrizeAmountVegan = balance.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })
  const veganPriceBusd = usePriceVeganBusd()
  const lotteryPrizeAmountBusd = new BigNumber(balance).multipliedBy(veganPriceBusd).toNumber()

  return (
    <>
      <Text bold fontSize="24px" style={{ lineHeight: '1.5' }}>
        {t(`%amount% VEGAN`, { amount: lotteryPrizeAmountVegan })}
      </Text>
      {!veganPriceBusd.eq(0) ? <CardBusdValue value={lotteryPrizeAmountBusd} /> : <br />}
    </>
  )
}

export default LotteryJackpot
