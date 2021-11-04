import SimpleMDE, { SimpleMdeToCodemirrorEvents } from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { useMemo, useRef, useState } from "react";
// import ReactMarkdown from "react-markdown";
import Showdown from "showdown";
import styles from "./MarkdownEditor.module.scss";
import classNames from "classnames";
import { Button } from "@mui/material";

const converter = new Showdown.Converter({ simpleLineBreaks: true });

const options = {
  status: false,
  previewRender: (text: string) => {
    return converter.makeHtml(text);
  },
  autofocus: true,
};

const MarkdownEditor = ({
  value: initialValue,
  onChange,
  className,
}: {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
}) => {
  const [isPreview, setIsPreview] = useState(true);
  const [value, setValue] = useState(initialValue);

  const save = () => {
    setIsPreview(true);
    onChange(value);
  };

  // const { current: events } = useRef({
  //   blur: save,
  // });

  if (isPreview) {
    return (
      <div
        className={classNames(styles.preview, "editor-preview", className)}
        onClick={() => setIsPreview(false)}
        dangerouslySetInnerHTML={{
          __html: converter.makeHtml(value || "Add a description..."),
        }}
      />
    );
  }

  return (
    <div className={className}>
      <Button className={styles.button} variant="contained" onClick={save}>
        save
      </Button>
      <SimpleMDE options={options} value={value} onChange={setValue} />
    </div>
  );
};

export default MarkdownEditor;
