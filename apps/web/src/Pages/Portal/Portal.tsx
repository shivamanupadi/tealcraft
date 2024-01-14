import { ReactElement, useEffect } from "react";
import "./Portal.scss";
import Header from "../../Components/Header/Header";
import { useAppDispatch } from "../../Redux/store";
import { initPortal } from "../../Redux/portal/portalReducer";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { TealCraft } from "@repo/tealcraft-sdk";
import NoWorkspaces from "./NoWorkspaces/NoWorkspaces";

function Portal(): ReactElement {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const params = useParams();
  const { workspaceId } = params;

  useEffect(() => {
    dispatch(initPortal());
  }, []);

  useEffect(() => {
    const id = new TealCraft().getWorkspaceId();
    if (id && !workspaceId) {
      navigate(`/portal/workspace/${id}`);
    }
  }, []);

  return (
    <div className="portal-wrapper">
      <div className="portal-container">
        <Header></Header>
        <NoWorkspaces></NoWorkspaces>
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default Portal;
