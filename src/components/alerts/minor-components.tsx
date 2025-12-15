type BasicBtnProps = {
    handler: (e: any) => void,
    text: string
}

export type LowerBtnProps = {

} & BasicBtnProps

export function LowerButton(props: LowerBtnProps) {
    return <button className="btn" onClick={props.handler}>
        {props.text}
    </button>
}

export type ConfirmBtnProps = {

} & BasicBtnProps

export function ConfirmButton(props: ConfirmBtnProps) {
    return <button className="confirmBtn" onClick={props.handler}>
        {props.text}
    </button>
}

export function TextZone({ text }: { text: string }) {
    return <div className="w-full">
        <h1 className="text-lg px-1" id="verify-result">{text}</h1>
    </div>
}