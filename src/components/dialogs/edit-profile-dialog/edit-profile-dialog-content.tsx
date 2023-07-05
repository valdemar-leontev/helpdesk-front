import Form, { RequiredRule, SimpleItem } from 'devextreme-react/ui/form';
import { ProfileModel } from '../../../models/data/profile-model';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DescriptiveEntityModel } from '../../../models/abstracts/descriptive-entity-model';
import { useAppDataContext } from '../../../contexts/app-data-context';
import { useAppAuthContext } from '../../../contexts/app-auth-context';
import { appConstants } from '../../../constants/app-constants';
import notify from 'devextreme/ui/notify';
import { EditProfileDialogProps } from '../../../models/dialogs/edit-profile-dialog-props';
import { DialogProps } from '../../../models/dialogs/dialog-props';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { PromptDialogProps } from '../../../models/dialogs/prompt-dialog-props';
import { ProfileListItemModel } from '../../../models/data/profile-list-item-model';
import { Button } from 'devextreme-react/ui/button';
import { useDictionaryHelper } from '../../../utils/dictionary-helper';

export const EditProfileDialogContent = ({ userId, editMode, callback }: EditProfileDialogProps) => {

  const formRef = useRef<Form>(null);
  const [positionItems, setPositionItems] = useState<DescriptiveEntityModel[]>([]);
  const [subdivisionItems, setSubdivisionItems] = useState<DescriptiveEntityModel[]>([]);
  const { getProfileAsync, getDictionaryAsync, postProfileAsync, putProfileAsync, getProfileListAsync, getCurrentProfileAsync } = useAppDataContext();
  const { getAuthUser } = useAppAuthContext();
  const { showDialog } = useCommonDialogsContext();
  const [currentProfileListItem, setCurrentProfileListItem] = useState<ProfileListItemModel | null>();
  const { addNewDictionaryItem } = useDictionaryHelper();

  useEffect(() => {
    (async () => {
      const profileListItem = await getCurrentProfileAsync(userId);
      if (profileListItem) {
        setCurrentProfileListItem(profileListItem);
      }

      // eslint-disable-next-line prefer-const
      let [positionItems, subdivisionItems] = await Promise.all(
        [
          getDictionaryAsync('Position'),
          getDictionaryAsync('Subdivision'),
        ]
      );
      if (positionItems && subdivisionItems) {
        setPositionItems(positionItems);
        setSubdivisionItems(subdivisionItems);
      }
    })();
  }, [getAuthUser, getCurrentProfileAsync, getDictionaryAsync, getProfileAsync, getProfileListAsync, userId]);

  const onSaveProfileAsync = useCallback(async () => {
    const validationGroupResult = formRef.current?.instance.validate();
    if (validationGroupResult && !validationGroupResult.isValid) {
      const brokenRule = validationGroupResult.brokenRules?.find(() => true);
      if (brokenRule) {
        (brokenRule as any).validator.focus();
      }
    }
    // TODO: suppress else
    else {
      if (currentProfileListItem) {
        const profileListItem = {
          ...currentProfileListItem,
          positionId: (currentProfileListItem.positionId === 0
            ? null
            : currentProfileListItem.positionId),
          subdivisionId: (currentProfileListItem.subdivisionId === 0
            ? null
            : currentProfileListItem.subdivisionId)
        };

        let profile: ProfileModel | null;
        if (profileListItem.id === 0) {
          profile = await putProfileAsync(profileListItem as ProfileModel);
        } else {
          profile = await postProfileAsync(profileListItem as ProfileModel);
        }

        if (profile !== null && callback) {
          callback();
          notify('Данные профиля были успешно сохранены.', 'success', 3000);
          showDialog('EditProfileDialog', { visible: false } as DialogProps);
        }
      }
    }
  }, [callback, currentProfileListItem, postProfileAsync, putProfileAsync, showDialog]);

  return (
    <>
      <Form
        ref={formRef}
        disabled={!editMode}
        className={'user-profile-additional-info-edit-mode'}
        formData={currentProfileListItem}
      >
        <SimpleItem
          dataField={'firstName'}
          editorType={'dxTextBox'}
          label={{ text: 'Имя' }}
          editorOptions={{
            text: currentProfileListItem?.firstName,
            stylingMode: 'underlined'
          }}
        >
          <RequiredRule message={'Поле является обязательным'} />
        </SimpleItem>

        <SimpleItem
          dataField={'lastName'}
          editorType={'dxTextBox'}
          label={{ text: 'Фамилия' }}
          editorOptions={{
            text: currentProfileListItem?.lastName,
            stylingMode: 'underlined',
          }}
        >
          <RequiredRule message={'Поле является обязательным'} />
        </SimpleItem>

        <SimpleItem
          dataField={'email'}
          editorType={'dxTextBox'}
          label={{ text: 'Почта' }}
          editorOptions={{
            text: currentProfileListItem?.email,
            stylingMode: 'underlined',
          }}
        >
          <RequiredRule message={'Поле является обязательным'} />
        </SimpleItem>

        <SimpleItem
          dataField={'subdivisionId'}
          editorType={'dxSelectBox'}
          label={{ text: 'Подразделение' }}
          editorOptions={{
            searchEnabled: true,
            stylingMode: 'underlined',
            dataSource: subdivisionItems,
            valueExpr: 'id',
            displayExpr: 'description',
            buttons: [
              {
                name: 'add',
                location: 'after',
                options: {
                  icon: 'add',
                  onClick: () => {
                    showDialog('PromptDialog', {
                      title: 'Добавить элемент',
                      visible: true,
                      initialValue: '',
                      callback: async (value: string) => {
                        const newDictionaryItem = await addNewDictionaryItem(value, 'Subdivision');

                        if (newDictionaryItem) {
                          const currentEditor = formRef.current!.instance.getEditor('subdivisionId');
                          if (currentEditor) {
                            currentEditor.option('value', newDictionaryItem.id);
                            setSubdivisionItems(prevState => [...prevState!, newDictionaryItem]);
                            notify('Добавлен новый элемент в словарь подразделений.', 'success', 3000);
                          }
                        }
                      }
                    } as PromptDialogProps);
                  }
                }
              },
              {
                name: 'dropDown',
                location: 'after'
              },
            ]
          }}
        >
          <RequiredRule message={'Поле является обязательным'} />
        </SimpleItem>

        <SimpleItem
          dataField={'positionId'}
          editorType={'dxSelectBox'}
          label={{ text: 'Должность' }}
          editorOptions={{
            searchEnabled: true,
            stylingMode: 'underlined',
            dataSource: positionItems,
            valueExpr: 'id',
            displayExpr: 'description',
            buttons: [
              {
                name: 'add',
                location: 'after',
                options: {
                  icon: 'add',
                  onClick: () => {
                    showDialog('PromptDialog', {
                      title: 'Добавить элемент',
                      visible: true,
                      initialValue: '',
                      callback: async (value: string) => {
                        const newDictionaryItem = await addNewDictionaryItem(value, 'Position');

                        if (newDictionaryItem) {
                          const currentEditor = formRef.current!.instance.getEditor('positionId');
                          if (currentEditor) {
                            currentEditor.option('value', newDictionaryItem.id);
                            setPositionItems(prevState => [...prevState!, newDictionaryItem]);
                            notify('Добавлен новый элемент в словарь должностей.', 'success', 3000);
                          }
                        }
                      }
                    } as PromptDialogProps);
                  }
                }
              },
              {
                name: 'dropDown',
                location: 'after'
              },
            ]
          }}
        >
          <RequiredRule message={'Поле является обязательным'} />
        </SimpleItem>
      </Form>

      <div className='dialog-content__buttons'>
        <Button
          visible={editMode}
          className='dialog-content__button'
          type={'default'}
          text={appConstants.strings.save}
          onClick={async () => {
            await onSaveProfileAsync();
          }}
        >
        </Button>
        <Button
          visible={editMode}
          className='dialog-content__button'
          type={'normal'}
          text={appConstants.strings.close}
          onClick={() => {
            showDialog('EditProfileDialog', { visible: false } as DialogProps);
          }}
        />
      </div>
    </>
  );
};
