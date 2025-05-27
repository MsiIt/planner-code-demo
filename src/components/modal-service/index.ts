import _ from 'lodash'
import { action, makeObservable, observable } from 'mobx'
import { Modal } from 'react-native'
import { uuidStr } from '~/utils/common'

interface ModalInstance {
  id: string
  resolve: (result: unknown) => void
  reject: (error: unknown) => void
  Component: (...args: any) => any
  data: object
  modalParams: Modal['props']
}

class ModalStore {
  modalsStack: ModalInstance[] = []

  constructor() {
    makeObservable(this, {
      modalsStack: observable,
      pushModal: action,
      removeModal: action,
    })
  }

  pushModal(modal: ModalInstance) {
    this.modalsStack.push(modal)
  }
  removeModal(id: string) {
    this.modalsStack = this.modalsStack.filter(m => m.id !== id)
  }
}

export const modalStore = new ModalStore()

export class ModalService {
  static showModal<T extends (...args: any) => any>(
    component: T,
    data: { id?: string } & Omit<Parameters<T>[0], 'onResolve' | 'onReject'>,
    modalParams: Modal['props'] = {}
  ) {
    return new Promise((resolve, reject) => {
      const id = data.id ?? uuidStr()

      modalStore.pushModal({
        id,
        resolve,
        reject,
        Component: component,
        data: _.omit(data, 'id'),
        modalParams,
      })
    })
  }

  static closeModal(id: string) {
    modalStore.removeModal(id)
  }
}
