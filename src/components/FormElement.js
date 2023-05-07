const FormElement = (props) => {
    const { content, name, type, value, onChange } = props

    return (
        <div>
            {content}
            <input
                name={name}
                type={type}
                value={value}
                onChange={({ target }) => onChange(target.value)}
            />
        </div>
    )
}

export default FormElement