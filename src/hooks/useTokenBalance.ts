import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getBep20Contract, getVeganContract } from 'utils/contractHelpers'
import { useFarms } from 'state/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import useWeb3 from './useWeb3'
import useRefresh from './useRefresh'
import useLastUpdated from './useLastUpdated'

const useTokenBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(BIG_ZERO)
  const { account } = useWeb3React()
  const web3 = useWeb3()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress, web3)
      const res = await contract.methods.balanceOf(account).call()
      setBalance(new BigNumber(res))
    }

    if (account) {
      fetchBalance()
    }
  }, [account, tokenAddress, web3, fastRefresh])

  return balance
}

export const useTotalSupply = () => {
  const { slowRefresh } = useRefresh()
  const [totalSupply, setTotalSupply] = useState<BigNumber>()

  useEffect(() => {
    async function fetchTotalSupply() {
      const veganContract = getVeganContract()
      const supply = await veganContract.methods.totalSupply().call()
      setTotalSupply(new BigNumber(supply))
    }

    fetchTotalSupply()
  }, [slowRefresh])

  return totalSupply
}

export const useVeganPerBlock = () => {
  const { slowRefresh } = useRefresh()
  const farms = useFarms()
  const [veganPerBlock, setVeganPerBlock] = useState<BigNumber>(new BigNumber(1))

  useEffect(() => {
    if (farms.data[0]?.veganPerBlock) {
      const value = new BigNumber(farms.data[0].veganPerBlock).div(new BigNumber(10).pow(18))
      setVeganPerBlock(value)
    }
  }, [slowRefresh, farms])

  return veganPerBlock
}

export const useBurnedBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(BIG_ZERO)
  const { slowRefresh } = useRefresh()
  const web3 = useWeb3()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress, web3)
      const res = await contract.methods.balanceOf('0x000000000000000000000000000000000000dEaD').call()
      setBalance(new BigNumber(res))
    }

    fetchBalance()
  }, [web3, tokenAddress, slowRefresh])

  return balance
}

export const useGetBnbBalance = () => {
  const [balance, setBalance] = useState(BIG_ZERO)
  const { account } = useWeb3React()
  const { lastUpdated, setLastUpdated } = useLastUpdated()
  const web3 = useWeb3()

  useEffect(() => {
    const fetchBalance = async () => {
      const walletBalance = await web3.eth.getBalance(account)
      setBalance(new BigNumber(walletBalance))
    }

    if (account) {
      fetchBalance()
    }
  }, [account, web3, lastUpdated, setBalance])

  return { balance, refresh: setLastUpdated }
}

export default useTokenBalance
