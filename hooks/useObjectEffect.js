import * as R from 'ramda'
import { useEffect } from 'react'

import usePrevious from './usePrevious'

export default function useObjectEffect(effect, nextObject) {
  const prevObject = usePrevious(nextObject)

  useEffect(() => {
    if (R.equals(prevObject, nextObject)) {
      return
    }

    effect()
  })
}
