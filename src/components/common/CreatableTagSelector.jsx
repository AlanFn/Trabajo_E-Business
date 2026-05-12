import { useEffect, useMemo, useState } from "react";

function normalizarOpcion(option) {
  if (typeof option === "string") {
    return { value: option, label: option };
  }

  return {
    value: option.value || option.id || option.label,
    label: option.label || option.value || option.id,
  };
}

function normalizarTextoInterno(text) {
  return text.toString().trim().replace(/\s+/g, " ");
}

function existeValor(options, value) {
  return options.some((option) => option.value.toLowerCase() === value.toLowerCase());
}

export default function CreatableTagSelector({
  label,
  helperText,
  options,
  value,
  onChange,
  placeholder,
  allowCreate = true,
  createValue,
}) {
  const normalizedOptions = useMemo(() => options.map(normalizarOpcion), [options]);
  const [localOptions, setLocalOptions] = useState(normalizedOptions);
  const [selectedOption, setSelectedOption] = useState("");
  const [newOption, setNewOption] = useState("");

  useEffect(() => {
    setLocalOptions((current) => {
      const merged = [...current];

      normalizedOptions.forEach((option) => {
        if (!existeValor(merged, option.value)) {
          merged.push(option);
        }
      });

      value.forEach((item) => {
        if (!existeValor(merged, item)) {
          merged.push({ value: item, label: item });
        }
      });

      return merged;
    });
  }, [normalizedOptions, value]);

  const selectedOptions = value.map((item) => {
    const option = localOptions.find((current) => current.value === item);
    return option || { value: item, label: item };
  });

  const availableOptions = localOptions.filter((option) => !value.includes(option.value));

  const addValue = (nextValue, nextLabel = nextValue) => {
    const cleanValue = normalizarTextoInterno(nextValue);
    const cleanLabel = normalizarTextoInterno(nextLabel);

    if (!cleanValue || value.some((item) => item.toLowerCase() === cleanValue.toLowerCase())) {
      return;
    }

    if (!existeValor(localOptions, cleanValue)) {
      setLocalOptions((current) => [...current, { value: cleanValue, label: cleanLabel }]);
    }

    onChange([...value, cleanValue]);
  };

  const handleSelect = (event) => {
    const nextValue = event.target.value;
    if (!nextValue) return;

    const option = localOptions.find((item) => item.value === nextValue);
    addValue(nextValue, option?.label || nextValue);
    setSelectedOption("");
  };

  const handleCreate = () => {
    const cleanLabel = normalizarTextoInterno(newOption);
    if (!cleanLabel) return;

    const cleanValue = createValue ? createValue(cleanLabel) : cleanLabel;
    addValue(cleanValue, cleanLabel);
    setNewOption("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleCreate();
    }
  };

  const removeValue = (item) => {
    onChange(value.filter((current) => current !== item));
  };

  return (
    <div className="tag-selector">
      <label className="contact-form__label">{label}</label>
      {helperText && <p className="tag-selector__helper">{helperText}</p>}

      <div className="tag-selector__chips">
        {selectedOptions.length > 0 ? (
          selectedOptions.map((option) => (
            <button
              className="tag-selector__chip"
              type="button"
              onClick={() => removeValue(option.value)}
              key={option.value}
            >
              {option.label}
              <span aria-hidden="true">×</span>
            </button>
          ))
        ) : (
          <span className="tag-selector__empty">Sin opciones seleccionadas</span>
        )}
      </div>

      <div className="tag-selector__controls">
        <select
          className="contact-form__select"
          value={selectedOption}
          onChange={handleSelect}
          aria-label={label}
        >
          <option value="">{placeholder || "Seleccionar opción"}</option>
          {availableOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {allowCreate && (
          <div className="tag-selector__create">
            <input
              className="contact-form__input"
              value={newOption}
              placeholder="Agregar nueva opción"
              onChange={(event) => setNewOption(event.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="tag-selector__add" type="button" onClick={handleCreate}>
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
