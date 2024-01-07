import { ReactElement, useEffect, useRef } from "react";
import "./ContractEditor.scss";
import { RootState, useAppDispatch } from "../../../../Redux/store";
import { useSelector } from "react-redux";
import { Editor, Monaco } from "@monaco-editor/react";
import { monacoLightTheme } from "./themes/light";
//@ts-ignore
import customTypings from "!!raw-loader!@algorandfoundation/tealscript/types/global.d.ts";
import { updateContractSource } from "../../../../Redux/portal/contractReducer";
import { debounce, Grid } from "@mui/material";
import ContractHeader from "../ContractHeader/ContractHeader";

function ContractEditor(): ReactElement {
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
      customTypings,
      "file:///node_modules/@algorandfoundation/tealscript/types/global.d.ts",
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
    <div className="contract-editor-wrapper">
      <div className="contract-editor-container">
        <Grid container spacing={0}>
          <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
            <div>
              <div className="contract-editor-header">
                <ContractHeader></ContractHeader>
              </div>
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
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default ContractEditor;
