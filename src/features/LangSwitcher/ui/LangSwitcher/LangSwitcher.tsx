import { useTranslation } from 'react-i18next';
import {memo, useEffect} from 'react';
import {Button} from "../../../../shared/ui/Button";
import {useChangeSettingMutation} from "../../../../entities/User/api/userApi";
import {useSelector} from "react-redux";
import {getCurrentUser} from "../../../../entities/User/model/selectors/userSelectors";

interface LangSwitcherProps {
    className?: string;
    short?: boolean;
}

export const LangSwitcher = memo(({ className, short }: LangSwitcherProps) => {
    const { t, i18n } = useTranslation();
    const [changeLanguage] = useChangeSettingMutation();
    const user = useSelector(getCurrentUser)
    const toggle = async () => {
        i18n.changeLanguage(i18n.language === 'ru' ? 'en' : 'ru');
        changeLanguage({setting: 'lng', value: i18n.language === 'ru' ? 'en' : 'ru'})
    };
    useEffect(() => {
        if(user) {
            i18n.changeLanguage(user.settings.lng || 'en')
        }
    }, [])

    return (
        <Button className={className} onClick={toggle} variant="clear">
            {t(short ? 'Короткий язык' : 'Язык')}
        </Button>
    );
});
