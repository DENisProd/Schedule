import {useState} from "react";

export const DropdownTime = ({ data, onSelect }) => {
    const [selectedItem, setSelectedItem] = useState('');

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedItem(selectedValue);

        const selectedObject = data.find(item => item._id === selectedValue);
        onSelect(selectedObject); // Передаем выбранный объект в родительский компонент
    };

    return (
        <select value={selectedItem} onChange={handleChange}>
            <option value="">Выберите элемент</option>
            {data.map(item => (
                <option key={item._id} value={item._id}>
                    {item.number}
                    <span>{` ${item.timeStart} - ${item.timeEnd}`}</span>
                </option>
            ))}
        </select>
    );
};