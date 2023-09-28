import {useState, useEffect, useRef} from 'react';
import './roller.css'; // Подключите CSS с необходимыми стилями


const nums = [
    [644, 735],  // 0
    [0, 91], // 1
    [184, 275], // 2
    [368, 459], // 3
    [552, 643], // 4
    [828, 919], // 5
    [1012, 1103], // 6
    [1196, 1287], // 7
    [1288, 1380], // 8
    [1104, 1195], // 9
     [920, 1011], // 10
     [736, 827], // 11
     [460, 551], // 12
     [276, 367], // 13
     [92, 183], // 14
]
export const Roulette = ({targetNumber, startTime, isScrolling}: {targetNumber: number, startTime: number, isScrolling: boolean}) => {
    const [imagePosition, setImagePosition] = useState(0) // позиция картинки относительно
    const [linePos, setLinePos] = useState(0)
    const [rollHeight, setRollHeight] = useState<92 | 80 | 60>(92)
    const [imageWidth, setImageWidth] = useState<1380 | 1200| 900>(1380)
    const [screenWidth ,setScreenWidth] = useState(window.innerWidth)
    // начала картинки, которое меняется во время прокрутки
    const rollRef = useRef(null)

    const handleResize = () => {
        setScreenWidth(window.innerWidth);
        if(window.innerWidth > 1000) {
            setRollHeight(92)
            setImageWidth(1380)
        } else if(window.innerWidth > 768) {
            setRollHeight(80)
            setImageWidth(1200)

        } else {
            setRollHeight(60)
            setImageWidth(900)

        }
        console.log(screenWidth, rollHeight)

    };
    useEffect(() => {
        // Получаем div элемент
        const divElement = rollRef.current;

        // Проверяем, что div существует
        if (divElement) {
            // Получаем ширину div элемента
            setLinePos(divElement.clientWidth / 2);
            console.log('linePos:', linePos);
        }
        setImagePosition(0)
        window.addEventListener('resize', handleResize);

        // Удаляем обработчик события при размонтировании компонента
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    useEffect(() => {
        if(rollRef && rollRef.current) {
            setLinePos(rollRef.current.clientWidth / 2);
            console.log(linePos)
        }
    }, [rollRef.current && rollRef.current.clientWidth])


    function smoothMoveX() {

        const curTime = performance.now() / 1000
        const startPosition = imagePosition - linePos
        const num1 = (nums[targetNumber][0] + 5) * (rollHeight / 92)
        const num2 = (nums[targetNumber][1] - 5) * (rollHeight / 92)
        const rndInt = getRandomInt(num1, num2)
        const endPosition = - rndInt - (imageWidth * 35) + linePos
        // console.table({num1, num2, rndInt})
        const animate = () => {
            // console.log('animate')
            const elapsedTime = performance.now() - curTime * 1000;

            const progress = Math.min(elapsedTime / 4000, 1); // Ensure progress does not exceed 1
            const currentX = calculateNewPosition(startPosition, endPosition, 4000, curTime)
            setImagePosition(currentX)
            if (progress < 1) {
                setTimeout(() => {
                    requestAnimationFrame(animate)
                }, 16)

            } else {
                setImagePosition(prev => prev % imageWidth)
            }
        };

        requestAnimationFrame(animate);
        // setImagePosition(prev => prev % imageWidth)

    }

    useEffect(() => {
        // setTimeout(() => {
        //     setImagePosition(prev => prev % imageWidth)
        // }, 4000)
        if(isScrolling) {
            smoothMoveX()
        }

    }, [startTime, isScrolling]);
    function calculateNewPosition(startPos: number, endPos: number, scrollDuration: number = 4000, startTime: number) {
        const currentTime = performance.now() - startTime * 1000;
        const progress = Math.min(Math.pow(currentTime / scrollDuration, 1/60), 1); // Прогресс от 0 до 1
        const distance = endPos - startPos;
        const newPosition = startPos + distance * progress;
        return newPosition;
    }


    return (
        <>
            <div ref={rollRef} className="roulette" style={{backgroundPosition: `${imagePosition}px 0px`, height: rollHeight}}>
                <div className="roulette-line"/>
            </div>
        </>
    );
};



const getRandomInt = (min: number, max: number) => {
    // Включая min и max
    return Math.round(Math.random() * (max - min)) + min;
};

// curPos  endPos
// -300 => -600 = -600 - (-width / 2) = -300         imagePosition = imagePosition - 300

// -800 => -700 = -700 - (-300) = -400 - (1380 * 2) = -3160
// => after roll     imagePosition = -3160 % 1380


