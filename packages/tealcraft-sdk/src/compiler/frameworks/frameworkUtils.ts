import { A_Framework } from "../../types";

export function getFrameworks(): A_Framework[] {
  return [
    {
      id: "tealscript",
      label: "TealScript",
      language: "typescript",
      extension: "ts",
    },
    {
      id: "puya",
      label: "Puya",
      language: "python",
      extension: "py",
    },
  ];
}

export function getFramework(id: string): A_Framework | undefined {
  const frameworks = getFrameworks();
  return frameworks.find((framework) => {
    return framework.id === id;
  });
}
