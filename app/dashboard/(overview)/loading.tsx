// export default function Loading() {
//   return <div>Loading...</div>;
// }

//* ==================================================================

import DashboardSkeleton from '../../ui/skeletons';

export default function Loading() {
  return <DashboardSkeleton />;
}

/**
 * импортируем компонент DashboardSkeleton(скелет загрузки) и рендерим его вместо надписи (Loading...)
 *
 * скелет загрузки — это упрощенная версия пользовательского интерфейса.
 *  Любой пользовательский интерфейс, в который встраивается, loading.tsx будет встроен как часть статического файла и отправлен первым. Затем остальная часть динамического контента будет передаваться с сервера клиенту.
 *
 */
//* =================================================================================

/**
 * loading.tsx— это специальный файл Next.js, созданный на основе Suspense. Он позволяет создавать резервный пользовательский интерфейс, который будет отображаться в качестве замены при загрузке содержимого страницы.
 *
 * Поскольку <SideNav> статичен, он отображается немедленно. Пользователь может взаимодействовать <SideNav>во время загрузки динамического контента.
 *
 * Пользователю не нужно ждать завершения загрузки страницы, прежде чем уйти (это называется прерываемой навигацией).
 *
 */

//? ======================================================================
/**
 * если файл loading.tsx поместить внутрь папки dashboard то при загрузке скелетон будет применятся ко всем страницам который находятся внутри dashboard(invoices и customers)
 *
 * чтобы это исправить применяем группы маршрутов - внутри dashboard создаем новую папку обернутую в круглые скобки - (overview) внутрь которой перемещаем файлы loading.tsx и page.tsx
 *
 * после этого скелетон будет применятся только к странице обзора т.е. домашней странице dashboard
 *
 */

//? =====================================================================