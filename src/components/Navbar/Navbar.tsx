import PATHS from 'constants/paths';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import LinkTag from 'next/link';
import RoundedImage from '../RoundedImage/RoundedImage';
import styles from './navbar.module.scss';

export default function Navbar() {
  const { data, status } = useSession();
  const { t } = useTranslation();

  const avatarLabel = t('common:avatar', {
    name: data?.user?.name,
  });

  return (
    <nav className={styles['navbar']}>
      <ul className='reset'>
        <li>
          <LinkTag href={PATHS.HOME}>MyLinks</LinkTag>
        </li>
        <li>
          <LinkTag href={PATHS.PRIVACY}>{t('common:privacy')}</LinkTag>
        </li>
        <li>
          <LinkTag href={PATHS.TERMS}>{t('common:terms')}</LinkTag>
        </li>
        {status === 'authenticated' ? (
          <>
            <li className={styles['user']}>
              <RoundedImage
                src={data.user.image}
                alt={avatarLabel}
              />
              {data.user.name}
            </li>
            <li>
              <LinkTag href={PATHS.LOGOUT}>{t('common:logout')}</LinkTag>
            </li>
          </>
        ) : (
          <li>
            <LinkTag href={PATHS.LOGIN}>{t('common:login')}</LinkTag>
          </li>
        )}
      </ul>
    </nav>
  );
}
