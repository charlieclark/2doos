import React, { useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const TextEditor = ({ value, onChange }: Props) => {
  const [localValue, updateLocalValue] = useState<string>(value);

  const commitChange = () => {
    onChange(localValue);
  };

  return (
    <textarea
      onClick={(e) => e.stopPropagation()}
      onBlur={commitChange}
      value={localValue}
      onChange={(e) => {
        updateLocalValue(e.target.value);
      }}
      onKeyPress={(e) => {
        if (!e.shiftKey && e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
          commitChange();
        }
      }}
    />
  );
};

export default TextEditor;
