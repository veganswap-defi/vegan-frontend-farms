import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { getProfileContract } from 'utils/contractHelpers'
import makeBatchRequest from 'utils/makeBatchRequest'
import { BIG_ZERO } from 'utils/bigNumber'
import useToast from './useToast'

const useGetProfileCosts = () => {
  const [costs, setCosts] = useState({
    numberVeganToReactivate: BIG_ZERO,
    numberVeganToRegister: BIG_ZERO,
    numberVeganToUpdate: BIG_ZERO,
  })
  const { toastError } = useToast()

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const profileContract = getProfileContract()
        const [numberVeganToReactivate, numberVeganToRegister, numberVeganToUpdate] = await makeBatchRequest([
          profileContract.methods.numberVeganToReactivate().call,
          profileContract.methods.numberVeganToRegister().call,
          profileContract.methods.numberVeganToUpdate().call,
        ])

        setCosts({
          numberVeganToReactivate: new BigNumber(numberVeganToReactivate as string),
          numberVeganToRegister: new BigNumber(numberVeganToRegister as string),
          numberVeganToUpdate: new BigNumber(numberVeganToUpdate as string),
        })
      } catch (error) {
        toastError('Error', 'Could not retrieve VEGAN costs for profile')
      }
    }

    fetchCosts()
  }, [setCosts, toastError])

  return costs
}

export default useGetProfileCosts
