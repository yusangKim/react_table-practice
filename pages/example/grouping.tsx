import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useTable, useGroupBy, useExpanded } from 'react-table';

import makeData from '../../utils/makedata';

//data를 그룹화 시키는 기능

const Styles = styled.div`
  padding: 1rem;
  table {
    border-spacing: 0;
    border: 1px solid black;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      :last-child {
        border-right: 0;
      }
    }
  }
`;
function Legend() {
  return (
    <div
      style={{
        padding: '0.5rem 0',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          background: '#0aff0082',
          padding: '0.5rem',
        }}
      >
        Grouped
      </span>{' '}
      <span
        style={{
          display: 'inline-block',
          background: '#ffa50078',
          padding: '0.5rem',
        }}
      >
        Aggregated
      </span>{' '}
      <span
        style={{
          display: 'inline-block',
          background: '#ff000042',
          padding: '0.5rem',
        }}
      >
        Repeated Value
      </span>
    </div>
  );
}

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { groupBy, expanded },
  } = useTable({ columns, data }, useGroupBy, useExpanded);

  const firstPageRows = rows.slice(0, 20);

  return (
    <>
      <pre>
        <code>{JSON.stringify({ groupBy, expanded }, null, 2)}</code>
      </pre>
      <Legend />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr key={i} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, i) => (
                <th key={i} {...column.getHeaderProps()}>
                  {column.canGroupBy ? (
                    <span {...column.getGroupByToggleProps()}>
                      {column.isGrouped ? '🛑 ' : '👊 '}
                    </span>
                  ) : null}
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row, i) => {
            prepareRow(row);
            return (
              <tr key={i} {...row.getRowProps()}>
                {row.cells.map((cell, i) => {
                  return (
                    <td
                      key={i}
                      {...cell.getCellProps()}
                      style={{
                        background: cell.isGrouped
                          ? '#0aff0082'
                          : cell.isAggregated
                          ? '#ffa50078'
                          : cell.isPlaceholder
                          ? '#ff000042'
                          : 'white',
                      }}
                    >
                      {cell.isGrouped ? (
                        <>
                          <span {...row.getToggleRowExpandedProps()}>
                            {row.isExpanded ? '👇' : '👉'}
                          </span>{' '}
                          {cell.render('Cell')} ({row.subRows.length})
                        </>
                      ) : cell.isAggregated ? (
                        cell.render('Aggregated')
                      ) : cell.isPlaceholder ? null : (
                        cell.render('Cell')
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <div>Showinf the first 100 results of {rows.length} rows</div>
    </>
  );
}
function roundedMedian(leafValues) {
  let min = leafValues[0] || 0;
  let max = leafValues[0] || 0;

  leafValues.forEach((value) => {
    min = Math.min(min, value);
    max = Math.max(min, value);
  });
  return Math.round((min + max) / 2);
}

function Grouping() {
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName',
            aggregate: 'count',
            Aggregated: ({ value }) => `${value} Names`,
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
            aggregate: 'uniqueCount',
            Aggregated: ({ value }) => `${value} Unique Names`,
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'age',
            aggregate: 'average',
            Aggregated: ({ value }) => `${Math.round(value * 100) / 100} (avg)`,
          },
          {
            Header: 'Visits',
            accessor: 'visits',
            aggregate: 'sum',
            Aggregated: ({ value }) => `${value} (total)`,
          },
          {
            Header: 'Status',
            accessor: 'status',
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress',
            aggregate: roundedMedian,
            Aggregated: ({ value }) => `${value} (med)`,
          },
        ],
      },
    ],
    []
  );
  const data = useMemo(() => makeData(10000), []);
  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  );
}

export default Grouping;
