import { useLanguage } from '@/hooks/use-language';
import Link from 'next/link';

export function Logo() {
  const { t } = useLanguage();
  return (
    <Link href="/" className="text-2xl font-bold font-headline text-primary transition-colors hover:text-foreground">
      {t('appName')}
    </Link>
  );
}
