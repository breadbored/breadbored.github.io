import { CSSProperties } from "react"

const Icon = ({
    name,
    title,
    alt_text = "",
    extra_classes = "",
    icon_size = 16,
    style = {},
    svg_style = {},
    vote,
    use_classes = "",
    onKeyPress,
    onClick,
}: // ref,
    {
        name: string
        title?: string
        alt_text: string
        extra_classes?: string
        icon_size: number | { width: number | string; height: number | string }
        style?: CSSProperties
        svg_style?: CSSProperties
        vote?: boolean
        use_classes?: string
        onKeyPress?: () => void
        onClick?: () => void
        // ref?: RefObject<HTMLElement>
    }) => {
    let icon_asset = "/assets/icons.svg"
    let width: number | string = 0
    let height: number | string = 0

    if (typeof icon_size == "number") {
        width = icon_size
        height = icon_size
    } else {
        width = icon_size.width
        height = icon_size.height
    }

    return (
        <>
            <span
                className={`icon${vote ? "-vote" : ""} ${extra_classes}`}
                style={style}
                title={title}
                onKeyPress={onKeyPress}
                onClick={onClick}
            // ref={ref}
            >
                {alt_text != "" ? (
                    <img
                        src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%2F%3E"
                        alt={alt_text}
                        className="icon__alt"
                        aria-hidden="true"
                        width="0"
                        height="0"
                    />
                ) : (
                    <></>
                )}

                <svg width={width} height={height} style={svg_style}>
                    <use xlinkHref={`${icon_asset}#${name}`} className={use_classes} />
                </svg>
            </span>
        </>
    )
}

export default Icon
