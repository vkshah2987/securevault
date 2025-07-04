import styles from './Input.module.css'

const Input = ({
    type = 'text',
    id,
    name,
    required = true,
    title,
    value,
    onChange,
    customClassName = '',
    inputClassName = ''
}) => {
    return (
        <div className={`${styles.inputContainer} ${customClassName}`}>
            <input
                className={`glassEffect ${inputClassName}`}
                type={type}
                id={id}
                name={name}
                value={value}
                required={required}
                onChange={onChange}
                placeholder=''
            />
            <label htmlFor={id}>{title}</label>
        </div>
    )
}

export default Input;