import React from "react";
import styled from "styled-components";

import { ActionConfigType } from "shared/types";

import RepoList from "./RepoList";
import BranchList from "./BranchList";
import ContentsList from "./ContentsList";
import ActionDetails from "./ActionDetails";
import InputRow from "../form-components/InputRow";
import Input from "components/porter/Input";

type Props = {
  actionConfig: ActionConfigType | null;
  branch: string;
  setActionConfig: (x: ActionConfigType) => void;
  setBranch: (x: string) => void;

  setDockerfilePath: (x: string) => void;

  setFolderPath: (x: string) => void;
  setBuildView?: (x: string) => void;
};

const ActionConfEditorStack: React.FC<Props> = (props) => {
  const { actionConfig, setBranch, setActionConfig, branch } = props;

  if (!actionConfig.git_repo) {
    return (
      <ExpandedWrapperAlt>
        <RepoList
          actionConfig={actionConfig}
          setActionConfig={(x: ActionConfigType) => setActionConfig(x)}
          readOnly={false}
        />
      </ExpandedWrapperAlt>
    );
  } else if (!branch) {
    props.setFolderPath("./");
    return (
      <>
        <ExpandedWrapperAlt>
          <BranchList
            actionConfig={actionConfig}
            setBranch={(branch: string) => setBranch(branch)}
          />
        </ExpandedWrapperAlt>
        <Br />
      </>
    );
  }
  return (
    <>
      <Input
        disabled={true}
        label="GitHub branch:"
        type="text"
        width="100%"
        value={props?.branch}
        setValue={() => { }}
        placeholder=""
      />
      <BackButton
        width="145px"
        onClick={() => {
          setBranch("");
          props.setFolderPath("");
          props.setDockerfilePath("");
          props.setActionConfig(actionConfig);
          props.setBuildView("buildpacks");
        }}
      >
        <i className="material-icons">keyboard_backspace</i>
        Select branch
      </BackButton>
    </>
  );
};

export default ActionConfEditorStack;

const Br = styled.div`
  width: 100%;
  height: 8px;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderButton = styled.div`
  margin-bottom: 5px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  margin-right: 10px;
`;

const RepoHeader = styled.div`
  display: flex;
  align-items: center;
`;

const ExpandedWrapper = styled.div`
  margin-top: 10px;
  width: 100%;
  border-radius: 3px;
  border: 1px solid #ffffff44;
  max-height: 275px;
`;

const ExpandedWrapperAlt = styled(ExpandedWrapper)`
  border: 0;
`;

const BackButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 22px;
  cursor: pointer;
  font-size: 13px;
  height: 35px;
  padding: 5px 13px;
  margin-bottom: -7px;
  padding-right: 15px;
  border: 1px solid #ffffff55;
  border-radius: 100px;
  width: ${(props: { width: string }) => props.width};
  color: white;
  background: #ffffff11;

  :hover {
    background: #ffffff22;
  }

  > i {
    color: white;
    font-size: 16px;
    margin-right: 6px;
  }
`;
