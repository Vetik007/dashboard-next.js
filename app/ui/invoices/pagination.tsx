'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { generatePagination } from '@/app/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages }: { totalPages: number }) {
  // NOTE: comment in this code when you get to this point in the course
  const pathname = usePathname(); // получаем текущий путь URL.
  const searchParams = useSearchParams(); // получаем параметры строки запроса URL
  const currentPage = Number(searchParams.get('page')) || 1; // получаем текущую страницу из параметра строки запроса с именем 'page'. Если такого параметра нет, устанавливаем значение 1.

  // функция которая создает URL для перехода на конкретную страницу постраничной навигации, принимая во внимание текущие параметры строки запроса и указанную страницу.
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  /**
   * разбор функции createPageURL:
   * - const params = new URLSearchParams(searchParams) -  создаем новый экземпляр класса URLSearchParams, который инициализируется значениями из объекта "searchParams". "searchParams" представляет параметры строки запроса URL текущей страницы.
   *
   * - params.set('page', pageNumber.toString()) - устанавливаем параметр 'page' в объекте "params". "pageNumber.toString()" используется для преобразования номера страницы в строку, поскольку метод set() принимает только строки в качестве аргументов.
   *
   * - return ${pathname}?${params.toString()} - возвращает сгенерированный URL, который включает в себя путь к текущей странице (pathname) и параметры строки запроса (params). Метод toString() вызывается для преобразования объекта params в строку формата "ключ=значение", где каждый параметр отделяется символом "&".
   *
   */

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <>
      {/* PaginationArrow и PaginationNumber используются для отображения стрелок и номеров страниц соответственно. Эти компоненты принимают различные пропсы, такие как href (ссылка на страницу), isDisabled (флаг, указывающий, является ли элемент недоступным для нажатия) и др. */}

      <div className="inline-flex">
        <PaginationArrow
          direction="left" // направление стрелки
          href={createPageURL(currentPage - 1)} // содержит ссылку на предыдущую страницу. createPageURL(currentPage - 1) вызывает функцию createPageURL, которая генерирует URL для предыдущей страницы на основе текущей страницы (currentPage).
          isDisabled={currentPage <= 1} // указывает, является ли стрелка недоступным для нажатия. Если currentPage меньше или равно 1, то стрелка будет отключена (недоступна), чтобы предотвратить переход на отрицательную страницу или страницу с номером 0.
        />

        {/* отображение списка номеров страниц  с учетом их позиции в постраничной навигации и их активности.*/}
        <div className="flex -space-x-px">
          {allPages.map((page, index) => {
            let position: 'first' | 'last' | 'single' | 'middle' | undefined; // переменная position, которая может принимать значения 'first', 'last', 'single', 'middle' или undefined. Это используется для определения позиции каждой страницы в списке.

            // определяем позицию каждой страницы в списке на основе индекса элемента и общего количества страниц.
            if (index === 0) position = 'first'; // первая страница
            if (index === allPages.length - 1) position = 'last'; // последняя страница
            if (allPages.length === 1) position = 'single'; // единственная страница
            if (page === '...') position = 'middle'; // если на странице отображается многоточие

            return (
              // компонент который отображает номер страницы в постраничной навигации, принимающий пропсы
              <PaginationNumber
                key={page} // уникальный ключ
                href={createPageURL(page)} // ссылка на страницу
                page={page} // номер страницы
                position={position} // позиция страницы в списке
                isActive={currentPage === page} // флаг, указывающий, является ли страница текущей активной страницей.
              />
            );
          })}
        </div>

        <PaginationArrow
          direction="right"
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      </div>
    </>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: 'first' | 'last' | 'middle' | 'single';
  isActive: boolean;
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center text-sm border',
    {
      'rounded-l-md': position === 'first' || position === 'single',
      'rounded-r-md': position === 'last' || position === 'single',
      'z-10 bg-blue-600 border-blue-600 text-white': isActive,
      'hover:bg-gray-100': !isActive && position !== 'middle',
      'text-gray-300': position === 'middle',
    },
  );

  return isActive || position === 'middle' ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center rounded-md border',
    {
      'pointer-events-none text-gray-300': isDisabled,
      'hover:bg-gray-100': !isDisabled,
      'mr-2 md:mr-4': direction === 'left',
      'ml-2 md:ml-4': direction === 'right',
    },
  );

  const icon =
    direction === 'left' ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
}
