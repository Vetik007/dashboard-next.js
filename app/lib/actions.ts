'use server'

import { z } from 'zod'// импорт библиотеки zod для проверки на уровне схемы с поддержкой типов Typescript
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import {redirect} from 'next/navigation'

/**
 * создаем схему данных (FormSchema), которая описывает структуру объекта.
 */
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(), // coerce - преобразование из строки в число
    status: z.enum(['pending', 'paid']), // enum - перечисление
    date: z.string(),
})

/**
 * создаем новую схему данных (CreateInvoice, UpdateInvoice) на основе схемы FormSchema, с использованием метода omit(). Этот метод позволяет исключить определенные поля из схемы. В данном случае исключаются поля id и date, то есть создается новая схема которая не включает поля id и date.
 * 
 * Таким образом, схемы (CreateInvoice и UpdateInvoice) описывают объект, которые должны содержать поля customerId, amount и status, но не содержат поля id и date. Это может быть полезно, например, при создании нового счета, когда идентификатор(id) и дата(date) могут быть сгенерированы автоматически или заполнены на стороне сервера.
 * 
 */
const CreateInvoice = FormSchema.omit({ id: true, date: true })
const UpdateInvoice = FormSchema.omit({ id: true, date: true })

// создание нового счета
export async function createInvoice(formData: FormData) {

    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

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
      message: 'Database Error: Failed to Create Invoice'
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
      message: 'Database Error: Failed to Update Invoice'
    };
    
  }
 
  
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  // throw new Error('Failed to Delete Invoice')

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`
    revalidatePath('/dashboard/invoices');
    return {message: 'Delete Invoice'}
    
  } catch (error) {
    return {
      message: 'Database Error: Failed to Delete Invoice'
    };
    
  }
    
}