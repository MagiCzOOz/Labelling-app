import React, { ReactElement } from 'react'
import './FormStyles.scss'
import { useForm, SubmitHandler } from 'react-hook-form'

import type { LabelConfig } from '../../App'
import fetchLabels from '../../api/fetchLabels'
import type { Clip } from '../video_player/VideoPlayer'
import FormButtons from './FormButtons'
import FormValues from './FormValues'

export default function LabelForm({
  labelConfig,
  currentClip,
  setCurrentClip,
  setPreviousClip,
}: {
  labelConfig: LabelConfig
  currentClip: Clip | null
  setCurrentClip: React.Dispatch<React.SetStateAction<Clip | null>>
  setPreviousClip: React.Dispatch<React.SetStateAction<Clip | null>>
}): ReactElement {
  const { register, handleSubmit, reset, setValue } = useForm<typeof labelConfig.labelFormModel>()

  const onSubmit: SubmitHandler<typeof labelConfig.labelFormModel> = data => {
    if (currentClip) {
      fetchLabels('POST', data, currentClip)
        .then(() => {
          // eslint-disable-next-line no-param-reassign
          currentClip.labels = data
          setPreviousClip(currentClip)
          setCurrentClip(null)
          reset()
        })
        .catch(err => {
          throw new Error(err.message)
        })
    }
  }

  const radioOptions: JSX.Element[] = []
  Object.keys(labelConfig.labels).forEach((group: string) => {
    radioOptions.push(
      <div className="radioOptions" key={group}>
        <FormValues register={register} values={labelConfig.labels[group]} />
      </div>,
    )
  })

  const buttons: JSX.Element[] = []
  labelConfig.issueNames.forEach((issue: string, index: number) => {
    buttons.push(
      <FormButtons
        level={index}
        name={issue}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        setValue={setValue}
        reset={reset}
        key={issue}
        defaultValues={labelConfig.labelFormModel}
      />,
    )
  })

  return (
    <div className="labelForm">
      <form onSubmit={handleSubmit(onSubmit)}>
        {radioOptions}
        <div className="formButtons">
          <input type="submit" className="submitButton" />
          {buttons}
        </div>
      </form>
    </div>
  )
}
