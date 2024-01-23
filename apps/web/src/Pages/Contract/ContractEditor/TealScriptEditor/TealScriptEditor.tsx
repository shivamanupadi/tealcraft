import { ReactElement, useEffect, useRef } from "react";
import "../ContractEditor.scss";
import { useSelector } from "react-redux";
import { Editor, Monaco } from "@monaco-editor/react";
import { monacoLightTheme } from "../themes/light";
import { debounce } from "@mui/material";
import { CustomTypings } from "../intellisense";
import { RootState, useAppDispatch } from "../../../../Redux/store";
import { updateContractSource } from "../../../../Redux/portal/contractReducer";

function TealScriptEditor(): ReactElement {
  const dispatch = useAppDispatch();
  const { contract } = useSelector((state: RootState) => state.contract);
  const editorRef = useRef(null);

  useEffect(() => {
    if (contract && editorRef && editorRef.current) {
      // @ts-ignore
      editorRef.current.setValue(contract.source);
    } else {
      // @ts-ignore
      editorRef.current?.setValue("");
    }
  }, [contract]);

  function editorMounted(editor: any, monaco: Monaco) {
    editorRef.current = editor;

    // @ts-ignore
    monaco.editor.defineTheme("classic-theme", monacoLightTheme);
    monaco.editor.setTheme("classic-theme");

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2016,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    });

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      CustomTypings,
      "file:///node_modules/@algorandfoundation/tealscript/index.d.ts",
    );
  }

  const handleEditorChange = debounce((value: any) => {
    if (contract) {
      dispatch(
        updateContractSource({ contractId: contract.id, source: value }),
      );
    }
  }, 200);

  const source = contract?.source || "";

  return (
    <div className="teal-script-editor-wrapper">
      <div className="teal-script-editor-container">
        <div className="custom-monaco-editor">
          <Editor
            width={"100%"}
            height={"100%"}
            language="typescript"
            theme="classic-theme"
            defaultValue={source}
            options={{
              fontSize: 13,
              minimap: {
                enabled: false,
              },
              detectIndentation: false,
              formatOnPaste: true,
              formatOnType: true,
              lineHeight: 1.2,
              automaticLayout: true,
            }}
            onMount={editorMounted}
            onChange={handleEditorChange}
          ></Editor>
        </div>
      </div>
    </div>
  );
}

export default TealScriptEditor;
