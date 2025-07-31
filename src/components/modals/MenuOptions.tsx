export default function MenuButtons(){
    const options = ["Change Palette",
                     "Change Board size",
                     "Get game link"
    ]
    return (<div>
{options.map(option =>{
    return <li className="list-style-none ">
        {option}
    </li>
})}
    </div>)
}