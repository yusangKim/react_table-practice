import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTable, useGlobalFilter, Column, Row, IdType } from 'react-table';
import styled from 'styled-components';
import { matchSorter } from 'match-sorter';
import makeData from '../../utils/makedata';
/**
 * There's some boilter plate here
 * Important part is our globalFilter function
 * where we specify which columns to
 * filter
 * */

const Styles = styled.div`
  padding: 1rem;

  input {
    border: 2px solid black;
    padding: 0.4rem;
  }

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

interface TableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  filters: string[]; // columns names to filter
  filter: string; // Filter text
}

/**
 * We have an Input in App.tsx which
 * passes the filter text
 */

function Table<T extends { id: string }>({
  columns,
  data,
  filters,
  filter,
}: TableProps<T>): React.ReactElement {
  /**
   * Custom Filter Fucntion ----
   * Only filter by: code * name
   */
  const ourGlobalFilterFunction = useCallback(
    (rows: Row<T>[], ids: IdType<T>[], query: string) => {
      return matchSorter(rows, query, {
        keys: filters.map((columnName) => `values.${columnName}`),
      });
    },
    [filters]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  } = useTable<T>(
    {
      columns,
      data,
      // Use our custom function
      globalFilter: ourGlobalFilterFunction,
    },
    useGlobalFilter
  );

  useEffect(() => {
    setGlobalFilter(filter); // Set the Global Filter to the filter prop.
  }, [filter, setGlobalFilter]);

  return (
    <Styles>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={i}>
              {headerGroup.headers.map((column, i) => (
                <th {...column.getHeaderProps()} key={i}>
                  {column.render('Header')}
                  {/* Render the columns filter UI */}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={i}>
                {row.cells.map((cell, i) => {
                  return (
                    <td {...cell.getCellProps()} key={i}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Styles>
  );
}

export default function Filtering() {
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName',
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
            // Use our custom `fuzzyText` filter on this column
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'age',
          },
          {
            Header: 'Visits',
            accessor: 'visits',
          },
          {
            Header: 'Status',
            accessor: 'status',
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress',
          },
        ],
      },
    ],
    []
  );

  const [filter, setFilter] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setFilter(value);
  };

  const data = useMemo(() => makeData(100), []);

  return (
    <>
      <Styles>
        <input
          value={filter}
          onChange={handleInputChange}
          placeholder="Filter by first/lastname"
        />
      </Styles>

      <Table
        columns={columns}
        data={data}
        filters={['lastName', 'firstName']}
        filter={filter}
      />
    </>
  );
}
