import { observer } from 'mobx-react-lite'
import React from 'react'
import { ModalService, modalStore } from '.'
import { Modal } from 'react-native'

const ModalServiceProvider = () => {
  return (
    <>
      {modalStore.modalsStack.map(m => {
        const remove = () => {
          ModalService.closeModal(m.id)
        }
        const resolve = (result: unknown) => {
          m.resolve(result)
          remove()
        }
        const reject = (reason: unknown) => {
          m.reject(reason)
          remove()
        }

        return (
          <Modal
            key={m.id}
            visible
            onRequestClose={() => reject(new Error('closed'))}
            transparent
            statusBarTranslucent
            animationType="fade"
            {...m.modalParams}
          >
            <m.Component {...m.data} onResolve={resolve} onReject={reject} />
          </Modal>
        )
      })}
    </>
  )
}

export default observer(ModalServiceProvider)
