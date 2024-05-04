'use client';

import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createInvoice } from '@/app/lib/actions';
import { useFormState } from 'react-dom'; // импорт хука для проверки формы на стороне сервера

/**
 * useFormState:
 * - Принимает два аргумента: (action, initialState).
 * - Возвращает два значения: [state, dispatch]состояние формы и функцию отправки (аналогично useReducer )
 */

export default function Form({ customers }: { customers: CustomerField[] }) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createInvoice, initialState);
  /**
   * initialState может быть что угодно т.е. то что определим
   */
  console.log('State', state);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="customer-error"
            >
              <option value="" disabled>
                Select a customer
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.customerId &&
              state.errors.customerId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="amount-error"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>

            <div id="amount-error" aria-live="polite" aria-atomic="true">
              {state.errors?.amount && // Проверяем, есть ли ошибки в свойстве "amount" объекта "errors"
                state.errors.amount.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>

          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>

          <div>
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          </div>
        </fieldset>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Invoice</Button>
      </div>
    </form>
  );
}

/**
 * aria-describedby - это атрибут доступности (Accessibility Attribute) в HTML, который используется для указания идентификаторов элементов, содержащих описания, подсказки или инструкции к элементу управления, который он ассоциируется.
 *
 * 1. Описание элемента: У элемента управления может быть ассоциировано описание, которое помогает пользователю понять, что ожидается от этого элемента. Например, у текстового поля ввода может быть описание, которое объясняет, какой тип данных ожидается вводиться в это поле.
 *
 * 2. aria-describedby: Атрибут aria-describedby используется для связывания элемента управления с элементом, содержащим описание. Значение атрибута - это список идентификаторов элементов, разделенных пробелами, которые представляют описания, связанные с элементом управления.
 *
 * 3.Подсказки и инструкции: Это может быть полезно для элементов управления, требующих дополнительной помощи или объяснений для пользователей с ограниченными возможностями или для обеспечения лучшего понимания элемента пользователем.
 *
 * ?Например:
 * *<label for="username">Username:</label>
 * *<input type="text" id="username" aria-describedby="username-description">
 * *<div id="username-description">Please enter your username.</div>
 *
 * В примере <input> связан с элементом <div>, который содержит описание элемента управления. Это позволяет пользователям получить дополнительную информацию о том, что ожидается от поля ввода имени пользователя
 *
 */
// _-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

/**
 * id="amount-error": Уникальный идентификатор для контейнера сообщений об ошибках, связанных с полем "amount". Этот идентификатор используется для ассоциации сообщений об ошибках с соответствующим полем формы и обеспечения доступности.
 *
 * aria-live="polite": Этот атрибут управляет уровнем важности сообщений для скринридеров. В данном случае, он указывает, что изменения внутри этого контейнера будут доступны для пользователя, но не будут навязчивыми или мешать текущей работе.
 *
 * aria-atomic="true": Этот атрибут указывает, что все содержимое контейнера должно быть доступно для ассистивных технологий в целости и полноте при каждом изменении.
 *
 * {state.errors?.amount && ...}: Это условие проверяет, есть ли ошибки в свойстве "amount" объекта "errors" в состоянии "state".
 *
 * state.errors.amount.map((error: string) => ...: Если есть ошибки в свойстве "amount", они отображаются. Функция map используется для прохода по массиву ошибок и отображения каждой ошибки в виде отдельного абзаца <p>. Каждая ошибка выводится в соответствии с классом стилей, который делает ее красным и мелким.
 *
 * ?В выражении {state.errors?.amount && ...}, вопросительный знак - это оператор опциональной цепочки (Optional Chaining), который предназначен для безопасного доступа к свойствам объекта, если объект может быть null или undefined.
 *
 * ? Когда JavaScript пытается обратиться к свойству объекта, который может быть null или undefined, возникает ошибка. Оператор ?. позволяет избежать этой ошибки. Он проверяет, существует ли свойство errors в объекте state, и если это так, то проверяет существует ли свойство amount в объекте errors. Если оба условия выполнены, то выражение возвращает true, в противном случае - false.
 *
 *? Таким образом, {state.errors?.amount && ...} проверяет наличие свойства amount в объекте errors, а затем выполняет следующие действия (в данном случае отображает сообщения об ошибках), если свойство существует. Если state.errors или state.errors.amount равны null или undefined, выражение вернет false, и дальнейшие действия внутри условия не будут выполнены.
 *
 *
 *
 */
