import { ReactElement, useRef } from "react";
import "./ContractEditor.scss";
import { RootState } from "../../../../Redux/store";
import { useSelector } from "react-redux";
import { Editor } from "@monaco-editor/react";

function ContractEditor(): ReactElement {
  const { contract } = useSelector((state: RootState) => state.contract);
  const editorRef = useRef(null);

  function editorMounted(editor: any) {
    editorRef.current = editor;
  }

  const source = contract?.name || "";

  return (
    <div className="contract-editor-wrapper">
      <div className="contract-editor-container">
        <Editor
          width={"600px"}
          language="typescript"
          defaultValue={source}
          onMount={editorMounted}
        ></Editor>
      </div>
    </div>
  );
}

export default ContractEditor;
