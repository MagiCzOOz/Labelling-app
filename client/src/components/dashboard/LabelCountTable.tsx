import React from 'react';
import { useTable, Column, TableOptions, UseTableInstanceProps } from 'react-table';

import fetchCurrentLabelsCount from '../../api/fetchCurrentLabelsCount';
import type { Clip } from '../video_player/VideoPlayer';

type LabelCountData = {
    label: string;
    count: number;
};

export default function LabelCountTable({
    currentClip,
    issues = false,
}: {
    currentClip: Clip | null;
    issues?: boolean;
}) {
    const [labelCount, setLabelCount] = React.useState<LabelCountData[]>([]);
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
                Footer: (info: UseTableInstanceProps<LabelCountData>) => {
                    const total = React.useMemo(
                        () => info.rows.reduce((sum, row) => row.values.count + sum, 0),
                        [info.rows],
                    );
                    return <>{total}</>;
                },
            },
        ],
        [],
    );

    /* Fetch the new count when we change the current clip */
    React.useEffect(() => {
        fetchCurrentLabelsCount(issues)
            .then((count: LabelCountData[]) => {
                setLabelCount(count);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [currentClip]);

    const options: TableOptions<LabelCountData> = { data: labelCount, columns: columns };
    const { getTableProps, getTableBodyProps, headerGroups, footerGroups, rows, prepareRow } = useTable(options);
    let tableClassName = 'labelContainer';
    if (issues) tableClassName = 'issueContainer';
    const tableHeader = (
        <thead>
            {headerGroups.map((headerGroup, i) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                    {headerGroup.headers.map((column, j) => (
                        <th {...column.getHeaderProps()} key={j}>
                            {column.render('Header')}{' '}
                        </th>
                    ))}
                </tr>
            ))}
        </thead>
    );
    const tableBody = (
        <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()} key={i}>
                        {row.cells.map((cell, j) => {
                            return (
                                <td {...cell.getCellProps()} key={j}>
                                    {cell.render('Cell')}
                                </td>
                            );
                        })}
                    </tr>
                );
            })}
        </tbody>
    );
    const tableFooter = (
        <tfoot>
            {footerGroups.map((group, i) => (
                <tr {...group.getFooterGroupProps()} key={i}>
                    {group.headers.map((column, j) => (
                        <td {...column.getFooterProps()} key={j}>
                            {column.render('Footer')}
                        </td>
                    ))}
                </tr>
            ))}
        </tfoot>
    );

    return (
        <table {...getTableProps()} className={tableClassName}>
            {!issues ? tableHeader : null}
            {tableBody}
            {!issues ? tableFooter : null}
        </table>
    );
}
