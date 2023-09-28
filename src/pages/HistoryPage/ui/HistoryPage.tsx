// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import {NavLink} from "react-router-dom";
import {AppLink} from "../../../shared/ui/AppLink";
import {useLazyGetRouletteBetsQuery} from "../../../entities/User/api/userApi";
import {useEffect, useState} from "react";
import {Text} from "../../../shared/ui/Text";
import {Button} from "../../../shared/ui/Button";
import {HistoryBet} from "../../../widgets/Roulette/model/types/types";
import {HStack, VStack} from "../../../shared/ui/Stack";

const HistoryPage = () => {
    const [rouletteBets, setRouletteBets] = useState<HistoryBet[]>([])
    const [page, setPage] = useState(1)
    const betsLimit = 10;

    const [getRouletteBets, {data, isLoading, isSuccess}] = useLazyGetRouletteBetsQuery()
    useEffect(() => {
        getRouletteBets({limit: betsLimit, page: page})
    }, [])
    useEffect(() => {
        if (data && isSuccess) {
            setRouletteBets(prev => [...prev, ...data])
        }
    }, [data])
    const handleLoadMore = () => {
        setPage(prev => prev + 1)
    }
    useEffect(() => {
        getRouletteBets({limit: betsLimit, page: page})
    }, [page])
    if (rouletteBets) {
        return (
            <main>
                <p>History Page Roulette Bets</p>
                <VStack align={"center"} gap={'32'}>
                    <HStack gap={'32'}>
                        <Text text={`ID`}/>
                        <Text text={`Время`}/>
                        <Text text={`Раунд`}/>
                        <Text text={`Ставка`}/>
                        <Text text={`Число`}/>
                        <Text text={`Профит`}/>
                    </HStack>
                    {isLoading && <Text title={'Loading...'}/>}
                    {rouletteBets && rouletteBets.map(bet => <HStack gap={'32'}>
                        <Text text={`${bet.id}`}/>
                        <Text text={`${bet.bet_time}`}/>
                        <Text text={`${bet.round.id}`}/>
                        <Text text={`${bet.amount}`}/>
                        <Text text={`${bet.lower} - ${bet.upper}`}/>
                        <Text text={`${bet.won - bet.amount}`}/>
                    </HStack>)}
                </VStack>
                <Button onClick={handleLoadMore}>Загрузить еще...</Button>
            </main>
        );
    }
    return (
        <main>
            <p>History Page with auth only</p>
            <AppLink to={'/login'}>Login</AppLink>
        </main>
    );
};

export default HistoryPage;


// const types = ["success", "info", "warning", "error"];
// const {t} = useTranslation()
// const handleNotification = () => {
//     toast(t('Главная страница'), {
//         type: types[Math.floor(Math.random() * types.length)] as TypeOptions
//     });
// }
