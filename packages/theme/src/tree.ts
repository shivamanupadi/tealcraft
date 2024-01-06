import { GreyColors } from "./colors";

export const treeStyles = {
  ".MuiCollapse-root": {
    marginLeft: "0px",
  },
  ".MuiTreeItem-root": {
    "&.indent": {
      ".MuiTreeItem-content": {
        paddingLeft: "30px",
      },
    },
    ".MuiTreeItem-content": {
      paddingTop: "8px",
      paddingBottom: "8px",
      "&.Mui-selected": {
        background: "#F5F5F5",
      },
      ".MuiTreeItem-label": {
        fontSize: "13px",
        color: GreyColors.FormValue,
      },
    },
  },
};
