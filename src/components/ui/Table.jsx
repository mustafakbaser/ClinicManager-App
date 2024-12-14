import React from 'react';

export function Table({ children, className = '' }) {
  return (
    <div className="mt-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className={`min-w-full divide-y divide-gray-300 ${className}`}>
              {children}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Thead({ children }) {
  return (
    <thead className="bg-gray-50">
      {children}
    </thead>
  );
}

export function Tbody({ children }) {
  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {children}
    </tbody>
  );
}

export function Th({ children, className = '' }) {
  return (
    <th className={`px-3 py-3.5 text-left text-sm font-semibold text-gray-900 ${className}`}>
      {children}
    </th>
  );
}

export function Td({ children, className = '' }) {
  return (
    <td className={`whitespace-nowrap px-3 py-4 text-sm text-gray-500 ${className}`}>
      {children}
    </td>
  );
}