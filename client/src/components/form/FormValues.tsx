/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement } from 'react'
import { UseFormRegister } from 'react-hook-form'

export const camelCaseToClassicCase = (varName: string): string => {
  return varName.replace(/([A-Z, 0-9])/g, ' $1').replace(/^./, str => str.toUpperCase())
}

export default function FormValues({
  register,
  values,
}: {
  register: UseFormRegister<Record<string, boolean>>
  values: string[]
}): ReactElement {
  const checkboxes: JSX.Element[] = []

  values.forEach((item: string) => {
    checkboxes.push(
      <label htmlFor={item} key={item}>
        <input {...register(`${item}`)} type="checkbox" id={item} />
        <span>{camelCaseToClassicCase(item)}</span>
      </label>,
    )
  })

  return <> {checkboxes}</>
}
