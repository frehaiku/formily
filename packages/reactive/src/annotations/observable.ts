import { createAnnotation, createObservable } from '../internals'
import {
  bindTargetKeyWithCurrentReaction,
  runReactionsFromTargetKey,
} from '../reaction'

export interface IObservable {
  <T>(target: T): T
}

export const observable: IObservable = createAnnotation(
  ({ target, key, value }) => {
    const store = {
      value: createObservable({
        target,
        key,
        value,
      }),
    }

    function get() {
      bindTargetKeyWithCurrentReaction({
        target: target,
        key: key,
        type: 'get',
      })
      return store.value
    }

    function set(value: any) {
      const oldValue = store.value
      value = createObservable({
        target: target,
        key: key,
        value,
      })
      store.value = value
      runReactionsFromTargetKey({
        target: target,
        key: key,
        type: 'set',
        oldValue,
        value,
      })
    }
    if (target) {
      Object.defineProperty(target, key, {
        set,
        get,
        enumerable: true,
        configurable: false,
      })
    }
    return store.value
  }
)
