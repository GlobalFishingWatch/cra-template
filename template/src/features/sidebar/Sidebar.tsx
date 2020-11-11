import React from 'react'
import Switch from '@globalfishingwatch/ui-components/dist/switch'
import { useGeneratorsConnect } from 'features/map/map.hooks'
import styles from './Sidebar.module.css'

function Sidebar(): React.ReactElement {
  const { generatorsConfig, updateGenerator } = useGeneratorsConnect()
  return (
    <div className={styles.aside}>
      <h2>Sidebar</h2>
      {generatorsConfig.map(({ id, visible = true }) => {
        return (
          <div key={id} className={styles.row}>
            <Switch
              active={visible}
              className={styles.switch}
              onClick={() => updateGenerator({ id, config: { visible: !visible } })}
            ></Switch>
            <span>Toggle {id} visibility</span>
          </div>
        )
      })}
    </div>
  )
}

export default Sidebar
