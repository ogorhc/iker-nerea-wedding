import { useReducedMotion } from 'framer-motion';
import { NavigationLink } from './NavigationLink';

export function LanguageSelectLinks() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  return (
    <>
      <NavigationLink href="/eus" shouldReduceMotion={shouldReduceMotion}>
        Euskera
      </NavigationLink>
      <NavigationLink href="/es" shouldReduceMotion={shouldReduceMotion}>
        Castellano
      </NavigationLink>
    </>
  );
}
