import type { RouteComponentProps } from 'react-router-dom'
import type { FC } from 'react'

// component
export type { FC } from 'react'
export type { RouteComponentProps } from 'react-router-dom'
export type RouteComponent<T = RouteComponentProps> = FC<T>
