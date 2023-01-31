/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement } from 'react'
import { useTable, Column, TableOptions, UseTableInstanceProps } from 'react-table'

import type { ErrorMessage } from '../../App'
import fetchCurrentLabelsCount from '../../api/fetchCurrentLabelsCount'
import type { Clip } from '../video_player/VideoPlayer'

export type LabelCountData = {
  label: string
  count: number
}

function useTotal(info: UseTableInstanceProps<LabelCountData>): ReactElement {
  const total = React.useMemo(() => info.rows.reduce((sum, row) => row.values.count + sum, 0), [info.rows])
  return <> {total}</>
}

export default function LabelCountTable({
  currentClip,
  issues = false,
}: {
  currentClip: Clip | null
  issues?: boolean
}): ReactElement {
  const [labelCount, setLabelCount] = React.useState<LabelCountData[]>([])
  const columns: Column<LabelCountData>[] = React.useMemo(
    () => [
      {
        Header: 'Labels',
        accessor: 'label',
        Footer: 'Total',
      },
      {
        Header: 'Counts',
        accessor: 'count',
        Footer: useTotal,
      },
    ],
    [],
  )

  /* Fetch the new count when we change the current clip */
  React.useEffect(() => {
    fetchCurrentLabelsCount(issues)
      .then((count: LabelCountData[] | ErrorMessage) => {
        if (!('error' in count)) setLabelCount(count)
      })
      .catch(err => {
        throw new Error(err.message)
      })
  }, [currentClip, issues])

  const options: TableOptions<LabelCountData> = { data: labelCount, columns }
  const { getTableProps, getTableBodyProps, headerGroups, footerGroups, rows, prepareRow } = useTable(options)
  // We have only one header and footer group
  if (headerGroups.length !== 1) throw new Error('Should never happen')
  if (footerGroups.length !== 1) throw new Error('Should never happen')
  const headerGroup = headerGroups[0]
  const footerGroup = footerGroups[0]
  let tableClassName = 'labelContainer'
  if (issues) tableClassName = 'issueContainer'
  const tableHeader = (
    <thead>
      <tr {...headerGroup.getHeaderGroupProps()}>
        {headerGroup.headers.map(column => (
          <th {...column.getHeaderProps()} key={`header_${column.id}`}>
            {column.render('Header')}{' '}
          </th>
        ))}
      </tr>
    </thead>
  )
  const tableBody = (
    <tbody {...getTableBodyProps()}>
      {rows.map(row => {
        prepareRow(row)
        return (
          <tr {...row.getRowProps()} key={row.id}>
            {row.cells.map(cell => {
              return (
                <td {...cell.getCellProps()} key={`${cell.row.id}_${cell.column.id}`}>
                  {cell.render('Cell')}
                </td>
              )
            })}
          </tr>
        )
      })}
    </tbody>
  )
  const tableFooter = (
    <tfoot>
      <tr {...footerGroup.getFooterGroupProps()}>
        {footerGroup.headers.map(column => (
          <td {...column.getFooterProps()} key={`footer_${column.id}`}>
            {column.render('Footer')}
          </td>
        ))}
      </tr>
    </tfoot>
  )

  return (
    <table {...getTableProps()} className={tableClassName}>
      {!issues ? tableHeader : null}
      {tableBody}
      {!issues ? tableFooter : null}
    </table>
  )
}
