import {memo} from "react";
import {useTranslation} from "react-i18next";
import {classNames} from "../../../shared/lib/classNames/classNames";
import {HStack} from "../../../shared/ui/Stack";
import cls from './Navbar.module.scss'
import {Button} from "../../../shared/ui/Button";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {getCurrentUser} from "../../../entities/User/model/selectors/userSelectors";
import {Text} from "../../../shared/ui/Text";
import {Card} from "../../../shared/ui/Card";
import {LangSwitcher} from "../../../features/LangSwitcher";
import {AppLink} from "../../../shared/ui/AppLink";
import {useLogoutMutation} from "../../../entities/User/api/userApi";
import {NotificationCenter} from "../../NotificationCenter/ui/NotificationCenter";
import {getRouteAffiliate, getRouteHistory, getRouteMain} from "../../../shared/const/router";
// import {ChatM} from "../../Chat/ui/Chat";

interface NavbarProps {
    className?: string;
}
export const Navbar = memo(({className}: NavbarProps) => {
    const {t} = useTranslation();
    const authData = useSelector(getCurrentUser);
    const [logout] = useLogoutMutation();
    const navigate = useNavigate();

    // const onShowModal = useCallback(() => {
    //     setIsAuthModal(true);
    // }, []);

    const handleLogout = () => {
        logout('')
    }
    if (authData) {
        return (
            <header className={classNames('isAppRedesigned', {}, [className])}>
                <Card>
                    <HStack justify={'end'} gap="16" className={cls.actions}>
                        {/*<NotificationButton/>*/}
                        {/*<AvatarDropdown/>*/}
                        <AppLink to={getRouteMain()}>{t('Главная')}</AppLink>
                        <AppLink to={getRouteHistory()}>{t('История')}</AppLink>
                        <AppLink to={getRouteAffiliate()}>{t('Рефералы')}</AppLink>
                        <LangSwitcher/>
                        <Text text={`${t('Звук')} ${authData.settings.sound ? 'On': 'Off'}`}/>
                        <Text text={`${t('Баланс')} ${authData.balance}`}/>
                        {/*<Text text={authData.nickname} />*/}
                        <AppLink to={'/profile'}>{authData.nickname}</AppLink>
                        <Button onClick={handleLogout}>{t('Выйти')}</Button>
                        <NotificationCenter />
                    </HStack>
                </Card>
            </header>
        );
    }

    return (
        <header className={classNames('isAppRedesigned', {}, [className])}>
            <Button
                variant="clear"
                className={cls.links}
                onClick={() => navigate('/login')}
            >
                {t('Войти')}
            </Button>
        </header>
    );
});
