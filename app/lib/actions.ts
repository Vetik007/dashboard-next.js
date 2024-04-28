'use server';

import { z } from 'zod'; // импорт библиотеки zod для проверки на уровне схемы с поддержкой типов Typescript
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * создаем схему данных (FormSchema), которая описывает структуру объекта.
 *
 * customerId— Zod уже выдает ошибку, если поле клиента пусто, поскольку он ожидает тип string. Добавляем сообщение, если пользователь не выбрал клиента. (invalid_type_error) - указывает на сообщение об ошибке, которое будет выведено, если тип данных не соответствует ожидаемому типу. Можно указать любое нужное кастомное сообщение.
 *
 * amount- Поскольку мы меняем тип суммы с (string) на (number), по умолчанию он будет равен нулю, если строка пуста. При помощью функции .gt() скажем Zod что мы всегда хотим, чтобы сумма была больше 0.
 * .gt(0): Этот метод устанавливает ограничение на значение поля. В данном случае, он требует, чтобы значение поля amount было больше чем 0. Если значение не удовлетворяет этому условию (то есть меньше или равно 0), будет сгенерировано сообщение об ошибке, указанное в параметре message.
 *
 * status- Zod выдает ошибку, если поле статуса пусто, поскольку он ожидает: «ожидает» или «оплачено». Добавляем сообщение, если пользователь не выбирает статус.
 */

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({ invalid_type_error: 'Please select a customer' }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greated than $0' }), // coerce - преобразование из строки в число
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status',
  }), // enum - перечисление
  date: z.string(),
});

/**
 * создаем новую схему данных (CreateInvoice, UpdateInvoice) на основе схемы FormSchema, с использованием метода omit(). Этот метод позволяет исключить определенные поля из схемы. В данном случае исключаются поля id и date, то есть создается новая схема которая не включает поля id и date.
 *
 * Таким образом, схемы (CreateInvoice и UpdateInvoice) описывают объект, которые должны содержать поля customerId, amount и status, но не содержат поля id и date. Это может быть полезно, например, при создании нового счета, когда идентификатор(id) и дата(date) могут быть сгенерированы автоматически или заполнены на стороне сервера.
 *
 */
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// создание нового счета
export async function createInvoice(prevState: State, formData: FormData) {
  // const { customerId, amount, status } = CreateInvoice.parse({
  //     customerId: formData.get('customerId'),
  //     amount: formData.get('amount'),
  //     status: formData.get('status'),
  // });
  console.log('prevState', prevState);

  // вместо метода parse используем метод safeParse
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100; // переводим денежное значение в центы
  const date = new Date().toISOString().split('T')[0]; // создаем новую дату в формате «ГГГГ-ММ-ДД»

  try {
    // SQL-запрос, чтобы вставить новый счет в базу данных и передать переменные
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice',
    };
  }

  revalidatePath('/dashboard/invoices'); //очищаем кеш браузера и инициируем новый запрос к серверу.После обновления базы данных путь (/dashboard/invoices) будет повторно проверен, и с сервера будут получены свежие данные.

  redirect('/dashboard/invoices'); //  после создания нового счета перенаправляем пользователя обратно на страницу (/dashboard/invoices)

  // const rawFormData = {
  //     customerId: formData.get('customerId'),
  //     amount: formData.get('amount'),
  //     status: formData.get('status'),
  // };

  // console.log('rawFormData:', rawFormData)

  // console.log('rawFormData1:', typeof rawFormData.amount)
}

// обновление счета
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Invoice',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  // throw new Error('Failed to Delete Invoice')

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Delete Invoice' };
  } catch (error) {
    return {
      message: 'Database Error: Failed to Delete Invoice',
    };
  }
}

/**
 * Метод safeParse() является частью функциональности библиотеки Zod. Он используется для безопасного (безопасного в том смысле, что он не бросает исключения) парсинга и валидации данных с использованием определенной схемы.
 *
 * Подход безопасного парсинга означает, что вместо того, чтобы выбрасывать исключение в случае ошибки валидации (как это обычно делают некоторые другие библиотеки), метод safeParse() возвращает объект, который содержит информацию о результате валидации и парсинга данных.
 *
 * Объект, возвращаемый safeParse(), содержит два свойства:
 * - data: Если данные соответствуют схеме, это свойство содержит объект данных, который прошел валидацию и парсинг.
 * - error: Если данные не соответствуют схеме, это свойство содержит объект ошибки с информацией о том, какие именно поля не прошли валидацию и почему.
 *
 * Таким образом, использование safeParse() позволяет безопасно проверять данные на соответствие заданной схеме и обрабатывать результаты валидации без необходимости обрабатывать исключения.
 *
 */
