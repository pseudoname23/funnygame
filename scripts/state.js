const states = {
    MAIN_MENU: 0,
    IN_GAME: 1
}
const statesIterable = [
    'MAIN_MENU',
    'IN_GAME'
]
function stateNumberToName(num) {
    return statesIterable[num];
}

let state = states.MAIN_MENU;