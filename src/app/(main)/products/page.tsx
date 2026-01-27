"use client";

import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/products/product-card';
import { ProductFilters } from '@/components/products/product-filters';
import { products, collections } from '@/lib/data';
import type { Product, Season, ProductType, Collection } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';

interface Filters {
  season: 'all' | Season;
  type: 'all' | ProductType;
  collection: 'all' | string;
  model: 'all' | string;
}

export default function ProductsPage() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState<Filters>({ season: 'all', type: 'all', collection: 'all', model: 'all' });

  const availableSeasons = useMemo(() => [...new Set(products.map(p => p.season))] as Season[], []);
  const availableTypes = useMemo(() => [...new Set(products.map(p => p.type))] as ProductType[], []);
  const availableModels = useMemo(() => [...new Set(products.map(p => p.model))].sort(), []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const seasonMatch = filters.season === 'all' || product.season === filters.season;
      const typeMatch = filters.type === 'all' || product.type === filters.type;
      const collectionMatch = filters.collection === 'all' || product.collection === filters.collection;
      const modelMatch = filters.model === 'all' || product.model === filters.model;
      return seasonMatch && typeMatch && collectionMatch && modelMatch;
    });
  }, [filters]);

  const handleFilterChange = (filterUpdate: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...filterUpdate }));
  };

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold font-headline text-center mb-4">{t('nav_products')}</h1>
      <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        {t('hero_subtitle')}
      </p>

      <ProductFilters 
        seasons={availableSeasons} 
        types={availableTypes}
        collections={collections}
        models={availableModels}
        onFilterChange={handleFilterChange}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="text-center col-span-full py-16">
          <p className="text-muted-foreground text-lg">{t('no_products_found')}</p>
        </div>
      )}
    </div>
  );
}
