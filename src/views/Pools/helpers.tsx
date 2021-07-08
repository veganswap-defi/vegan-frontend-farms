import BigNumber from 'bignumber.js'
import { getBalanceNumber, getFullDisplayBalance, getDecimalAmount } from 'utils/formatBalance'

export const convertSharesToVegan = (
  shares: BigNumber,
  veganPerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
) => {
  const sharePriceNumber = getBalanceNumber(veganPerFullShare, decimals)
  const amountInVegan = new BigNumber(shares.multipliedBy(sharePriceNumber))
  const veganAsNumberBalance = getBalanceNumber(amountInVegan, decimals)
  const veganAsBigNumber = getDecimalAmount(new BigNumber(veganAsNumberBalance), decimals)
  const veganAsDisplayBalance = getFullDisplayBalance(amountInVegan, decimals, decimalsToRound)
  return { veganAsNumberBalance, veganAsBigNumber, veganAsDisplayBalance }
}

export const convertVeganToShares = (
  vegan: BigNumber,
  veganPerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
) => {
  const sharePriceNumber = getBalanceNumber(veganPerFullShare, decimals)
  const amountInShares = new BigNumber(vegan.dividedBy(sharePriceNumber))
  const sharesAsNumberBalance = getBalanceNumber(amountInShares, decimals)
  const sharesAsBigNumber = getDecimalAmount(new BigNumber(sharesAsNumberBalance), decimals)
  const sharesAsDisplayBalance = getFullDisplayBalance(amountInShares, decimals, decimalsToRound)
  return { sharesAsNumberBalance, sharesAsBigNumber, sharesAsDisplayBalance }
}
