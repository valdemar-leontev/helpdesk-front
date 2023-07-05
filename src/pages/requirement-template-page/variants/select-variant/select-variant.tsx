import './select-variant.scss';
import { VariantAdder } from '../variant-adder/variant-adder';
import { SingleSelectVariantProps } from '../../../../models/components/single-select-variant-props';
import React, { useCallback, useEffect, useState } from 'react';
import { Form, GroupItem, SimpleItem } from 'devextreme-react/ui/form';
import { CloseIcon } from '../../../../components/icons/icons';
import { useAppDataContext } from '../../../../contexts/app-data-context';
import { useRequirementTemplateContext } from '../../../../contexts/requirement-template-context';
import { appConstants } from '../../../../constants/app-constants';
import { useIconFactories } from '../../../../components/icons/use-icon-factories';

export const SelectVariant = ({ question }: SingleSelectVariantProps) => {
  const [currentVariants, setCurrentVariants] = useState({});
  const { putVariantAsync, deleteVariantAsync, saveRequirementTemplateAsync } = useAppDataContext();
  const { currentRequirementTemplate } = useRequirementTemplateContext();
  const { QuestionTypeIconFactory } = useIconFactories();

  useEffect(() => {
    const variants = {};
    question.variants?.forEach(a => {
      variants[`variant${a.id}`] = a.description;
    });
    setCurrentVariants(variants);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDeleteVariantAsync = useCallback(async (variantKey: string) => {

    const variantId = +variantKey.replace('variant', '');
    const deletedVariant = await deleteVariantAsync(variantId);
    if (deletedVariant) {
      setCurrentVariants(prevState => {
        delete prevState[variantKey];

        return { ...prevState };
      });

      if (question.variants) {
        question.variants = [...question.variants.filter(q => q.id !== variantId)];
      }
    }
  }, [deleteVariantAsync, question]);

  return (
    <>
      <Form
        className={'select-variants-form'}
        formData={currentVariants}
        onFieldDataChanged={async (e) => {
          if (e.dataField && question.variants) {
            const id = parseInt(e.dataField.replaceAll('variant', ''));
            const variant = question.variants.find(a => a.id === id);
            if (variant) {
              variant.description = e.value;
              await saveRequirementTemplateAsync(currentRequirementTemplate!);
            }
          }
        }}
      >
        {Object.keys(currentVariants).map((variantKey) => {
          return (
            <GroupItem colCount={40} key={variantKey} cssClass={'select-variants-form-variant'}>
              <SimpleItem colSpan={2} render={() => {
                return (
                  <div className={'variants-container_icon'}>
                    {QuestionTypeIconFactory(question.questionTypeId)}
                  </div>
                );
              }} />
              <SimpleItem
                colSpan={35}
                dataField={variantKey}
                isRequired={true}
                label={{ visible: false }}
                editorType={'dxTextBox'}
                editorOptions={
                  {
                    placeholder: appConstants.strings.variant,
                    showClearButton: false,
                    stylingMode: 'underlined',
                  }
                }
              />
              <SimpleItem colSpan={3} render={() => {
                return (
                  <div
                    onClick={async () => {
                      await onDeleteVariantAsync(variantKey);
                    }}
                    title={appConstants.strings.delete}
                    className={'delete-variant'}
                  >
                    <CloseIcon size={appConstants.appearance.normalIconSize} color={appConstants.appearance.baseDarkGrey} />
                  </div>
                );
              }} />
            </GroupItem>
          );
        })}
      </Form>

      <VariantAdder onAddVariant={async () => {
        const createdVariant = await putVariantAsync(question.id);

        const variants = {};
        variants[`variant${createdVariant.id}`] = createdVariant.description;
        setCurrentVariants(prevState => {
          return { ...prevState, ...variants };
        });

        if (question.variants) {
          question.variants = [...question.variants, createdVariant];
        }
      }} />
    </>
  );
};
