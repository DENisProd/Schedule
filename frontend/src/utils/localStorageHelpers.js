export function checkGroups(field) {
    let _field = localStorage.getItem(field)

    try {
        _field = JSON.parse(_field)
        if (typeof _field == 'object') _field = _field
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

// Функция для удаления дубликатов
export function removeDuplicates(arr, props) {
    const seen = new Set();
    return arr.filter(item => {
        const key = props.map(prop => item[prop]).join('-');
        if (!seen.has(key)) {
            seen.add(key);
            return true;
        }
        return false;
    });
}