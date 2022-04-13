import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  return (
    <div className="p-10">
      <Head>
        <title>react-table</title>
      </Head>
      {/* Body */}
      <div className="text-center">Example List</div>
      <div className="flex justify-between border-2 mt-10 p-10 ">
        <div className="w-2/4">
          <ul className="flex flex-col gap-10 cursor-pointer">
            <li onClick={() => router.push('/example/basic')}>Basic</li>
            <li onClick={() => router.push('/example/footer')}>Footers</li>
            <li onClick={() => router.push('/example/sorting')}>Sorting</li>
            <li onClick={() => router.push('/example/filtering')}>Filtering</li>
            <li onClick={() => router.push('/example/grouping')}>Grouping</li>
            <li onClick={() => router.push('/example/columnGrouping')}>
              Grouping Column
            </li>
            <li onClick={() => router.push('/example/pagination')}>
              Pagination
            </li>
            <li>Row Selection</li>
          </ul>
        </div>
        <div className="w-2/4 ">
          <ul className="flex flex-col gap-10 cursor-pointer">
            <li>Row Selection With Pagination</li>
            <li>Expanding</li>
            <li>Sub Components</li>
            <li>Sub Components(lazy)</li>
            <li>Editable Data</li>
            <li>Column Ordering</li>
            <li>Column Hiding</li>
            <li>Column Resizting</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
