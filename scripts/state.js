const states = {
    MAIN_MENU: 0,
    IN_GAME: 1,
    PAUSED: 2
}
const statesIterable = [
    'MAIN_MENU',
    'IN_GAME',
    'PAUSED'
]
function stateNumberToName(num) {
    return statesIterable[num];
}

let state = states.MAIN_MENU;