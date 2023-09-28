import {Fragment, useEffect, useRef, useState} from "react";
import {io, Socket} from "socket.io-client";
import {useDispatch, useSelector} from "react-redux";
import {getCurrentUser} from "../../../entities/User/model/selectors/userSelectors";
import {Bet, NewBet, Round, ServerState} from "../model/types/types";
import {Card} from "../../../shared/ui/Card";
import {Input} from "../../../shared/ui/Input";
import {Button} from "../../../shared/ui/Button";
import {HStack, VStack} from "../../../shared/ui/Stack";
import './roll.css'
import {Roulette} from "./Roller";
import {Avatar} from "../../../shared/ui/Avatar";
import {Text} from "../../../shared/ui/Text";
import {addToBalance, subFromBalance} from "../../../entities/User/model/slices/userSlice";
import {getCurrentRoomId} from "../../../entities/Chat/model/selectors/chatSelectors";

export const RouletteMain = () => {
    const [phase, setPhase] = useState<'betting' | 'rolling' | 'result'>('betting')
    const [betsRed, setBetsRed] = useState<Bet[]>([])
    const [betsGreen, setBetsGreen] = useState<Bet[]>([])
    const [betsBlack, setBetsBlack] = useState<Bet[]>([])
    const [myBets, setMyBets] = useState<Bet[]>([])
    const [lastResults, setLastResults] = useState<number[]>([])

    const [betSize, setBetSize] = useState(0)
    const [timer, setTimer] = useState<number | null>(null)
    const [timeRemaining, setTimeRemaining] = useState<number>(10);
    const [result, setResult] = useState(0)
    const [startTime, setStartTime] = useState(0)
    const [isScrolling, setIsScrolling] = useState(false)
    const [roundEnded, setRoundEnded] = useState(false)
    const dispatch = useDispatch()
    const socketRef = useRef<null | Socket>(null);
    const user = useSelector(getCurrentUser)
    // const room = useSelector(getCurrentRoomId)
    useEffect(() => {
        // let socket: Socket | null = null
        // socketRef.current?.disconnect()
        // if (user) {
        let socket = io(import.meta.env.VITE_ROULETTE_URL, {
            extraHeaders: {
                Authorization: `${localStorage.getItem('access_token')}`,
            },
            // query: {id: user.id}
        })
        socketRef.current = socket

        socketRef.current.on('connect', () => {
            console.log('Подключено к серверу Socket.IO');
        });

        socketRef.current.on('disconnect', () => {
            console.log('Отключено от сервера Socket.IO');
        });

        socketRef.current.on('newGame', (data: { id: number, start_time: number }) => {
            setRoundEnded(true)
            setPhase('betting')
            setTimer((data.start_time + 25) * 1000)
            setIsScrolling(false)
            setBetsBlack([])
            setBetsRed([])
            setBetsGreen([])

        });
        socketRef.current.on('gameResult', (data: Round) => {
            setPhase("rolling")
            setResult(data.roll)
            setStartTime(data.start_time + 25)
            setIsScrolling(true)
            // console.log('gameResult',data)
        });
        socketRef.current.on('serverState', (data: ServerState) => {
            // console.log('serverState', data)
            setPhase(data.phase)
            setLastResults(data.last_results)
            setTimer((data.start_time + 25) * 1000)
            if (data.result?.roll) {
                setResult(data.result.roll)
                setIsScrolling(true)
            }
            if (data.bets.length > 0) {
                for (let i = 0; i <= data.bets.length; i++) {
                    const bet = data.bets[i]
                    addBet(bet)
                }
            }
        });
        socketRef.current.on('betPlaced', (data: Bet) => {
            addBet(data)
            if (user && user.id === data.user.id) {
                setMyBets(prev => [...prev, data])
                dispatch(subFromBalance(data.amount))
            }
        });

        // }
        return () => {
            if (socketRef.current)
                socketRef.current.disconnect();
            if(socket) {
                socket.disconnect()
            }
        };
    }, [])

    const processingMyBets = () => {
        let profit = 0
        if (myBets.length === 0) {
            return true
        }
        for (let i = 0; i < myBets.length; i++) {
            const bet = myBets[i]
            if (bet.lower === result && bet.upper === result) {
                profit = profit + (bet.amount * 14)
            } else if (bet.lower <= result && bet.upper >= result) {
                profit = profit + (bet.amount * 2)
            }
        }
        if (profit > 0) {
            dispatch(addToBalance(profit))
        }
        clearMyBets()

    }

    useEffect(() => {
        if (roundEnded) {
            // console.log('round ended set')
            processingMyBets()
            setRoundEnded(false)
            setLastResults(prev => prev.concat(result).slice(-10))

        }
    }, [roundEnded])
    const clearMyBets = () => {
        // console.log('clear my bets')
        setMyBets([])
    }
    const addBet = (bet: Bet) => {
        if (bet.lower >= 1 && bet.upper <= 7) {
            setBetsRed(prev => [...prev, bet])
        } else if (bet.lower >= 8 && bet.upper <= 14) {
            setBetsBlack(prev => [...prev, bet])
        } else if (bet.lower >= 0 && bet.upper <= 0) {
            setBetsGreen(prev => [...prev, bet])
        }
    }

    const handleBet = (upper: number, lower: number) => {
        if (socketRef.current && user && user.balance >= betSize) {
            const data: NewBet = {
                bet_time: Date.now(),
                amount: betSize,
                bet_type: user.bet_type,
                upper,
                lower,
            }
            socketRef.current?.emit('newBet', data)

        } else {
            console.log('not user', socketRef.current, user)
        }
    }

    useEffect(() => {
        let intervalId: number = 0;
        if (timer !== null) {
            intervalId = setInterval(() => {
                setTimeRemaining(Math.max(0, (timer - Date.now()) / 1000).toFixed(1)); // Ограничиваем время не меньше 0
            }, 100); // Обновление каждую секунду
        }

        return () => clearInterval(intervalId);
    }, [timer]);
    const progressWidth = `${(timeRemaining / 24) * 100}%`;

    return (<>
        <div className={'rolling'}>
            <h4>Фаза: {phase}</h4>
            <p>Осталось: {timeRemaining}</p>
            <div className={'countdown-progress-bar'}>
                <div className={'progress-bar'} style={{width: progressWidth}}/>
            </div>
            <Roulette isScrolling={isScrolling} targetNumber={result} startTime={startTime}/>
            <div style={{backgroundColor: 'white', padding: 6, borderRadius: 4}}>
                <HStack align={"center"} justify={"center"} gap={'32'}>
                    {lastResults && lastResults.map((res, index) => <h2 key={index}
                                                                        style={{color: res >= 1 && res <= 7 ? 'red' : res >= 8 && res <= 14 ? 'black' : 'green'}}>{res}</h2>)}
                </HStack>
            </div>
            <Card fullWidth={true} className={'input_block'}>
                <VStack align={'center'} gap={'24'}>
                    <Input value={betSize} type={'number'} onChange={(value) => setBetSize(Number(value))}/>
                    <HStack gap={'32'}>
                        <Button onClick={() => setBetSize(prev => prev * 2)}>X2</Button>
                        <Button onClick={() => setBetSize(prev => prev / 2)}>/2</Button>
                        <Button onClick={() => setBetSize(prev => prev + 100)}>+100</Button>
                        <Button onClick={() => setBetSize(prev => prev + 500)}>+500</Button>
                    </HStack>
                </VStack>
            </Card>

            <div className={'bet_block'}>
                <HStack align={'start'} justify={'between'}>
                    <div className={'red_block'}>
                        <Button onClick={() => handleBet(7, 1)} fullWidth={true} style={{backgroundColor: '#e0234e'}}>All
                            Red</Button>
                        <VStack align={'center'} gap={'24'}>
                            {betsRed && betsRed.map((bet, index) => <Fragment key={index}>
                                <Card>
                                    {/*<Avatar></Avatar>*/}
                                    <Text text={bet.user.nickname}></Text>
                                    <Text title={`${bet.amount} K`}></Text>
                                </Card>
                            </Fragment>)}
                        </VStack>
                    </div>
                    <div className={'green_block'}>
                        <Button onClick={() => handleBet(0, 0)} fullWidth={true} style={{backgroundColor: 'green'}}>All
                            Green</Button>
                        <VStack align={'center'} gap={'24'}>
                            {betsGreen && betsGreen.map((bet, index) => <Fragment key={index}>
                                <Card>
                                    {/*<Avatar></Avatar>*/}
                                    <Text text={bet.user.nickname}></Text>
                                    <Text title={`${bet.amount} K`}></Text>
                                </Card>
                            </Fragment>)}
                        </VStack>
                    </div>
                    <div className={'black_block'}>
                        <Button onClick={() => handleBet(14, 8)} fullWidth={true}>All Black</Button>
                        <VStack align={'center'} gap={'24'}>
                            {betsBlack && betsBlack.map((bet, index) => <Fragment key={index}>
                                <Card>
                                    {/*<Avatar></Avatar>*/}
                                    <Text text={bet.user.nickname}></Text>
                                    <Text title={`${bet.amount} K`}></Text>
                                </Card>
                            </Fragment>)}
                        </VStack>
                    </div>
                </HStack>
            </div>
        </div>
    </>)
}
