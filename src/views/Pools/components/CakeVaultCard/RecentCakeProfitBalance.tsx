import React from 'react'
import BigNumber from 'bignumber.js'
import { TooltipText, useTooltip } from '@pancakeswap-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { convertSharesToVegan } from '../../helpers'

interface RecentCakeProfitBalanceProps {
  veganAtLastUserAction: BigNumber
  userShares: BigNumber
  pricePerFullShare: BigNumber
}

const RecentCakeProfitBalance: React.FC<RecentCakeProfitBalanceProps> = ({
  veganAtLastUserAction,
  userShares,
  pricePerFullShare,
}) => {
  const currentSharesAsVegan = convertSharesToVegan(userShares, pricePerFullShare)
  const veganProfit = currentSharesAsVegan.veganAsBigNumber.minus(veganAtLastUserAction)
  const veganToDisplay = veganProfit.gte(0) ? getFullDisplayBalance(veganProfit, 18, 5) : '0'
  
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Your estimated earnings since last manual stake or unstake:'),
    { placement: 'bottom-end' },
  )

  return (
    <>
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef} small>
        {veganToDisplay}
      </TooltipText>
    </>
  )
}

export default RecentCakeProfitBalance
