import { Metadata } from 'next';

import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';

export const metadata: Metadata = {
  // title: 'Acme Dashboard',
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://dashboard-next-js-woad.vercel.app/'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}

// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

/**
 * Любые метаданные в корневом layout.js будут унаследованы всеми страницами, которые их используют.
 * 
 *  : Metadata: Это указывает на тип объекта metadata. Ожидается, что Metadata содержит определенные свойства, такие как title, description и metadataBase.
 *
 * title: 'Acme Dashboard': Это свойство title объекта metadata содержит заголовок веб-приложения, который, будет использоваться для отображения заголовка в браузере или в других контекстах.
 *
 ** Добавить собственный заголовок для определенной страницы можно добавив metadata объект на саму страницу. Метаданные на вложенных страницах переопределяют метаданные на родительских страницах.
 ** Используя title.template можно добавить собственный заголовок для определенной страницы без повторения названия приложения на каждой странице
 * title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
 * - template: Это шаблон заголовка страницы. %s - это заполнитель, который будет заменен на конкретный заголовок страницы.(Если на странице /dashboard/invoices добавить заголовок title: 'Invoices', то в елементе <head> будет заголовок Invoices | Acme Dashboard)
 * - default: Это значение по умолчанию для заголовка страницы, если конкретный заголовок не указан.
 *
 * description: 'The official Next.js Course Dashboard, built with App Router.': Это свойство description содержит краткое описание веб-приложения, которое может быть использовано для SEO или в других местах, где нужно предоставить описание приложения.
 *
 * metadataBase: new URL('https://dashboard-next-js-woad.vercel.app/'): Это свойство metadataBase содержит базовый URL-адрес веб-приложения, обычно это URL-адрес домашней страницы приложения Он представлен объектом URL, который создается с указанным URL-адресом. Этот базовый URL может использоваться для создания полных URL-адресов внутри приложения.
 */
