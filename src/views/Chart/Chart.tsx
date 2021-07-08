import React from 'react'
import IFrame from 'views/Trade'
import FullPage from './components/FullPage'

const Chart: React.FC = () => {
  return (
    <FullPage>
      <IFrame
        title="chart"
        url="https://goswappcharts.web.app/?isbsc=true&tokenId=0x901e58695306b5c33c5169334e921a4cf4841571"
      />
    </FullPage>
  )
}

export default Chart
