import React from "react";

const FormRowSelect = ({
  name,
  labelText,
  defaultValue = "",
  list,
  onChange,
}) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <select
        name={name}
        id={name}
        className="form-select"
        defaultValue={defaultValue}
        onChange={onChange ? onChange : null}
      >
        {list.map((itemValue) => (
          <option value={itemValue} key={itemValue}>
            {itemValue}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormRowSelect;
