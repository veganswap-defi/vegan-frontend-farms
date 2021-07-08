import React from 'react'
import styled from 'styled-components'
import {
  BlockIcon,
  CheckmarkCircleIcon,
  Flex,
  CrownIcon,
  Text,
  TeamPlayerIcon,
  TrophyGoldIcon,
} from '@pancakeswap-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { UserTradingInformationProps } from '../../types'
import { useCompetitionVeganRewards, getRewardGroupAchievements } from '../../helpers'
import { BoldTd, Td, StyledPrizeTable } from '../StyledPrizeTable'

const StyledThead = styled.thead`
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderColor};
`

const UserPrizeGrid: React.FC<{ userTradingInformation?: UserTradingInformationProps }> = ({
  userTradingInformation,
}) => {
  const { t } = useTranslation()
  const { userRewardGroup, userVeganRewards, userPointReward, canClaimNFT } = userTradingInformation
  const { veganReward, dollarValueOfVeganReward } = useCompetitionVeganRewards(userVeganRewards)
  const { champion, teamPlayer } = getRewardGroupAchievements(userRewardGroup)

  return (
    <StyledPrizeTable>
      <StyledThead>
        <tr>
          <th>{t('VEGAN Prizes ')}</th>
          <th>{t('Achievements')}</th>
          <th>{t('NFT')}</th>
        </tr>
      </StyledThead>
      <tbody>
        <tr>
          <BoldTd>
            <Flex flexDirection="column">
              <Text bold>{veganReward.toFixed(2)}</Text>
              <Text fontSize="12px" color="textSubtle">
                ~{dollarValueOfVeganReward} USD
              </Text>
            </Flex>
          </BoldTd>
          <Td>
            <Flex alignItems="center" flexWrap="wrap" justifyContent="center" width="100%">
              {champion && <CrownIcon mr={[0, '4px']} />}
              {teamPlayer && <TeamPlayerIcon mr={[0, '4px']} />}
              <TrophyGoldIcon mr={[0, '4px']} />
              <Text fontSize="12px" color="textSubtle">
                + {userPointReward} {t('points')}
              </Text>
            </Flex>
          </Td>
          <Td>{canClaimNFT ? <CheckmarkCircleIcon color="success" /> : <BlockIcon color="textDisabled" />}</Td>
        </tr>
      </tbody>
    </StyledPrizeTable>
  )
}

export default UserPrizeGrid
