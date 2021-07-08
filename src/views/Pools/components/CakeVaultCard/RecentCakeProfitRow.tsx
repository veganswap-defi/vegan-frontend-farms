import React from 'react'
import BigNumber from 'bignumber.js'
import { Flex, Text } from '@pancakeswap-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import RecentCakeProfitBalance from './RecentCakeProfitBalance'

interface RecentCakeProfitRowProps {
  account: string
  veganAtLastUserAction: BigNumber
  userShares: BigNumber
  pricePerFullShare: BigNumber
}

const RecentVeganProfitCountdownRow: React.FC<RecentCakeProfitRowProps> = ({
  account,
  veganAtLastUserAction,
  userShares,
  pricePerFullShare,
}) => {
  const { t } = useTranslation()
  const shouldDisplayVeganProfit =
    account && veganAtLastUserAction && veganAtLastUserAction.gt(0) && userShares && userShares.gt(0)

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text fontSize="14px">{t('Recent VEGAN profit:')}</Text>
      {shouldDisplayVeganProfit && (
        <RecentCakeProfitBalance
          veganAtLastUserAction={veganAtLastUserAction}
          userShares={userShares}
          pricePerFullShare={pricePerFullShare}
        />
      )}
    </Flex>
  )
}

export default RecentVeganProfitCountdownRow
