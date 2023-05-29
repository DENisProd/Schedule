export function checkGroups(field) {
    let _field = localStorage.getItem(field)

    try {
        _field = JSON.parse(_field)
        if (typeof _field == 'object') console.log('ok')
        else if (typeof _field === 'number') {
            _field = {
                id: _field,
                name: "Группа",
                university: 'dstu'
            }
        }
        else _field = null
    } catch (e) {
        _field = null
    }
    return _field
}