"use client";

import { useLanguage } from "@/hooks/use-language";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Season, ProductType, Collection } from "@/lib/types";

interface ProductFiltersProps {
  seasons: Season[];
  types: ProductType[];
  collections: Collection[];
  models: string[];
  onFilterChange: (filters: { [key: string]: string }) => void;
}

export function ProductFilters({ seasons, types, collections, models, onFilterChange }: ProductFiltersProps) {
  const { t, language } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Select onValueChange={(value) => onFilterChange({ season: value })}>
        <SelectTrigger>
          <SelectValue placeholder={t('filter_by_season')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('all_seasons')}</SelectItem>
          {seasons.map((season) => (
            <SelectItem key={season} value={season}>
              {t(season)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => onFilterChange({ type: value })}>
        <SelectTrigger>
          <SelectValue placeholder={t('filter_by_type')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('all_types')}</SelectItem>
          {types.map((type) => (
            <SelectItem key={type} value={type}>
              {t(type)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select onValueChange={(value) => onFilterChange({ collection: value })}>
        <SelectTrigger>
          <SelectValue placeholder={t('filter_by_collection')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('all_collections')}</SelectItem>
          {collections.map((collection) => (
            <SelectItem key={collection.id} value={collection.id}>
              {collection.name[language] || collection.name['en']}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => onFilterChange({ model: value })}>
        <SelectTrigger>
          <SelectValue placeholder={t('filter_by_model')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('all_models')}</SelectItem>
          {models.map((model) => (
            <SelectItem key={model} value={model}>
              {model}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
