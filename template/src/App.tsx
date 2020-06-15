import React, { useState, Fragment } from 'react'
import { useSelector } from 'react-redux'
import SplitView from '@globalfishingwatch/ui-components/dist/split-view'
import Login from './features/user/Login'
import Map from './features/map/Map'
import Sidebar from './features/sidebar/Sidebar'
import styles from './App.module.css'
import { isUserLogged } from './features/user/user.slice'
import '@globalfishingwatch/ui-components/dist/base.css'

function App(): React.ReactElement {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const logged = useSelector(isUserLogged)

  const onToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <Fragment>
      <Login />
      {!logged ? (
        <div className={styles.placeholder}>Loading</div>
      ) : (
        <SplitView
          isOpen={sidebarOpen}
          onToggle={onToggle}
          aside={<Sidebar />}
          main={<Map />}
          asideWidth="30%"
          className="split-container"
        />
      )}
    </Fragment>
  )
}

export default App
