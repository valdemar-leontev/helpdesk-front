import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AboutIcon, EmailIcon, ProfileIcon, SubdivisionHeadIcon, TreeIcon } from '../../../components/icons/icons';
import Popover from 'devextreme-react/popover';
import { useUserAnswersContext } from '../user-answers-context';
import { useSearchParams } from 'react-router-dom';
import { useAppDataContext } from '../../../contexts/app-data-context';
import { ProfileListItemModel } from '../../../models/data/profile-list-item-model';
import { appConstants } from '../../../constants/app-constants';
import { useIconFactories } from '../../../components/icons/use-icon-factories';

export const RequirementCreationInfo = () => {
  const { currentRequirement } = useUserAnswersContext();
  const [ searchParams ] = useSearchParams();
  const [reviewMode, setIsReviewMode] = useState<boolean>(false);
  const [showAuthorInfo, setShowAuthorInfo] = useState<boolean>(false);
  const { getCurrentProfileAsync } = useAppDataContext();
  const [currentProfile, setCurrentProfile] = useState<ProfileListItemModel>();
  const { RequirementStateIconFactory } = useIconFactories();

  useEffect( () => {
    (async () => {
      const review = searchParams.has('review' || 'preview');
      
      if (currentRequirement) {
        const profile = await getCurrentProfileAsync(currentRequirement.profileId);

        if (profile) {
          setCurrentProfile(profile);
        }
      }

      if (review) {
        setIsReviewMode(true);
      }
    })();
  }, [currentRequirement, getCurrentProfileAsync, searchParams]);

  const authorInfo = useMemo(() => {
    return (
      [
        {
          title: 'Подразделение',
          text: currentProfile?.subdivisionName,
          icon: <TreeIcon />
        },
        {
          title: 'Должность',
          text: currentProfile?.positionName,
          icon: <ProfileIcon />,
          secondIcon: <SubdivisionHeadIcon />
        },
        {
          title: 'Почта',
          text: currentProfile?.email,
          icon: <EmailIcon />
        },
      ]
    );
  }, [currentProfile?.email, currentProfile?.positionName, currentProfile?.subdivisionName]);

  const popoverAuthorInfo = useCallback(() => {
    return (
      <div style={{ padding: 5 }}>
        {authorInfo.map((a, index) => {
          return (
            a.text ?
              <div key={index} className={'popover-text'}>
                {currentProfile?.isHead && a.secondIcon ? a.secondIcon : a.icon}
                <div>
                  <b>{a.title}: </b>
                  {a.text}
                </div>
              </div>
              : null
          );
        })}
      </div>
    );
  }, [authorInfo, currentProfile?.isHead]);

  return (
    <>
      {reviewMode && currentRequirement ?
        <div>
          <div className={'passage_page__description'}>
            <b>Автор: </b>
            {currentRequirement.userName}
            <div
              className={'about-author'}
              id="about-author"
              onMouseEnter={() => {
                setShowAuthorInfo(true);
              }}
              onMouseLeave={() => {
                setShowAuthorInfo(false);
              }}>
              <AboutIcon />
            </div>

            <Popover
              animation={appConstants.animationConfig}
              wrapperAttr={{ class: 'app-popover' }}
              target="#about-author"
              position="bottom"
              minWidth={300}
              visible={showAuthorInfo}
            >
              {popoverAuthorInfo()}
            </Popover>
          </div>
          <p className={'passage_page__description'}><b>Время создания:</b> {currentRequirement.creationDate.toLocaleString(
            'ru-RU',
            { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
          )}</p>
          <div title={currentRequirement.requirementStateDescription} className={'requirement-review-state-icon'}>
            {RequirementStateIconFactory(currentRequirement.requirementStateId)}
          </div>
        </div>
        : null
      }
    </>
  );
};