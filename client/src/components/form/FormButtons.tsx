import React, { ReactElement } from 'react'
import { UseFormRegister, UseFormHandleSubmit, SubmitHandler, UseFormSetValue, UseFormReset } from 'react-hook-form'
import { FaTrash, FaQuestion } from 'react-icons/fa'

import { camelCaseToClassicCase } from './FormValues'

export default function FormButtons({
  level,
  name,
  register,
  handleSubmit,
  onSubmit,
  setValue,
  reset,
  defaultValues,
}: {
  level: number
  name: string
  register: UseFormRegister<Record<string, boolean>>
  handleSubmit: UseFormHandleSubmit<Record<string, boolean>>
  onSubmit: SubmitHandler<Record<string, boolean>>
  setValue: UseFormSetValue<Record<string, boolean>>
  reset: UseFormReset<Record<string, boolean>>
  defaultValues: Record<string, boolean>
}): ReactElement {
  let lvl = 'weak'
  let icon: JSX.Element | null = null
  if (level === 0) {
    lvl = 'strong'
    icon = <FaTrash size={18} />
  } else if (level === 1) {
    icon = <FaQuestion size={18} />
  }

  const inputClassName = `${lvl}LevelButton`
  const iconClassName = `${lvl}LevelIcon`

  register(`${name}`, { value: false })

  const onClick = (): void => {
    reset(defaultValues)
    setValue(name, true, { shouldValidate: true })
    handleSubmit(onSubmit)
  }

  return (
    <button type="submit" className={inputClassName} onClick={onClick}>
      {icon ? <i className={iconClassName}>{icon}</i> : null} {camelCaseToClassicCase(name)}
    </button>
  )
}
