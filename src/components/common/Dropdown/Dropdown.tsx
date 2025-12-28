import React from 'react';
import styles from './Dropdown.module.css';

export interface DropdownOption<T = string> {
    label: string;
    value: T;
}

export interface DropdownProps<T = string> {
    label?: string;
    placeholder?: string;
    options: DropdownOption<T>[];
    value: T | null;
    onChange: (value: T) => void;
    disabled?: boolean;
}

export function Dropdown<T = string>({
    label,
    placeholder = 'Select...',
    options,
    value,
    onChange,
    disabled = false
}: DropdownProps<T>) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIndex = e.target.selectedIndex - 1; // -1 for placeholder
        if (selectedIndex >= 0) {
            onChange(options[selectedIndex].value);
        }
    };

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={styles.dropdownContainer}>
            {label && <label className={styles.label}>{label}</label>}
            <select
                className={styles.select}
                value={selectedOption?.label || ''}
                onChange={handleChange}
                disabled={disabled}
            >
                <option value="">{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={option.label}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
