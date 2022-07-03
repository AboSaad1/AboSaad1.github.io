import React from "react"

export default function questions(props) {
    // const answers = props.answers.map((answer) => <span className="Answer" onClick={()=>console.log("start")}>{answer.text}</span>)]
                        //     if(props.finished) {
                        //     if (data.selected && data.correct) classes += "correct";
                        //     if (data.selected && !data.correct) classes += "incorrect";
                        // }
    return (
        <div className="Questions-continer">
            <p className="question">{props.question}</p>
            <div className="answer-continer">
                {
                    props.answers.map((data) => {
                        let classes = data.selected ? "answer selected" : "answer";
                        if(props.finished) {
                            if (data.selected && data.correct) classes += " correct";
                            if (!data.selected && data.correct) classes += " correct";
                            if (data.selected && !data.correct) classes += " incorrect";
                        }
                        return <p className={classes} key={data.id}  onClick={()=>props.setSelected(data.id, props.id)}>{data.text}</p>
                    })
                }
            </div>
        </div>
    )
}