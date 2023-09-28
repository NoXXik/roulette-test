// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import {NavLink} from "react-router-dom";
import {HStack, VStack} from "../../../shared/ui/Stack";
import {Text} from "../../../shared/ui/Text";
// import {Switch} from "../../../shared/ui/Switch/Switch";
import {Input} from "../../../shared/ui/Input";
import {useSelector} from "react-redux";
import {getCurrentUser} from "../../../entities/User/model/selectors/userSelectors";
import {useEffect, useState} from "react";
import {Button} from "../../../shared/ui/Button";
import {useChangeSettingMutation} from "../../../entities/User/api/userApi";
// import { Page } from '@/widgets/Page';

const ProfilePage = () => {
    // const { t } = useTranslation();
    const user = useSelector(getCurrentUser)
    const [steamUrl, setSteamUrl] = useState('')
    const [profileVisible, setProfileVisible] = useState(true)
    const [bigBets, setBigBets] = useState(true)

    const [changeSetting] = useChangeSettingMutation();
    const handleChangeSteamUrl = () => {
        changeSetting({setting: 'steam_url', value: steamUrl})
    }
    useEffect(() => {
        if(user) {
            setSteamUrl(user.settings.steam_url)
            setProfileVisible(user.settings.profile_visible )
            setBigBets(user.settings.big_bets)
        }
    }, [user])

    const handleChangeVisible = () => {
        // setProfileVisible(prev => !prev)
        changeSetting({setting: 'profile_visible', value: !user?.settings.profile_visible})
    }
    const handleChangeBigBets = () => {
        // setBigBets(prev => !prev)
        changeSetting({setting: 'big_bets', value: !user?.settings.big_bets})
    }

    if(!user) {
        <main>
            ...Loading
        </main>
    }

    return (
        <main>
            <VStack>
                <HStack gap={'32'}>
                    <Text text={'Видимость профиля'} />
                    <input onChange={() => handleChangeVisible()} type={'checkbox'} checked={profileVisible} ></input>
                </HStack>
                <HStack gap={'32'}>
                    <Text text={'Подтверждать ставки больше 10000 коинов'} />
                    <input onChange={() => handleChangeBigBets()} type={'checkbox'} checked={bigBets}></input>
                </HStack>
                <HStack gap={'32'}>
                    <Text text={'Ссылка на trade-link Steam'} />
                    <Input onChange={(value) => setSteamUrl(value) } value={steamUrl}/>
                    <Button onClick={handleChangeSteamUrl}>Сохранить</Button>
                </HStack>
            </VStack>
        </main>
    );
};

export default ProfilePage;
