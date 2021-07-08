import BigNumber from 'bignumber.js'

export interface VaultUser {
  shares: BigNumber
  veganAtLastUserAction: BigNumber
  lastDepositedTime: string
  lastUserActionTime: string
}
