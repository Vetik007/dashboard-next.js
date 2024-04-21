'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  //? ====================================================================================

  // function handleSearch(inputValue: string) {
  //   const params = new URLSearchParams(searchParams);

  //   /**
  //    * если inputValue есть, т.е. значение поля input не является пустой строкой, null, undefined, false и т.д. то методом set() добавляем параметр 'query' с соответствующим значением inputValue
  //    *
  //    * если inputValue не существует (т.е. его значение ложно), то методом delete() объекта params удаляем параметр 'query', если он существует.
  //    *
  //    */
  //   if (inputValue) {
  //     params.set('query', inputValue);
  //   } else {
  //     params.delete('query');
  //   }

  //   /**
  //    * ${pathname}это текущий путь, в данном случае, "/dashboard/invoices".
  //    * Когда пользователь вводит текст в строку поиска, params.toString() переводит этот ввод в формат, удобный для URL-адресов.
  //    *
  //    * replace(${pathname}?${params.toString()})обновляет URL-адрес данными поиска пользователя. Например, /dashboard/invoices?query=bob если пользователь ищет «bob».
  //    *
  //    */
  //   replace(`${pathname}?${params.toString()}`);

  //   // console.log(`inputValue:, ${inputValue}`);
  //   console.log('inputValue1:', inputValue);
  // }
  //? ===================================================================================

  //* =========================== debounce ==============================================

  const handleSearch = useDebouncedCallback((inputValue) => {
    console.log('inputValue:', inputValue);
    const params = new URLSearchParams(searchParams);

    if (inputValue) {
      params.set('query', inputValue);
    } else {
      params.delete('query');
    }

    replace(`${pathname}?${params.toString()}`);

    // console.log(`inputValue:, ${inputValue}`);
  }, 300);

  //* =================================================================================

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>

      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />

      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}

/**
 * defaultValue={...} - установка значения по умолчанию для поля поиска. Если значение атрибута defaultValue не будет переопределено пользователем, то это значение будет использоваться в качестве значения элемента формы.
 *
 * searchParams.get('query') - метод get() объекта searchParams, который позволяет получить значение параметра с именем 'query'. Объект searchParams представляет параметры строки запроса URL.
 *
 * ?.toString() - использование оператора опциональной цепочки (оператор ?.) в JavaScript, который предотвращает ошибку, если левая часть оператора равна null или undefined. В данном случае, если значение параметра 'query' существует, то вызывается метод toString() для преобразования его в строку. Если значение 'query' отсутствует, оператор ?. вернет undefined.
 *
 *
 */
