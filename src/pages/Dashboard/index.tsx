import { FC } from 'types/index'
import { useEffect, useState } from 'react'
import { getDashboardInfo, DashboardInfoType } from 'api/user'
import { error } from 'lib/error'
import { niceBytes } from 'lib/format'

import { Card } from 'antd'
import Icon from 'components/Icon'
import Loading from 'components/Loading'

import styles from './index.module.scss'

const { Meta } = Card

const bodyStyle = {
  width: '246px',
  minHeight: '165px',
}

function formatUsage(usage: number) {
  if (usage === undefined) {
    return '0'
  }

  const niceBytesUsage = niceBytes(`${usage}`).split(' ')

  if (niceBytesUsage.length !== 2) {
    return niceBytesUsage.join(' ')
  }
  return (
    <>
      {niceBytesUsage[0]}
      <span className={styles.smallUnit}>{niceBytesUsage[1]}</span>
    </>
  )
}

const prettyNumber = (usage: number | undefined) => {
  if (usage === undefined) {
    return 0
  }

  return usage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const Dashboard: FC = () => {
  const [dashboardInfo, setDashboardInfo] = useState<DashboardInfoType>({
    buckets: 0,
    objects: 0,
    usage: 0,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getDashboardInfo()
      .then((res) => {
        setDashboardInfo(res.data)
      })
      .catch(error)
      .finally(() => {
        setLoading(false)
      })
  }, [])
  return (
    <div className={styles.container}>
      {
        loading
          ? <Loading />
          : (
            <>
              <Card bodyStyle={bodyStyle} style={{ marginRight: '20px' }}>
                <Meta
                  className={styles['card-desc']}
                  avatar={
                    <Icon type="FieldTime" size="18px" />
                    }
                  title="总计容量"
                  description={formatUsage(dashboardInfo.usage)}
                />
              </Card>
              <Card bodyStyle={bodyStyle}>
                <Meta
                  avatar={
                    <Icon type="Block" size="18px" />
                    }
                  title="总计对象"
                  description={prettyNumber(dashboardInfo.objects)}
                  className={styles['card-desc']}
                />
              </Card>
            </>
          )
      }
    </div>
  )
}

export default Dashboard
