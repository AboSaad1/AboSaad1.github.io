import React from 'react';
import Questions from "./components/Questions"
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import './index.css'

export default function App() {
    const [started, setStarted] = React.useState(false)
    const [ended, setEnded] = React.useState(false)
    const [FrezzeButton, setFrezzeButton] = React.useState(false)
    const [score, setScore] = React.useState(0)
    const [inSolvedQuestions, setInSolvedQuestions] = React.useState(0)
    const [settings, setSettings] = React.useState({ difficulty: "easy", numberQuestions: 5, category: "" })
    const [QuestionsData, setQuestionsData] = React.useState([])
    
    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex !== 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        return array;
    }
    
    function setData(data) {
        const QuestionData = []        
        data.results.map((data) => {
            const Answers = []
            Answers.push({
                text: decodeURIComponent(data.correct_answer),
                correct: true,
                selected: false,
                id: nanoid()
            })
            data.incorrect_answers.map((data)=> {
                Answers.push({ 
                    text: decodeURIComponent(data),
                    correct: false,
                    selected: false,
                    id: nanoid()
                })
            })
            QuestionData.push({question: decodeURIComponent(data.question), answers: shuffle(Answers), id: nanoid()})
        })
        setQuestionsData(shuffle(QuestionData))
    }
    
    async function getDataFromUrl() {
        await fetch(`https://opentdb.com/api.php?amount=${settings.numberQuestions}&difficulty=${settings.difficulty}${settings.category !== "any" && "&category=" + settings.category}&type=multiple&encode=url3986`).then(res =>
            res.json()).then(d => {
                setData(d)
        })
    }
    

    
    async function startQuiz() {
        setEnded(false)
        setFrezzeButton(true)
        await getDataFromUrl()
        setFrezzeButton(false)
        setStarted(prevState => !prevState);
    }
    
    function finish() {
        if (!ended) {
            let score = 0
            let answers = 0
            QuestionsData.forEach(data => {
                data.answers.forEach(answer => {
                    if (answer.selected) {
                        answers++
                    }
                    if (answer.selected && answer.correct) {
                        score++
                    }
                })
            })
            if (answers === QuestionsData.length) {
                setEnded(prevState => !prevState)
                setScore(prevScore => score)
                setInSolvedQuestions(0)
            } else {
                const missingQuestions = QuestionsData.length-answers
                setInSolvedQuestions(missingQuestions)
            }
        } else {
            startQuiz()
            setStarted(prevState => !prevState)
        }
    }
    
    function ReturnMain() {
        setStarted(prevState => !prevState)
        setInSolvedQuestions(0)
    }
    
    function setSelected(answerId, questionId) {
        setQuestionsData(prevData => {
            const edited = prevData.map(data => {
                if(data.id === questionId) {
                    data.answers.forEach(answer => {
                        answer.selected = false
                        if(answer.id === answerId) {
                            answer.selected = true
                        }    
                    })      
                }
                return data
            })
            return edited
        })
    }
    
    function Settings(event) {
        setSettings(prevSetting => {
            return {...prevSetting, [event.target.name]: event.target.value}
        })
    }
    

    return (
        <div>
            {started ? (
                <div className="main-container">
                    {QuestionsData.map(data => <Questions question={data.question} answers={data.answers} id={data.id} finished={ended} key={data.id}  setSelected={setSelected} />)}
                    <div className="main--buttons">
                        <button className="Check--button" onClick={finish}>{ended ? "Play Again" : "Check answers"}</button>
                        <button className="Check--button" onClick={ReturnMain}>Main Menu</button>
                        
                        {
                            (
                                ended && score - QuestionsData.length === 0  ? (
                                    <>
                                        <p className="score">You scored {score}/{QuestionsData.length} correct answers.</p> 
                                        <Confetti />
                                    </>
                                ) : ended ? <p className="score">You scored {score}/{QuestionsData.length} correct answers</p> : ""
                            )
                            
                        }
                        {
                            (inSolvedQuestions ? <p className="score">You didn't solve {inSolvedQuestions} {inSolvedQuestions > 1 ? "questions" : "question"}</p> : "")
                        }
                    </div>
                </div>
            ) : ( 
                <div className="Start--page">
                    <h1>Quizzical</h1>
                    <br />
                    <label htmlFor="input">Amount of Questions: </label>
                    <div className="input-continer">                
                        <input id="input" name="numberQuestions" onChange={Settings} value={settings.numberQuestions}  className="Inputs" type="number" min="1" max="30"></input>
                    </div>
                    <label htmlFor="diff">Select Difficulty: </label>
                    <div className="input-continer">                  
                        <select onChange={Settings} className="Inputs" value={settings.difficulty} name="difficulty" id="diff">
                            <option name="easy" value="easy">Easy</option>
                            <option name="medium" value="medium">Medium</option>
                            <option name="hard" value="hard">Hard</option>
                        </select>
                    </div>
                    <label>Select Category: </label>
                    <div className="input-continer">
                        <select onChange={Settings} defaultValue={settings.category} name="category" className="Inputs">
                            <option value="">Any Category</option>
                            <option value="9">General Knowledge</option><option value="10">Entertainment: Books</option><option value="11">Entertainment: Film</option><option value="12">Entertainment: Music</option><option value="13">Entertainment: Musicals &amp; Theatres</option><option value="14">Entertainment: Television</option><option value="15">Entertainment: Video Games</option><option value="16">Entertainment: Board Games</option><option value="17">Science &amp; Nature</option><option value="18">Science: Computers</option><option value="19">Science: Mathematics</option><option value="20">Mythology</option><option value="21">Sports</option><option value="22">Geography</option><option value="23">History</option><option value="24">Politics</option><option value="25">Art</option><option value="26">Celebrities</option><option value="27">Animals</option><option value="28">Vehicles</option><option value="29">Entertainment: Comics</option><option value="30">Science: Gadgets</option><option value="31">Entertainment: Japanese Anime &amp; Manga</option><option value="32">Entertainment: Cartoon &amp; Animations</option>		</select>
                        <br />
                        <br />
                        {FrezzeButton ? <button className="Start--button">Loading ...</button> : <button className="Start--button" onClick={startQuiz}>Start quiz</button>}
                    </div> 
                </div>
            )}
        </div>
    )
}
