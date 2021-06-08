/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CreateAction<T> {
  (args: T): { async?: typeof args, sync?: typeof args }
}

export interface ActionDefaultProps {
  type: string,
  nameSpace?: string,
}
type ActionProps = {
  [K in keyof ActionDefaultProps]: ActionDefaultProps[K]
}

export function createAction<T extends ActionProps>({ type, nameSpace, ...args }: T) {
  return {
    async: { type: `${nameSpace}Async/${type}`, ...args },
    sync: { type: `${nameSpace}Sync/${type}`, ...args },
  }
}
