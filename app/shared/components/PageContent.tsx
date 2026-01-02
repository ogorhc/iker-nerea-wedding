import Image from 'next/image';
import { ReactNode } from 'react';

type PageContentProps = {
  title: string;
  subtitle: string;
  children?: ReactNode;
};

/**
 * Reusable page content component with consistent styling
 */
export function PageContent({ title, subtitle, children }: PageContentProps) {
  return (
    <main className='relative min-h-screen overflow-hidden bg-page-background text-page-text'>
      <div className='relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-16'>
        <div className='w-full'>
          <div className='mx-auto flex max-w-xl flex-col items-center text-center'>
            <Image
              src='/WIP_polygons.png'
              alt='Iker Eta Nerea Wedding'
              width={300}
              height={202}
              className='mb-4 rounded-lg border-4 border-background'
            />

            <h1 className='text-balance text-4xl font-semibold text-page-text-primary tracking-tight sm:text-5xl font-primary'>
              {title}
            </h1>
            <p className='mt-4 text-pretty text-base text-page-text-secondary sm:text-lg'>{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
