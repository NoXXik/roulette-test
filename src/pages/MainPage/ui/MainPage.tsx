// import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {LangSwitcher} from "../../../features/LangSwitcher";
// import {NavLink} from "react-router-dom";
import {AppLink} from "../../../shared/ui/AppLink";
import {VStack} from "../../../shared/ui/Stack";
import {RouletteMain} from "../../../widgets/Roulette/ui/RouletteMain";
import {useSelector} from "react-redux";
import {getCurrentRoomId} from "../../../entities/Chat";
// import { Page } from '@/widgets/Page';

const MainPage = () => {
    const { t } = useTranslation();
    // const [value, setValue] = useState('');
    //
    // const onChange = (val: string) => {
    //     setValue(val);
    // };

    return (
        <main>
            {/*{t('Главная страница')}*/}
            {/*<LangSwitcher/>*/}
            <VStack>
                {/*<AppLink to={'/login'}>Login</AppLink>*/}
                {/*<AppLink to={'/history'}>History</AppLink>*/}
                {/*<AppLink to={'/affiliate'}>Affiliate</AppLink>*/}
                <RouletteMain />
                {/*<Chat className={'chat'}></Chat>*/}

            </VStack>
        </main>
    );
};

export default MainPage;
