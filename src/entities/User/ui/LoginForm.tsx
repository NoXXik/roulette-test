import {useEffect, useState} from "react";
import {Card} from "../../../shared/ui/Card";
import {Text} from "../../../shared/ui/Text";
import {Input} from "../../../shared/ui/Input";
import {Button} from "../../../shared/ui/Button";
// import {useLoginMutation} from "../api/userApi";
// import axios from "axios";
import {useLoginMutation} from "../api/userApi";
import {VStack} from "../../../shared/ui/Stack";
import {useNavigate} from "react-router-dom";


export const LoginForm = () => {
    const [email, setEmail] = useState('')
    // const [nickname, setNickname] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const [login, {isSuccess}] = useLoginMutation()

    useEffect(() => {
        if (isSuccess) {
            let last_url = localStorage.getItem('last_url')
            // localStorage.removeItem('last_url')
            if (!last_url) {
                last_url = '/'
            }
            navigate(last_url)
        }
    }, [isSuccess])

    const handleGoogleAuth = async () => {
        document.location.assign('http://localhost:3333/auth/google/login')
    }
    const handleSteamAuth = async () => {
        document.location.assign('http://localhost:3333/auth/steam/login')
    }
    const handleLogin = async () => {
        console.log(email, password)
        login({email, password})
    }
    return (
        <>
            <Card>
                <VStack align={'center'} gap={'16'}>
                    <Text text={'Login'} align={'center'}></Text>
                    {/*<Input value={nickname} onChange={(value) => setNickname(value)}></Input>*/}
                    <Input value={email} onChange={(value) => setEmail(value)}></Input>
                    <Input value={password} onChange={(value) => setPassword(value)}></Input>
                    <Button onClick={handleLogin}>Login</Button>
                    <Button onClick={handleGoogleAuth}>Google OAuth</Button>
                    <Button onClick={handleSteamAuth}>Steam OAuth</Button>
                </VStack>
            </Card>
        </>
    )
}
