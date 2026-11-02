import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

type W = ComponentType<Record<string, any>>;
const modules = import.meta.glob<{ default: W }>(['./*.tsx', '!./_*.tsx']);

const cache = new Map<string, LazyExoticComponent<W>>();

export const widgetNames = () => Object.keys(modules).map((k) => k.slice(2, -4));

export function getWidget(type: string): LazyExoticComponent<W> | undefined {
  const key = `./${type}.tsx`;
  if (!modules[key]) return;
  if (!cache.has(type)) cache.set(type, lazy(modules[key]));
  return cache.get(type);
}
