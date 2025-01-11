const dateFormat = (date: Date | number) => {
    if (typeof date == "number") {
        date = new Date(date * 1000)
    }
    // Format to MM.DD.YYYY
    const month = `${date.getMonth() + 1}`.padStart(2, "0")
    const day = `${date.getDate()}`.padStart(2, "0")
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
}

const timeFormat = (date: Date | number) => {
    if (typeof date == "number") {
        date = new Date(date * 1000)
    }
    const minutes = `0${date.getMinutes()}`.slice(-2)
    // Format to HH:MM (24 hour format)
    return `${date.getHours()}:${minutes}`
}

export { dateFormat, timeFormat }
