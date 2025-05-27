import React, { createContext, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

const NotificationContext = createContext({})

export const NotificationsProvider = ({ children }) => {
  const { t } = useTranslation()

  const initialNotifications = [
    {
      id: 1,
      title: t('category-view.caption'),
      hidden: false,
    },
    {
      id: 2,
      title: t('goal-view.caption'),
      hidden: false,
    },
  ]

  const [notifications, setNotifications] = useState(initialNotifications)

  const handleClose = id => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id
          ? { ...notification, hidden: true }
          : notification
      )
    )
  }

  return (
    <NotificationContext.Provider value={{ notifications, handleClose }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  return useContext(NotificationContext)
}
