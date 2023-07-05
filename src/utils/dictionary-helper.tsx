import { useCallback } from 'react';
import { DictionaryBaseModel } from '../models/abstracts/dictionary-base-model';
import { useAppDataContext } from '../contexts/app-data-context';

export const useDictionaryHelper = () => {
  const { putDictionaryItemAsync } = useAppDataContext();

  const addNewDictionaryItem = useCallback(async (value: string, dictionaryName: string) => {
    value = value.trim().replace(/\s+/g, ' ');
    value = (value.charAt(0).toUpperCase() + value.slice(1));

    let newDictionaryItem = {
      id: 0,
      description: value
    } as DictionaryBaseModel;

    newDictionaryItem = await putDictionaryItemAsync(newDictionaryItem, dictionaryName) as DictionaryBaseModel;

    return newDictionaryItem;
  }, [putDictionaryItemAsync]);

  return {
    addNewDictionaryItem
  };
};