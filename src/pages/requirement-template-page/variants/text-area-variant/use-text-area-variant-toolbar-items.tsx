import { useMemo } from 'react';

type TextAreaVariantToolbarItem = string | {
  name: string;

  acceptedValues: (string | number | boolean)[];
}

export const useTextAreaVariantToolbarItems = () => {

  return useMemo<TextAreaVariantToolbarItem[]>(() => {

    return [
      'undo',
      'redo',
      'separator',

      {
        name: 'font',
        acceptedValues: ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana']
      },
      'separator',

      {
        name: 'size',
        acceptedValues: ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt']
      },
      'separator',

      'bold',
      'italic',
      'underline',
      'separator',
      'alignLeft',
      'alignCenter',
      'alignRight',
      'alignJustify',
      'clear',
      {
        name: 'header',
        acceptedValues: [false, 1, 2, 3, 4, 5],
      },
      'separator',

      'orderedList',
      'bulletList',
      'separator',
      'color',
      'background',
      'separator',

      'link'
    ];
  }, []);
};