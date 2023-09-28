// import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// import {LangSwitcher} from "../../../features/LangSwitcher";
// import {NavLink} from "react-router-dom";
// import {AppLink} from "../../../shared/ui/AppLink";
import {
    getCurrentReferrer,
    useChangeCodeMutation,
    useCreateReferrerMutation,
    useLazyGetReferrerQuery
} from "../../../entities/Referrer";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Text} from "../../../shared/ui/Text";
import {Input} from "../../../shared/ui/Input";
import {getCurrentUser} from "../../../entities/User/model/selectors/userSelectors";
import {Button} from "../../../shared/ui/Button";
import {toast} from "react-toastify";
import {HStack} from "../../../shared/ui/Stack";
import {useCollectBonusesMutation} from "../../../entities/Referrer/api/referrerApi";
import {changeCodeAction} from "../../../entities/Referrer/model/slices/referrerSlice";
// import { Page } from '@/widgets/Page';

const AffiliatePage = () => {
    const { t } = useTranslation();
    const [createReferrer, {isSuccess: createIsSuccess, isError: createIsError}] = useCreateReferrerMutation();
    const [changeCode, {data: changeData, isSuccess: changeIsSuccess, isError: changeIsError}] = useChangeCodeMutation();
    const [getReferrer] = useLazyGetReferrerQuery();
    const dispatch = useDispatch();
    const [collectBonus, {isSuccess: collectIsSuccess, isError: collectIsError}] = useCollectBonusesMutation();
    const referrer = useSelector(getCurrentReferrer);
    const user = useSelector(getCurrentUser)
    const [code, setCode] = useState<string>(user?.nickname.replace(' ', '').toUpperCase() || '');


    useEffect(() => {
        getReferrer(null)
    },[])

    useEffect(() => {
        if(referrer) {
            setCode(referrer.code)
        }
    }, [referrer])

    useEffect(() => {
        if(createIsSuccess) {
            toast(t('Ваш реферальный код успешно создан!'), {type: 'success'})
        }
        if(createIsError) {
            toast(t('При создании реферального кода произошла ошибка'), {type: 'error'})
        }
    }, [createIsSuccess, createIsError])
    useEffect(() => {
        if(changeIsSuccess && changeData) {
            toast(t('Ваш реферальный код успешно изменен!'), {type: 'success'})
            dispatch(changeCodeAction(changeData.code))

        }
        if(changeIsError) {
            toast(t('При изменении реферального кода произошла ошибка'), {type: 'error'})
        }
    }, [changeIsSuccess, changeIsError])
    const handleCodeChange = (value:string) => {
        setCode(value)
    }
    const handleCreate = () => {
        createReferrer({code})
    }
    const handleRefCodeChange = () => {
        changeCode({code})
    }

    const handleCollect = async () => {
        await collectBonus(null)
        if(collectIsSuccess) {
            toast('Вы собрали Бонус', {type: 'error'})
        }


        if(collectIsError) {
            toast('Произошла ошибка', {type: "success"})
        }
    }

    if(!referrer) {
        return (
            <main>
                {t('Affiliates')}
                <Text text={t('На данный момент вы не зарегестрированы в качестве Реферера')} />
                <Text text={t('Введите код который хотите использовать и нажмите создать')} />
                <Input value={code} onChange={(value) =>handleCodeChange(value)} />
                <Button onClick={handleCreate}>Создать</Button>
            </main>
        );
    }
    // setCode(referrer.code)
    return (
        <main>
            {t('Affiliates')}
            <Text text={t('Введите код на который хотите изменить и нажмите Изменить')} />
            <Input value={code} onChange={(value) =>handleCodeChange(value)} />
            <Button onClick={handleRefCodeChange}>Изменить</Button>

            <Text text={t(`Баланс: ${referrer.balance}`)}/>
            <Text text={t(`Уровень: ${referrer.level}`)}/>
            <Text text={t(`Объем ставок: ${referrer.bets_amount}`)}/>
            <Text text={t(`Заработано: ${referrer.earned}`)}/>
            <Text text={t(`Код: ${referrer.code}`)}/>
            {referrer.balance > 0 &&
                <Button onClick={handleCollect}>{t('Собрать')}</Button>
            }
            {referrer.referred_users.length > 0 ?
                <>
                    <HStack gap={'32'}>
                        <Text text={'ID'}/>
                        <Text text={'Date'}/>
                        <Text text={'Commission'}/>
                    </HStack>
                    {referrer.referred_users.map((user) => <HStack gap={'24'}>
                    <Text text={String(user.id)}/>
                    <Text text={String(user.created_at)}/>
                    <Text text={String(user.referrer_comission)}/>
                </HStack>)}
                </>
            :
                <Text text={t('На данный момент у вас нет рефералов')}/>
            }
        </main>
    );
};

export default AffiliatePage;
