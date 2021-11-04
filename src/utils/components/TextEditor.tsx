import classNames from "classnames";
import React, { useState } from "react";
import styles from "./TextEditor.module.scss";

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

const TextEditor = ({ value, onChange, className }: Props) => {
  const [localValue, updateLocalValue] = useState<string>(value);
  const [isEditing, setIsEditing] = useState(false);

  const commitChange = () => {
    onChange(localValue);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
        className={classNames(className, styles.preview)}
      >
        {value}
      </div>
    );
  }

  return (
    <textarea
      className={styles.textArea}
      autoFocus
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
