import { PolicyDocType } from "./auth/types";
import { PullRequest } from "main/home/cluster-dashboard/preview-environments/types";
import { baseApi } from "./baseApi";

import { BuildConfig, FullActionConfigType, PorterAppOptions } from "./types";
import {
  CreateStackBody,
  SourceConfig,
} from "main/home/cluster-dashboard/stacks/types";
import { Contract } from "@porter-dev/api-contracts";

/**
 * Generic api call format
 * @param {string} token - Bearer token.
 * @param {Object} params - Body params.
 * @param {Object} pathParams - Path params.
 * @param {(err: Object, res: Object) => void} callback - Callback function.
 */

const checkAuth = baseApi("GET", "/api/users/current");

const connectECRRegistry = baseApi<
  {
    name: string;
    aws_integration_id: string;
  },
  { id: number }
>("POST", (pathParams) => {
  return `/api/projects/${pathParams.id}/registries`;
});

const connectGCRRegistry = baseApi<
  {
    name: string;
    gcp_integration_id: string;
    url: string;
  },
  { id: number }
>("POST", (pathParams) => {
  return `/api/projects/${pathParams.id}/registries`;
});

const connectDORegistry = baseApi<
  {
    name: string;
    do_integration_id: string;
    url: string;
  },
  { project_id: number }
>("POST", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/registries`;
});

const getAWSIntegration = baseApi<{}, { project_id: number }>(
  "GET",
  ({ project_id }) => `/api/projects/${project_id}/integrations/aws`
);

const getGCPIntegration = baseApi<{}, { project_id: number }>(
  "GET",
  ({ project_id }) => `/api/projects/${project_id}/integrations/gcp`
);

const getAzureIntegration = baseApi<{}, { project_id: number }>(
  "GET",
  ({ project_id }) => `/api/projects/${project_id}/integrations/azure`
);

const getGitlabIntegration = baseApi<{}, { project_id: number }>(
  "GET",
  ({ project_id }) => `/api/projects/${project_id}/integrations/gitlab`
);

const preflightCheckAWSUsage = baseApi<
  {
    target_arn: string;
    region: string;
  },
  { id: number }
>("POST", (pathParams) => {
  return `/api/projects/${pathParams.id}/integrations/aws/preflight/usage`;
});

const createAWSIntegration = baseApi<
  {
    aws_region?: string;
    aws_cluster_id?: string;
    aws_access_key_id?: string;
    aws_secret_access_key?: string;
    aws_assume_role_arn?: string;
    aws_target_arn?: string;
    aws_external_id?: string;
  },
  { id: number }
>("POST", (pathParams) => {
  return `/api/projects/${pathParams.id}/integrations/aws`;
});

const overwriteAWSIntegration = baseApi<
  {
    aws_integration_id: number;
    aws_access_key_id: string;
    aws_secret_access_key: string;
    cluster_id: number;
  },
  {
    project_id: number;
  }
>("POST", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/integrations/aws/overwrite`;
});

const updateCluster = baseApi<
  {
    name?: string;
    aws_cluster_id?: string;
    agent_integration_enabled?: boolean;
    preview_envs_enabled?: boolean;
  },
  {
    project_id: number;
    cluster_id: number;
  }
>("POST", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/clusters/${pathParams.cluster_id}`;
});

const renameCluster = baseApi<
  {
    name: string;
  },
  {
    project_id: number;
    cluster_id: number;
  }
>("POST", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/clusters/${pathParams.cluster_id}/rename`;
});

const createAzureIntegration = baseApi<
  {
    azure_client_id: string;
    azure_subscription_id: string;
    azure_tenant_id: string;
    service_principal_key: string;
  },
  { id: number }
>("POST", (pathParams) => {
  return `/api/projects/${pathParams.id}/integrations/azure`;
});

const createGitlabIntegration = baseApi<
  {
    instance_url: string;
    client_id: string;
    client_secret: string;
  },
  { id: number }
>("POST", (pathParams) => {
  return `/api/projects/${pathParams.id}/integrations/gitlab`;
});

const createEmailVerification = baseApi<{}, {}>("POST", (pathParams) => {
  return `/api/email/verify/initiate`;
});

const getPorterApps = baseApi<
  {},
  {
    project_id: number;
    cluster_id: number;
  }
>("GET", (pathParams) => {
  let { project_id, cluster_id } = pathParams;
  return `/api/projects/${project_id}/clusters/${cluster_id}/stacks`;
});

const getPorterApp = baseApi<
  {},
  {
    project_id: number;
    cluster_id: number;
    name: string;
  }
>("GET", (pathParams) => {
  let { project_id, cluster_id, name } = pathParams;
  return `/api/projects/${project_id}/clusters/${cluster_id}/stacks/${name}`;
});

const createPorterApp = baseApi<
  PorterAppOptions,
  {
    project_id: number;
    cluster_id: number;
    stack_name: string;
  }
>("POST", (pathParams) => {
  let { project_id, cluster_id, stack_name } = pathParams;
  return `/api/projects/${project_id}/clusters/${cluster_id}/stacks/${stack_name}`;
});

const deletePorterApp = baseApi<
  {},
  {
    project_id: number;
    cluster_id: number;
    name: string;
  }
>("DELETE", (pathParams) => {
  let { project_id, cluster_id, name } = pathParams;
  return `/api/projects/${project_id}/clusters/${cluster_id}/stacks/${name}`;
});

const createEnvironment = baseApi<
  {
    name: string;
    mode: "auto" | "manual";
    disable_new_comments: boolean;
    git_repo_branches: string[];
    namespace_labels: Record<string, string>;
    git_deploy_branches: string[];
  },
  {
    project_id: number;
    cluster_id: number;
    git_installation_id: number;
    git_repo_owner: string;
    git_repo_name: string;
  }
>("POST", (pathParams) => {
  let {
    project_id,
    cluster_id,
    git_installation_id,
    git_repo_owner,
    git_repo_name,
  } = pathParams;
  return `/api/projects/${project_id}/gitrepos/${git_installation_id}/${git_repo_owner}/${git_repo_name}/clusters/${cluster_id}/environment`;
});

const updateEnvironment = baseApi<
  {
    mode: "auto" | "manual";
    disable_new_comments: boolean;
    git_repo_branches: string[]; // Array with branch names
    namespace_labels: Record<string, string>;
    git_deploy_branches: string[];
  },
  {
    project_id: number;
    cluster_id: number;
    environment_id: number;
  }
>(
  "PATCH",
  ({ project_id, cluster_id, environment_id }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/environments/${environment_id}/settings`
);

const deleteEnvironment = baseApi<
  {
    name: string;
  },
  {
    project_id: number;
    cluster_id: number;
    git_installation_id: number;
    git_repo_owner: string;
    git_repo_name: string;
  }
>("DELETE", (pathParams) => {
  let {
    project_id,
    cluster_id,
    git_installation_id,
    git_repo_owner,
    git_repo_name,
  } = pathParams;
  return `/api/projects/${project_id}/gitrepos/${git_installation_id}/${git_repo_owner}/${git_repo_name}/clusters/${cluster_id}/environment`;
});

const createPreviewEnvironmentDeployment = baseApi<
  PullRequest,
  { project_id: number; cluster_id: number }
>(
  "POST",
  ({ project_id, cluster_id }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/deployments/pull_request`
);

const reenablePreviewEnvironmentDeployment = baseApi<
  {},
  {
    project_id: number;
    cluster_id: number;
    deployment_id: number;
  }
>(
  "PATCH",
  ({ project_id, cluster_id, deployment_id }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/deployments/${deployment_id}/reenable`
);

const listEnvironments = baseApi<
  {},
  {
    project_id: number;
    cluster_id: number;
  }
>("GET", (pathParams) => {
  let { project_id, cluster_id } = pathParams;
  return `/api/projects/${project_id}/clusters/${cluster_id}/environments`;
});

const getEnvironment = baseApi<
  {},
  {
    project_id: number;
    cluster_id: number;
    environment_id: number;
  }
>("GET", (pathParams) => {
  let { project_id, cluster_id, environment_id } = pathParams;
  return `/api/projects/${project_id}/clusters/${cluster_id}/environments/${environment_id}`;
});

const toggleNewCommentForEnvironment = baseApi<
  {
    disable: boolean;
  },
  {
    project_id: number;
    cluster_id: number;
    environment_id: number;
  }
>("PATCH", (pathParams) => {
  let { project_id, cluster_id, environment_id } = pathParams;
  return `/api/projects/${project_id}/clusters/${cluster_id}/environments/${environment_id}/toggle_new_comment`;
});

const validatePorterYAML = baseApi<
  {
    branch?: string;
  },
  {
    project_id: number;
    cluster_id: number;
    environment_id: number;
  }
>("GET", (pathParams) => {
  const { project_id, cluster_id, environment_id } = pathParams;
  return `/api/projects/${project_id}/clusters/${cluster_id}/environments/${environment_id}/validate_porter_yaml`;
});

const createGCPIntegration = baseApi<
  {
    gcp_key_data: string;
    gcp_project_id: string;
  },
  {
    project_id: number;
  }
>("POST", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/integrations/gcp`;
});

const createInvite = baseApi<
  {
    email: string;
    kind: string;
  },
  {
    id: number;
  }
>("POST", (pathParams) => {
  return `/api/projects/${pathParams.id}/invites`;
});

const inviteAdmin = baseApi<{}, { project_id: number }>(
  "POST",
  (pathParams) => {
    return `/api/projects/${pathParams.project_id}/invite_admin`;
  }
);

const createPasswordReset = baseApi<
  {
    email: string;
  },
  {}
>("POST", (pathParams) => {
  return `/api/password/reset/initiate`;
});

const createPasswordResetVerify = baseApi<
  {
    email: string;
    token: string;
    token_id: number;
  },
  {}
>("POST", (pathParams) => {
  return `/api/password/reset/verify`;
});

const createPasswordResetFinalize = baseApi<
  {
    email: string;
    token: string;
    token_id: number;
    new_password: string;
  },
  {}
>("POST", (pathParams) => {
  return `/api/password/reset/finalize`;
});

const createProject = baseApi<{ name: string }, {}>("POST", (pathParams) => {
  return `/api/projects`;
});

const createSubdomain = baseApi<
  {},
  {
    id: number;
    release_name: string;
    namespace: string;
    cluster_id: number;
  }
>("POST", (pathParams) => {
  let { cluster_id, id, namespace, release_name } = pathParams;

  return `/api/projects/${id}/clusters/${cluster_id}/namespaces/${namespace}/releases/${release_name}/subdomain`;
});

const deleteCluster = baseApi<
  {},
  {
    project_id: number;
    cluster_id: number;
  }
>("DELETE", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/clusters/${pathParams.cluster_id}`;
});

const deleteInvite = baseApi<{}, { id: number; invId: number }>(
  "DELETE",
  (pathParams) => {
    return `/api/projects/${pathParams.id}/invites/${pathParams.invId}`;
  }
);

const deletePod = baseApi<
  {},
  { name: string; namespace: string; id: number; cluster_id: number }
>("DELETE", (pathParams) => {
  let { id, name, cluster_id, namespace } = pathParams;
  return `/api/projects/${id}/clusters/${cluster_id}/namespaces/${namespace}/pods/${name}`;
});

const getPodEvents = baseApi<
  {},
  { name: string; namespace: string; id: number; cluster_id: number }
>("GET", (pathParams) => {
  let { id, name, cluster_id, namespace } = pathParams;
  return `/api/projects/${id}/clusters/${cluster_id}/namespaces/${namespace}/pods/${name}/events`;
});

const deleteProject = baseApi<{}, { id: number }>("DELETE", (pathParams) => {
  return `/api/projects/${pathParams.id}`;
});

const deleteRegistryIntegration = baseApi<
  {},
  {
    project_id: number;
    registry_id: number;
  }
>("DELETE", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/registries/${pathParams.registry_id}`;
});

const deleteSlackIntegration = baseApi<
  {},
  {
    project_id: number;
    slack_integration_id: number;
  }
>("DELETE", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/slack_integrations/${pathParams.slack_integration_id}`;
});

const updateNotificationConfig = baseApi<
  {
    payload: any;
  },
  {
    project_id: number;
    cluster_id: number;
    namespace: string;
    name: string;
  }
>("POST", (pathParams) => {
  let { project_id, cluster_id, namespace, name } = pathParams;

  return `/api/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/releases/${name}/notifications`;
});

const getPRDeploymentList = baseApi<
  {
    environment_id?: number;
  },
  {
    cluster_id: number;
    project_id: number;
  }
>("GET", (pathParams) => {
  const { cluster_id, project_id } = pathParams;

  return `/api/projects/${project_id}/clusters/${cluster_id}/deployments`;
});

const getPRDeploymentByID = baseApi<
  {
    id: number;
  },
  {
    cluster_id: number;
    project_id: number;
    environment_id: number;
  }
>("GET", (pathParams) => {
  const { cluster_id, project_id, environment_id } = pathParams;

  return `/api/projects/${project_id}/clusters/${cluster_id}/environments/${environment_id}/deployment`;
});

const deletePRDeployment = baseApi<
  {},
  {
    cluster_id: number;
    project_id: number;
    deployment_id: number;
  }
>("DELETE", (pathParams) => {
  const { cluster_id, project_id, deployment_id } = pathParams;
  return `/api/projects/${project_id}/clusters/${cluster_id}/deployments/${deployment_id}`;
});

const getNotificationConfig = baseApi<
  {},
  {
    project_id: number;
    cluster_id: number;
    namespace: string;
    name: string;
  }
>("GET", (pathParams) => {
  let { project_id, cluster_id, namespace, name } = pathParams;

  return `/api/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/releases/${name}/notifications`;
});

const getGHAWorkflowTemplate = baseApi<
  {
    release_name: string;
    github_action_config: FullActionConfigType;
  },
  {
    cluster_id: number;
    project_id: number;
    namespace: string;
  }
>("POST", (pathParams) => {
  const { cluster_id, project_id, namespace } = pathParams;

  return `/api/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/releases/gha_template`;
});

const deployTemplate = baseApi<
  {
    template_name: string;
    template_version: string;
    image_url?: string;
    values?: any;
    name: string;
    git_action_config?: FullActionConfigType;
    build_config?: any;
    synced_env_groups?: string[];
  },
  {
    id: number;
    cluster_id: number;
    namespace: string;
    repo_url?: string;
  }
>("POST", (pathParams) => {
  let { cluster_id, id, namespace, repo_url } = pathParams;

  if (repo_url) {
    return `/api/projects/${id}/clusters/${cluster_id}/namespaces/${namespace}/releases?repo_url=${repo_url}`;
  }
  return `/api/projects/${id}/clusters/${cluster_id}/namespaces/${namespace}/releases`;
});

const deployAddon = baseApi<
  {
    template_name: string;
    template_version: string;
    values?: any;
    name: string;
  },
  {
    id: number;
    cluster_id: number;
    namespace: string;
    repo_url?: string;
  }
>("POST", (pathParams) => {
  let { cluster_id, id, namespace, repo_url } = pathParams;

  return `/api/projects/${id}/clusters/${cluster_id}/namespaces/${namespace}/addons?repo_url=${repo_url}`;
});

const detectBuildpack = baseApi<
  {},
  {
    project_id: number;
    git_repo_id: number;
    kind: string;
    owner: string;
    name: string;
    branch: string;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/gitrepos/${pathParams.git_repo_id
    }/repos/${pathParams.kind}/${pathParams.owner}/${pathParams.name
    }/${encodeURIComponent(pathParams.branch)}/buildpack/detect`;
});

const detectGitlabBuildpack = baseApi<
  { dir: string },
  {
    project_id: number;
    integration_id: number;
    repo_owner: string;
    repo_name: string;
    branch: string;
  }
>(
  "GET",
  ({ project_id, integration_id, repo_name, repo_owner, branch }) =>
    `/api/projects/${project_id}/integrations/gitlab/${integration_id}/repos/${repo_owner}/${repo_name}/${branch}/buildpack/detect`
);

const getBranchContents = baseApi<
  {
    dir: string;
  },
  {
    project_id: number;
    git_repo_id: number;
    kind: string;
    owner: string;
    name: string;
    branch: string;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/gitrepos/${pathParams.git_repo_id
    }/repos/${pathParams.kind}/${pathParams.owner}/${pathParams.name
    }/${encodeURIComponent(pathParams.branch)}/contents`;
});

const getProcfileContents = baseApi<
  {
    path: string;
  },
  {
    project_id: number;
    git_repo_id: number;
    kind: string;
    owner: string;
    name: string;
    branch: string;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/gitrepos/${pathParams.git_repo_id
    }/repos/${pathParams.kind}/${pathParams.owner}/${pathParams.name
    }/${encodeURIComponent(pathParams.branch)}/procfile`;
});

const getPorterYamlContents = baseApi<
  {
    path: string;
  },
  {
    project_id: number;
    git_repo_id: number;
    kind: string;
    owner: string;
    name: string;
    branch: string;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/gitrepos/${pathParams.git_repo_id
    }/repos/${pathParams.kind}/${pathParams.owner}/${pathParams.name
    }/${encodeURIComponent(pathParams.branch)}/porteryaml`;
});

const getGitlabProcfileContents = baseApi<
  {
    path: string;
  },
  {
    project_id: number;
    integration_id: number;
    owner: string;
    name: string;
    branch: string;
  }
>(
  "GET",
  ({ project_id, integration_id, owner, name, branch }) =>
    `/api/projects/${project_id}/integrations/gitlab/${integration_id}/repos/${owner}/${name}/${encodeURIComponent(
      branch
    )}/procfile`
);

const getBranches = baseApi<
  {},
  {
    project_id: number;
    git_repo_id: number;
    kind: string;
    owner: string;
    name: string;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/gitrepos/${pathParams.git_repo_id}/repos/${pathParams.kind}/${pathParams.owner}/${pathParams.name}/branches`;
});

const getChart = baseApi<
  {},
  {
    id: number;
    cluster_id: number;
    namespace: string;
    name: string;
    revision: number;
  }
>("GET", (pathParams) => {
  let { id, cluster_id, namespace, name, revision } = pathParams;

  return `/api/projects/${id}/clusters/${cluster_id}/namespaces/${namespace}/releases/${name}/${revision}`;
});

const getCharts = baseApi<
  {
    limit: number;
    skip: number;
    byDate: boolean;
    statusFilter: string[];
  },
  {
    id: number;
    cluster_id: number;
    namespace: string;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.id}/clusters/${pathParams.cluster_id}/namespaces/${pathParams.namespace}/releases`;
});

const getChartComponents = baseApi<
  {},
  {
    id: number;
    cluster_id: number;
    namespace: string;
    name: string;
    revision: number;
  }
>("GET", (pathParams) => {
  let { id, cluster_id, namespace, name, revision } = pathParams;

  return `/api/projects/${id}/clusters/${cluster_id}/namespaces/${namespace}/releases/${name}/${revision}/components`;
});

const getChartControllers = baseApi<
  {},
  {
    id: number;
    cluster_id: number;
    namespace: string;
    name: string;
    revision: number;
  }
>("GET", (pathParams) => {
  let { id, cluster_id, namespace, name, revision } = pathParams;

  return `/api/projects/${id}/clusters/${cluster_id}/namespaces/${namespace}/releases/${name}/${revision}/controllers`;
});

const getClusterIntegrations = baseApi("GET", "/api/integrations/cluster");

const getClusters = baseApi<{}, { id: number }>("GET", (pathParams) => {
  return `/api/projects/${pathParams.id}/clusters`;
});

const getCluster = baseApi<
  {},
  {
    project_id: number;
    cluster_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/clusters/${pathParams.cluster_id}`;
});

const getClusterStatus = baseApi<
  {},
  {
    project_id: number;
    cluster_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/clusters/${pathParams.cluster_id}/status`;
});

const getClusterNodes = baseApi<
  {},
  {
    project_id: number;
    cluster_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/clusters/${pathParams.cluster_id}/nodes`;
});

const getClusterNode = baseApi<
  {},
  {
    project_id: number;
    cluster_id: number;
    nodeName: string;
  }
>(
  "GET",
  (pathParams) =>
    `/api/projects/${pathParams.project_id}/clusters/${pathParams.cluster_id}/nodes/${pathParams.nodeName}`
);

const getGitRepoList = baseApi<
  {},
  {
    project_id: number;
    git_repo_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/gitrepos/${pathParams.git_repo_id}/repos`;
});

const getGitRepoPermission = baseApi<
  {},
  {
    project_id: number;
    git_repo_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/gitrepos/${pathParams.git_repo_id}/permissions`;
});

const getGitRepos = baseApi<
  {},
  {
    project_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/gitrepos`;
});

const getImageRepos = baseApi<
  {},
  {
    project_id: number;
    registry_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/registries/${pathParams.registry_id}/repositories`;
});

const getImageTags = baseApi<
  {},
  {
    project_id: number;
    registry_id: number;
    repo_name: string;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/registries/${pathParams.registry_id}/repositories/${pathParams.repo_name}`;
});

const getInfra = baseApi<
  {
    version?: string;
  },
  {
    project_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/infra`;
});

const listInfraTemplates = baseApi<
  {},
  {
    project_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/infras/templates`;
});

const getInfraTemplate = baseApi<
  {},
  {
    project_id: number;
    name: string;
    version: string;
  }
>("GET", (pathParams) => {
  let { project_id, name, version } = pathParams;

  return `/api/projects/${project_id}/infras/templates/${name}/${version}`;
});

const provisionCluster = baseApi<
  {
    project_id: number;
    cluster_id?: number;
    cloud_provider: string;
    cloud_provider_credentials_id: string;
    cluster_settings: {
      cluster_name: string;
      cluster_version: string;
      cidr_range: string;
      region: string;
      node_groups: [
        {
          instance_type: string;
          min_instances: number;
          max_instances: number;
          node_group_type: number;
        },
        {
          instance_type: string;
          min_instances: number;
          max_instances: number;
          node_group_type: number;
        }
      ];
    };
  },
  {
    project_id: number;
  }
>("POST", ({ project_id }) => {
  return `/api/projects/${project_id}/provision/cluster`;
});

const createContract = baseApi<Contract, { project_id: number }>(
  "POST",
  ({ project_id }) => {
    return `/api/projects/${project_id}/contract`;
  }
);

const getContracts = baseApi<{ cluster_id?: number }, { project_id: number }>(
  "GET",
  ({ project_id }) => {
    return `/api/projects/${project_id}/contracts`;
  }
);

const deleteContract = baseApi<{}, { project_id: number; revision_id: string }>(
  "DELETE",
  ({ project_id, revision_id }) => {
    return `/api/projects/${project_id}/contracts/${revision_id}`;
  }
);

const getClusterState = baseApi<{}, { project_id: number; cluster_id: number }>(
  "GET",
  ({ project_id, cluster_id }) => {
    return `/api/projects/${project_id}/clusters/${cluster_id}/state`;
  }
);

const provisionInfra = baseApi<
  {
    kind: string;
    values: any;
    aws_integration_id?: number;
    gcp_integration_id?: number;
    do_integration_id?: number;
    azure_integration_id?: number;
    cluster_id?: number;
  },
  {
    project_id: number;
  }
>("POST", ({ project_id }) => {
  return `/api/projects/${project_id}/infras`;
});

const updateInfra = baseApi<
  { values?: any },
  {
    project_id: number;
    infra_id: number;
  }
>("POST", (pathParams) => {
  let { project_id, infra_id } = pathParams;
  return `/api/projects/${project_id}/infras/${infra_id}/update`;
});

const retryCreateInfra = baseApi<
  {
    aws_integration_id?: number;
    gcp_integration_id?: number;
    do_integration_id?: number;
    values?: any;
  },
  {
    project_id: number;
    infra_id: number;
  }
>("POST", (pathParams) => {
  let { project_id, infra_id } = pathParams;
  return `/api/projects/${project_id}/infras/${infra_id}/retry_create`;
});

const retryDeleteInfra = baseApi<
  { values?: any },
  {
    project_id: number;
    infra_id: number;
  }
>("POST", (pathParams) => {
  let { project_id, infra_id } = pathParams;
  return `/api/projects/${project_id}/infras/${infra_id}/retry_delete`;
});

const deleteInfra = baseApi<
  {},
  {
    project_id: number;
    infra_id: number;
  }
>("DELETE", (pathParams) => {
  let { project_id, infra_id } = pathParams;
  return `/api/projects/${project_id}/infras/${infra_id}`;
});

const listOperations = baseApi<
  {},
  {
    project_id: number;
    infra_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/infras/${pathParams.infra_id}/operations`;
});

const getOperation = baseApi<
  {},
  {
    project_id: number;
    infra_id: number;
    operation_id: string;
  }
>("GET", (pathParams) => {
  let { project_id, infra_id, operation_id } = pathParams;
  return `/api/projects/${project_id}/infras/${infra_id}/operations/${operation_id}`;
});

const getOperationLogs = baseApi<
  {},
  {
    project_id: number;
    infra_id: number;
    operation_id: string;
  }
>("GET", (pathParams) => {
  let { project_id, infra_id, operation_id } = pathParams;
  return `/api/projects/${project_id}/infras/${infra_id}/operations/${operation_id}/logs`;
});

const getInfraState = baseApi<
  {},
  {
    project_id: number;
    infra_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/infras/${pathParams.infra_id}/state`;
});

const getInfraRawState = baseApi<
  {},
  {
    project_id: number;
    infra_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/infras/${pathParams.infra_id}/raw_state`;
});

const getInfraByID = baseApi<
  {},
  {
    project_id: number;
    infra_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/infras/${pathParams.infra_id}`;
});

const getInfraDesired = baseApi<
  {},
  {
    project_id: number;
    infra_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/infras/${pathParams.infra_id}/desired`;
});

const getInfraCurrent = baseApi<
  {},
  {
    project_id: number;
    infra_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/infras/${pathParams.infra_id}/current`;
});

const getIngress = baseApi<
  {},
  { namespace: string; cluster_id: number; name: string; id: number }
>("GET", (pathParams) => {
  let { id, name, cluster_id, namespace } = pathParams;

  return `/api/projects/${id}/clusters/${cluster_id}/namespaces/${namespace}/ingresses/${name}`;
});

const getInvites = baseApi<{}, { id: number }>("GET", (pathParams) => {
  return `/api/projects/${pathParams.id}/invites`;
});

const getJobs = baseApi<
  {},
  { namespace: string; cluster_id: number; release_name: string; id: number }
>("GET", (pathParams) => {
  let { id, release_name, cluster_id, namespace } = pathParams;

  return `/api/projects/${id}/clusters/${cluster_id}/namespaces/${namespace}/releases/${release_name}/0/jobs`;
});

const getJobStatus = baseApi<
  {},
  { namespace: string; cluster_id: number; release_name: string; id: number }
>("GET", (pathParams) => {
  let { id, release_name, cluster_id, namespace } = pathParams;

  return `/api/projects/${id}/clusters/${cluster_id}/namespaces/${namespace}/releases/${release_name}/0/jobs/status`;
});

const getJobPods = baseApi<
  {},
  { name: string; namespace: string; id: number; cluster_id: number }
>("GET", (pathParams) => {
  let { id, name, cluster_id, namespace } = pathParams;
  return `/api/projects/${id}/clusters/${cluster_id}/namespaces/${namespace}/jobs/${name}/pods`;
});

const getPodByName = baseApi<
  {},
  {
    project_id: number;
    cluster_id: number;
    namespace: string;
    name: string;
  }
>(
  "GET",
  ({ project_id, cluster_id, namespace, name }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/pods/${name}`
);

const getMatchingPods = baseApi<
  {
    namespace: string;
    selectors: string[];
  },
  { id: number; cluster_id: number }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.id}/clusters/${pathParams.cluster_id}/pods`;
});

const getAllReleasePods = baseApi<
  {},
  {
    id: number;
    name: string;
    namespace: string;
    cluster_id: number;
  }
>("GET", (pathParams) => {
  const { id, name, cluster_id, namespace } = pathParams;

  return `/api/projects/${id}/clusters/${cluster_id}/namespaces/${namespace}/releases/${name}/0/pods/all`;
});

const getMetrics = baseApi<
  {
    metric: string;
    shouldsum: boolean;
    pods?: string[];
    kind?: string; // the controller kind
    name?: string;
    percentile?: number;
    namespace: string;
    startrange: number;
    endrange: number;
    resolution: string;
  },
  {
    id: number;
    cluster_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.id}/clusters/${pathParams.cluster_id}/metrics`;
});

const getNamespaces = baseApi<
  {},
  {
    id: number;
    cluster_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.id}/clusters/${pathParams.cluster_id}/namespaces`;
});

const getNGINXIngresses = baseApi<
  {},
  {
    id: number;
    cluster_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.id}/clusters/${pathParams.cluster_id}/prometheus/ingresses`;
});

const getOAuthIds = baseApi<
  {},
  {
    project_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/integrations/oauth`;
});

const getProjectClusters = baseApi<{}, { id: number }>("GET", (pathParams) => {
  return `/api/projects/${pathParams.id}/clusters`;
});

const getProjectRegistries = baseApi<{}, { id: number }>(
  "GET",
  (pathParams) => {
    return `/api/projects/${pathParams.id}/registries`;
  }
);

const getProjectRepos = baseApi<{}, { id: number }>("GET", (pathParams) => {
  return `/api/projects/${pathParams.id}/repos`;
});

const getProjects = baseApi("GET", "/api/projects");

const getPrometheusIsInstalled = baseApi<
  {},
  {
    id: number;
    cluster_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.id}/clusters/${pathParams.cluster_id}/prometheus/detect`;
});

const getRegistryIntegrations = baseApi("GET", "/api/integrations/registry");

const getReleaseToken = baseApi<
  {},
  { name: string; id: number; namespace: string; cluster_id: number }
>("GET", (pathParams) => {
  let { id, cluster_id, namespace, name } = pathParams;

  return `/api/projects/${id}/clusters/${cluster_id}/namespaces/${namespace}/releases/${name}/webhook`;
});

const getReleaseSteps = baseApi<
  {},
  { name: string; id: number; namespace: string; cluster_id: number }
>("GET", (pathParams) => {
  let { id, cluster_id, namespace, name } = pathParams;

  return `/api/projects/${id}/clusters/${cluster_id}/namespaces/${namespace}/releases/${name}/steps`;
});

const destroyInfra = baseApi<
  {},
  {
    project_id: number;
    infra_id: number;
  }
>("DELETE", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/infras/${pathParams.infra_id}`;
});

const updateDatabaseStatus = baseApi<
  {
    status: string;
  },
  {
    project_id: number;
    infra_id: number;
  }
>("POST", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/infras/${pathParams.infra_id}/database`;
});

const getRepoIntegrations = baseApi("GET", "/api/integrations/repo");

const getRepos = baseApi<{}, { id: number }>("GET", (pathParams) => {
  return `/api/projects/${pathParams.id}/repos`;
});

const getSlackIntegrations = baseApi<{}, { id: number }>(
  "GET",
  (pathParams) => {
    return `/api/projects/${pathParams.id}/slack_integrations`;
  }
);

const getRevisions = baseApi<
  {},
  { id: number; cluster_id: number; namespace: string; name: string }
>("GET", (pathParams) => {
  let { id, cluster_id, namespace, name } = pathParams;

  return `/api/projects/${id}/clusters/${cluster_id}/namespaces/${namespace}/releases/${name}/history`;
});

const getTemplateInfo = baseApi<
  {
    repo_url?: string;
  },
  { project_id: number; name: string; version: string }
>("GET", (pathParams) => {
  return `/api/v1/projects/${pathParams.project_id}/templates/${pathParams.name}/versions/${pathParams.version}`;
});

const getTemplateUpgradeNotes = baseApi<
  {
    repo_url?: string;
    prev_version: string;
  },
  { project_id: number; name: string; version: string }
>("GET", (pathParams) => {
  return `/api/v1/projects/${pathParams.project_id}/templates/${pathParams.name}/versions/${pathParams.version}/upgrade_notes`;
});

const getTemplates = baseApi<
  {
    repo_url?: string;
  },
  {
    project_id: number;
  }
>("GET", (pathParams) => {
  return `/api/v1/projects/${pathParams.project_id}/templates`;
});

const getHelmRepos = baseApi<
  {},
  {
    project_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/helmrepos`;
});

const getChartsFromHelmRepo = baseApi<
  {},
  {
    project_id: number;
    helm_repo_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/helmrepos/${pathParams.helm_repo_id}/charts`;
});

const getChartInfoFromHelmRepo = baseApi<
  {},
  { project_id: number; helm_repo_id: number; name: string; version: string }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.project_id}/helmrepos/${pathParams.helm_repo_id}/charts/${pathParams.name}/${pathParams.version}`;
});

const getMetadata = baseApi<{}, {}>("GET", () => {
  return `/api/metadata`;
});

const postWelcome = baseApi<{
  email: string;
  isCompany: boolean;
  name: string;
  company: string;
  role: string;
}>("POST", () => {
  return `/api/welcome`;
});

const linkGithubProject = baseApi<
  {},
  {
    project_id: number;
  }
>("GET", (pathParams) => {
  return `/api/oauth/projects/${pathParams.project_id}/github`;
});

const getGithubAccounts = baseApi<{}, {}>("GET", () => {
  return `/api/integrations/github-app/accounts`;
});

const logInUser = baseApi<{
  email: string;
  password: string;
}>("POST", "/api/login");

const logOutUser = baseApi("POST", "/api/logout");

const registerUser = baseApi<{
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  company_name: string;
}>("POST", "/api/users");

const rollbackChart = baseApi<
  {
    revision: number;
  },
  {
    id: number;
    name: string;
    namespace: string;
    cluster_id: number;
  }
>("POST", (pathParams) => {
  let { id, name, cluster_id, namespace } = pathParams;
  return `/api/projects/${id}/clusters/${cluster_id}/namespaces/${namespace}/releases/${name}/0/rollback`;
});

const uninstallTemplate = baseApi<
  {},
  {
    id: number;
    name: string;
    cluster_id: number;
    namespace: string;
  }
>("DELETE", (pathParams) => {
  let { id, name, cluster_id, namespace } = pathParams;
  return `/api/projects/${id}/clusters/${cluster_id}/namespaces/${namespace}/releases/${name}/0`;
});

const updateUserInfo = baseApi<
  {
    first_name: string;
    last_name: string;
    company_name: string;
  },
  {}
>("POST", (pathParams) => {
  return `/api/users/update/info`;
});

const updateUser = baseApi<
  {
    rawKubeConfig?: string;
    allowedContexts?: string[];
  },
  { id: number }
>("PUT", (pathParams) => {
  return `/api/users/${pathParams.id}`;
});

const upgradeChartValues = baseApi<
  {
    values: string;
    version?: string;
    latest_revision?: number;
  },
  {
    id: number;
    name: string;
    namespace: string;
    cluster_id: number;
  }
>("POST", (pathParams) => {
  let { id, name, cluster_id, namespace } = pathParams;
  return `/api/projects/${id}/clusters/${cluster_id}/namespaces/${namespace}/releases/${name}/0/upgrade`;
});

const listEnvGroups = baseApi<
  {},
  {
    id: number;
    namespace: string;
    cluster_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.id}/clusters/${pathParams.cluster_id}/namespaces/${pathParams.namespace}/envgroup/list`;
});

const listConfigMaps = baseApi<
  {},
  {
    id: number;
    namespace: string;
    cluster_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.id}/clusters/${pathParams.cluster_id}/namespaces/${pathParams.namespace}/configmap/list`;
});

const getEnvGroup = baseApi<
  {},
  {
    id: number;
    namespace: string;
    cluster_id: number;
    name: string;
    version?: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.id}/clusters/${pathParams.cluster_id
    }/namespaces/${pathParams.namespace}/envgroup?name=${pathParams.name}${pathParams.version ? "&version=" + pathParams.version : ""
    }`;
});

const getConfigMap = baseApi<
  {
    name: string;
  },
  {
    id: number;
    namespace: string;
    cluster_id: number;
  }
>("GET", (pathParams) => {
  return `/api/projects/${pathParams.id}/clusters/${pathParams.cluster_id}/namespaces/${pathParams.namespace}/configmap`;
});

const createEnvGroup = baseApi<
  {
    name: string;
    variables: Record<string, string>;
    secret_variables?: Record<string, string>;
  },
  {
    id: number;
    cluster_id: number;
    namespace: string;
  }
>("POST", (pathParams) => {
  return `/api/projects/${pathParams.id}/clusters/${pathParams.cluster_id}/namespaces/${pathParams.namespace}/envgroup/create`;
});

const cloneEnvGroup = baseApi<
  {
    name: string;
    namespace: string;
    clone_name: string;
    version: number;
  },
  {
    id: number;
    namespace: string;
    cluster_id: number;
  }
>("POST", (pathParams) => {
  return `/api/projects/${pathParams.id}/clusters/${pathParams.cluster_id}/namespaces/${pathParams.namespace}/envgroup/clone`;
});

const updateEnvGroup = baseApi<
  {
    name: string;
    variables: { [key: string]: string };
    secret_variables?: { [key: string]: string };
  },
  {
    project_id: number;
    cluster_id: number;
    namespace: string;
  }
>(
  "POST",
  ({ cluster_id, project_id, namespace }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/envgroup/create`
);

const createConfigMap = baseApi<
  {
    name: string;
    variables: Record<string, string>;
    secret_variables?: Record<string, string>;
  },
  {
    id: number;
    cluster_id: number;
    namespace: string;
  }
>("POST", (pathParams) => {
  return `/api/projects/${pathParams.id}/clusters/${pathParams.cluster_id}/namespaces/${pathParams.namespace}/configmap/create`;
});

const updateConfigMap = baseApi<
  {
    name: string;
    variables: Record<string, string>;
    secret_variables?: Record<string, string>;
  },
  {
    id: number;
    cluster_id: number;
    namespace: string;
  }
>("POST", (pathParams) => {
  let { id, cluster_id } = pathParams;
  return `/api/projects/${pathParams.id}/clusters/${pathParams.cluster_id}/namespaces/${pathParams.namespace}/configmap/update`;
});

const renameConfigMap = baseApi<
  {
    name: string;
    new_name: string;
  },
  {
    id: number;
    cluster_id: number;
    namespace: string;
  }
>("POST", (pathParams) => {
  return `/api/projects/${pathParams.id}/clusters/${pathParams.cluster_id}/namespaces/${pathParams.namespace}/configmap/rename`;
});

const deleteEnvGroup = baseApi<
  {
    name: string;
  },
  {
    id: number;
    namespace: string;
    cluster_id: number;
  }
>("DELETE", (pathParams) => {
  return `/api/projects/${pathParams.id}/clusters/${pathParams.cluster_id}/namespaces/${pathParams.namespace}/envgroup`;
});

const deleteConfigMap = baseApi<
  {
    name: string;
  },
  {
    id: number;
    namespace: string;
    cluster_id: number;
  }
>("DELETE", (pathParams) => {
  return `/api/projects/${pathParams.id}/clusters/${pathParams.cluster_id}/namespaces/${pathParams.namespace}/configmap/delete`;
});

const createNamespace = baseApi<
  {
    name: string;
  },
  { id: number; cluster_id: number }
>("POST", (pathParams) => {
  let { id, cluster_id } = pathParams;
  return `/api/projects/${id}/clusters/${cluster_id}/namespaces/create`;
});

const deleteNamespace = baseApi<
  {},
  {
    id: number;
    cluster_id: number;
    namespace: string;
  }
>("DELETE", (pathParams) => {
  let { id, cluster_id, namespace } = pathParams;
  return `/api/projects/${id}/clusters/${cluster_id}/namespaces/${namespace}`;
});

const deleteJob = baseApi<
  {},
  { name: string; namespace: string; id: number; cluster_id: number }
>("DELETE", (pathParams) => {
  let { id, name, cluster_id, namespace } = pathParams;
  return `/api/projects/${id}/clusters/${cluster_id}/namespaces/${namespace}/jobs/${name}`;
});

const stopJob = baseApi<
  {},
  { name: string; namespace: string; id: number; cluster_id: number }
>("POST", (pathParams) => {
  let { id, name, namespace, cluster_id } = pathParams;
  return `/api/projects/${id}/clusters/${cluster_id}/namespaces/${namespace}/jobs/${name}/stop`;
});

const listAPITokens = baseApi<{}, { project_id: number }>(
  "GET",
  ({ project_id }) => `/api/projects/${project_id}/api_token`
);

const getAPIToken = baseApi<{}, { project_id: number; token: string }>(
  "GET",
  ({ project_id, token }) => `/api/projects/${project_id}/api_token/${token}`
);

const revokeAPIToken = baseApi<{}, { project_id: number; token: string }>(
  "POST",
  ({ project_id, token }) =>
    `/api/projects/${project_id}/api_token/${token}/revoke`
);

const createAPIToken = baseApi<
  {
    name: string;
    policy_uid: string;
    expires_at?: string;
  },
  { project_id: number }
>("POST", ({ project_id }) => `/api/projects/${project_id}/api_token`);

const createPolicy = baseApi<
  {
    name: string;
    policy: PolicyDocType[];
  },
  { project_id: number }
>("POST", ({ project_id }) => `/api/projects/${project_id}/policy`);

const getAvailableRoles = baseApi<{}, { project_id: number }>(
  "GET",
  ({ project_id }) => `/api/projects/${project_id}/roles`
);

const updateInvite = baseApi<
  { kind: string },
  { project_id: number; invite_id: number }
>(
  "POST",
  ({ project_id, invite_id }) =>
    `/api/projects/${project_id}/invites/${invite_id}`
);

const getCollaborators = baseApi<{}, { project_id: number }>(
  "GET",
  ({ project_id }) => `/api/projects/${project_id}/collaborators`
);

const updateCollaborator = baseApi<
  {
    kind: string;
    user_id: number;
  },
  { project_id: number }
>("POST", ({ project_id }) => `/api/projects/${project_id}/roles`);

const removeCollaborator = baseApi<{ user_id: number }, { project_id: number }>(
  "DELETE",
  ({ project_id }) => `/api/projects/${project_id}/roles`
);

const getPolicyDocument = baseApi<{}, { project_id: number }>(
  "GET",
  ({ project_id }) => `/api/projects/${project_id}/policy`
);

const createWebhookToken = baseApi<
  {},
  {
    project_id: number;
    chart_name: string;
    namespace: string;
    cluster_id: number;
  }
>(
  "POST",
  ({ project_id, chart_name, namespace, cluster_id }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/releases/${chart_name}/0/webhook`
);

const getUsage = baseApi<{}, { project_id: number }>(
  "GET",
  ({ project_id }) => `/api/projects/${project_id}/usage`
);

// Used for billing purposes
const getCustomerToken = baseApi<{}, { project_id: number }>(
  "GET",
  ({ project_id }) => `/api/projects/${project_id}/billing/token`
);

const getHasBilling = baseApi<{}, { project_id: number }>(
  "GET",
  ({ project_id }) => `/api/projects/${project_id}/billing`
);

const getOnboardingState = baseApi<{}, { project_id: number }>(
  "GET",
  ({ project_id }) => `/api/projects/${project_id}/onboarding`
);

const saveOnboardingState = baseApi<{}, { project_id: number }>(
  "POST",
  ({ project_id }) => `/api/projects/${project_id}/onboarding`
);

const getOnboardingInfra = baseApi<
  {},
  { project_id: number; registry_infra_id: number }
>(
  "GET",
  ({ project_id, registry_infra_id }) =>
    `/api/projects/${project_id}/infras/${registry_infra_id}`
);

const getOnboardingRegistry = baseApi<
  {},
  { project_id: number; registry_connection_id: number }
>(
  "GET",
  ({ project_id, registry_connection_id }) =>
    `/api/projects/${project_id}/registries/${registry_connection_id}`
);

const detectPorterAgent = baseApi<
  {},
  { project_id: number; cluster_id: number }
>(
  "GET",
  ({ project_id, cluster_id }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/agent/detect`
);

const installPorterAgent = baseApi<
  {},
  { project_id: number; cluster_id: number }
>(
  "POST",
  ({ cluster_id, project_id }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/agent/install`
);

const getKubeEvents = baseApi<
  {
    skip: number;
    resource_type: string;
    owner_type?: string;
    owner_name?: string;
    namespace?: string;
  },
  { project_id: number; cluster_id: number }
>("GET", ({ project_id, cluster_id }) => {
  return `/api/projects/${project_id}/clusters/${cluster_id}/kube_events`;
});

const getKubeEvent = baseApi<
  {},
  { project_id: number; cluster_id: number; kube_event_id: number }
>(
  "GET",
  ({ project_id, cluster_id, kube_event_id }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/kube_events/${kube_event_id}`
);

const getLogBuckets = baseApi<
  {},
  { project_id: number; cluster_id: number; kube_event_id: number }
>(
  "GET",
  ({ project_id, cluster_id, kube_event_id }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/kube_events/${kube_event_id}/log_buckets`
);

const getLogBucketLogs = baseApi<
  { timestamp: number },
  { project_id: number; cluster_id: number; kube_event_id: number }
>(
  "GET",
  ({ project_id, cluster_id, kube_event_id }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/kube_events/${kube_event_id}/logs`
);

const getCanCreateProject = baseApi<{}, {}>(
  "GET",
  () => "/api/can_create_project"
);

const addApplicationToEnvGroup = baseApi<
  {
    name: string; // Env Group name
    app_name: string;
  },
  { project_id: number; cluster_id: number; namespace: string }
>(
  "POST",
  ({ cluster_id, namespace, project_id }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/envgroup/add_application`
);

const removeApplicationFromEnvGroup = baseApi<
  {
    name: string; // Env Group name
    app_name: string;
  },
  { project_id: number; cluster_id: number; namespace: string }
>(
  "POST",
  ({ cluster_id, namespace, project_id }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/envgroup/remove_application`
);

const provisionDatabase = baseApi<
  {
    username: string;
    password: string;
    machine_type: string;
    db_storage_encrypted: boolean;
    db_name: string;
    db_max_allocated_storage: string;
    db_family: string;
    db_engine_version: string;
    db_allocated_storage: string;
  },
  { project_id: number; cluster_id: number; namespace: string }
>(
  "POST",
  ({ project_id, cluster_id, namespace }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/provision/rds`
);

const getDatabases = baseApi<
  {},
  {
    project_id: number;
    cluster_id: number;
  }
>(
  "GET",
  ({ project_id, cluster_id }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/databases`
);
const getPreviousLogsForContainer = baseApi<
  {
    container_name: string;
  },
  {
    project_id: number;
    cluster_id: number;
    namespace: string;
    pod_name: string;
  }
>(
  "GET",
  ({ cluster_id, namespace, pod_name: name, project_id }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/pod/${name}/previous_logs`
);

const upgradePorterAgent = baseApi<
  {},
  { project_id: number; cluster_id: number }
>(
  "POST",
  ({ project_id, cluster_id }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/agent/upgrade`
);

const updateBuildConfig = baseApi<
  BuildConfig,
  {
    project_id: number;
    cluster_id: number;
    namespace: string;
    release_name: string;
  }
>(
  "POST",
  ({ project_id, cluster_id, namespace, release_name }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/releases/${release_name}/buildconfig`
);

const updateGitActionConfig = baseApi<
  {
    git_action_config: {
      git_branch: string;
    };
  },
  {
    project_id: number;
    cluster_id: number;
    namespace: string;
    release_name: string;
    revision?: 0; // Always update latest
  }
>(
  "PATCH",
  ({ project_id, cluster_id, namespace, release_name, revision = 0 }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/releases/${release_name}/${revision}/git_action_config`
);

const reRunGHWorkflow = baseApi<
  {},
  {
    project_id: number;
    cluster_id: number;
    git_installation_id: number;
    owner: string;
    name: string;
    branch?: string;
    filename?: string;
    release_name?: string;
  }
>(
  "POST",
  ({
    project_id,
    git_installation_id,
    owner,
    name,
    cluster_id,
    filename,
    release_name,
    branch,
  }) => {
    const queryParams = new URLSearchParams();

    if (branch) {
      queryParams.set("branch", branch);
    }

    if (release_name) {
      queryParams.set("release_name", release_name);
    }
    if (filename) {
      queryParams.set("filename", filename);
    }

    return `/api/projects/${project_id}/gitrepos/${git_installation_id}/${owner}/${name}/clusters/${cluster_id}/rerun_workflow?${queryParams.toString()}`;
  }
);

const triggerPreviewEnvWorkflow = baseApi<
  {},
  { project_id: number; cluster_id: number; deployment_id: number }
>(
  "POST",
  ({ project_id, cluster_id, deployment_id }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/deployments/${deployment_id}/trigger_workflow`
);

const getTagsByProjectId = baseApi<{}, { project_id: number }>(
  "GET",
  ({ project_id }) => `/api/projects/${project_id}/tags`
);

const createTag = baseApi<
  { name: string; color: string },
  { project_id: number }
>("POST", ({ project_id }) => `/api/projects/${project_id}/tags`);

const updateReleaseTags = baseApi<
  {
    tags: string[];
  },
  {
    project_id: number;
    cluster_id: number;
    namespace: string;
    release_name: string;
  }
>(
  "PATCH",
  ({ project_id, cluster_id, namespace, release_name }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/releases/${release_name}/0/update_tags`
);

const updateCanonicalName = baseApi<
  {
    canonical_name: string;
  },
  {
    project_id: number;
    cluster_id: number;
    namespace: string;
    release_name: string;
  }
>(
  "PATCH",
  ({ project_id, cluster_id, namespace, release_name }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/releases/${release_name}/0/update_canonical_name`
);

const getGitProviders = baseApi<{}, { project_id: number }>(
  "GET",
  ({ project_id }) => `/api/projects/${project_id}/integrations/git`
);

const getGitlabRepos = baseApi<
  {},
  { project_id: number; integration_id: number }
>(
  "GET",
  ({ project_id, integration_id }) =>
    `/api/projects/${project_id}/integrations/gitlab/${integration_id}/repos`
);

const getGitlabBranches = baseApi<
  {},
  {
    project_id: number;
    integration_id: number;
    repo_owner: string;
    repo_name: string;
  }
>(
  "GET",
  ({ project_id, integration_id, repo_owner, repo_name }) =>
    `/api/projects/${project_id}/integrations/gitlab/${integration_id}/repos/${repo_owner}/${repo_name}/branches`
);

const getGitlabFolderContent = baseApi<
  {
    dir: string;
  },
  {
    project_id: number;
    integration_id: number;
    repo_owner: string;
    repo_name: string;
    branch: string;
  }
>(
  "GET",
  ({ project_id, integration_id, repo_owner, repo_name, branch }) =>
    `/api/projects/${project_id}/integrations/gitlab/${integration_id}/repos/${repo_owner}/${repo_name}/${branch}/contents`
);

const getLogPodValues = baseApi<
  {
    namespace?: string;
    revision?: string;
    match_prefix?: string;
    start_range?: string;
    end_range?: string;
  },
  {
    project_id: number;
    cluster_id: number;
  }
>(
  "GET",
  ({ project_id, cluster_id }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/logs/pod_values`
);

const getLogs = baseApi<
  {
    limit?: number;
    start_range?: string;
    end_range?: string;
    revision?: string;
    pod_selector: string;
    namespace?: string;
    search_param?: string;
    direction?: string;
  },
  {
    project_id: number;
    cluster_id: number;
  }
>(
  "GET",
  ({ project_id, cluster_id }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/logs`
);

const listPorterEvents = baseApi<
  {
    release_name?: number;
    release_namespace?: string;
    type?: string;
  },
  {
    project_id: number;
    cluster_id: number;
  }
>(
  "GET",
  ({ project_id, cluster_id }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/events`
);

const listPorterJobEvents = baseApi<
  {
    release_name?: number;
    release_namespace?: string;
    type?: string;
    job_name: string;
  },
  {
    project_id: number;
    cluster_id: number;
  }
>(
  "GET",
  ({ project_id, cluster_id }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/events/job`
);

const listIncidents = baseApi<
  {
    release_name?: number;
    release_namespace?: string;
    status?: string;
  },
  {
    project_id: number;
    cluster_id: number;
  }
>(
  "GET",
  ({ project_id, cluster_id }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/incidents`
);

const getIncident = baseApi<
  {},
  {
    project_id: number;
    cluster_id: number;
    incident_id: string;
  }
>(
  "GET",
  ({ project_id, cluster_id, incident_id }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/incidents/${incident_id}`
);

const getIncidentEvents = baseApi<
  {
    incident_id?: string;
    pod_prefix?: string;
  },
  {
    project_id: number;
    cluster_id: number;
  }
>(
  "GET",
  ({ project_id, cluster_id }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/incidents/events`
);

// TRACKING

const updateOnboardingStep = baseApi<
  {
    step: string;
  },
  {}
>("POST", (pathParams) => {
  return `/api/onboarding_step`;
});

const updateStackStep = baseApi<
  {
    step: string;
    stack_name?: string;
  },
  {
    project_id: number;
    cluster_id: number;
  }
>("POST", (pathParams) => {
  let { project_id, cluster_id } = pathParams;
  return `/api/projects/${project_id}/clusters/${cluster_id}/stacks/analytics`;
});

// STACKS

const createStack = baseApi<
  CreateStackBody,
  {
    project_id: number;
    cluster_id: number;
    namespace: string;
  }
>(
  "POST",
  ({ project_id, cluster_id, namespace }) =>
    `/api/v1/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/stacks`
);

const updateStack = baseApi<
  {
    name: string;
  },
  {
    project_id: number;
    cluster_id: number;
    namespace: string;
    stack_id: string;
  }
>(
  "PATCH",
  ({ project_id, cluster_id, namespace, stack_id }) =>
    `/api/v1/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/stacks/${stack_id}`
);

const listStacks = baseApi<
  {},
  { project_id: number; cluster_id: number; namespace: string }
>(
  "GET",
  ({ project_id, cluster_id, namespace }) =>
    `/api/v1/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/stacks`
);

const getStack = baseApi<
  {},
  {
    project_id: number;
    cluster_id: number;
    namespace: string;
    stack_id: string;
  }
>(
  "GET",
  ({ project_id, cluster_id, namespace, stack_id }) =>
    `/api/v1/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/stacks/${stack_id}`
);

const getStackRevision = baseApi<
  {},
  {
    project_id: number;
    cluster_id: number;
    namespace: string;
    stack_id: string;
    revision_id: number;
  }
>(
  "GET",
  ({ project_id, cluster_id, namespace, stack_id, revision_id }) =>
    `/api/v1/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/stacks/${stack_id}/${revision_id}`
);

const rollbackStack = baseApi<
  {
    target_revision: number;
  },
  {
    project_id: number;
    cluster_id: number;
    namespace: string;
    stack_id: string;
  }
>(
  "POST",
  ({ project_id, cluster_id, namespace, stack_id }) =>
    `/api/v1/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/stacks/${stack_id}/rollback`
);

const deleteStack = baseApi<
  {},
  {
    project_id: number;
    cluster_id: number;
    namespace: string;
    stack_id: string;
  }
>(
  "DELETE",
  ({ project_id, cluster_id, namespace, stack_id }) =>
    `/api/v1/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/stacks/${stack_id}`
);

const updateStackSourceConfig = baseApi<
  {
    source_configs: SourceConfig[];
  },
  {
    project_id: number;
    cluster_id: number;
    namespace: string;
    stack_id: string;
  }
>(
  "PUT",
  ({ project_id, cluster_id, namespace, stack_id }) =>
    `/api/v1/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/stacks/${stack_id}/source`
);

const addStackAppResource = baseApi<
  CreateStackBody["app_resources"][0],
  {
    project_id: number;
    cluster_id: number;
    namespace: string;
    stack_id: string;
  }
>(
  "PATCH",
  ({ project_id, cluster_id, namespace, stack_id }) =>
    `/api/v1/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/stacks/${stack_id}/add_application`
);

const removeStackAppResource = baseApi<
  {},
  {
    project_id: number;
    cluster_id: number;
    namespace: string;
    stack_id: string;
    app_resource_name: string;
  }
>(
  "DELETE",
  ({ project_id, cluster_id, namespace, stack_id, app_resource_name }) =>
    `/api/v1/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/stacks/${stack_id}/remove_application/${app_resource_name}`
);

const addStackEnvGroup = baseApi<
  CreateStackBody["env_groups"][0],
  {
    project_id: number;
    cluster_id: number;
    namespace: string;
    stack_id: string;
  }
>(
  "PATCH",
  ({ project_id, cluster_id, namespace, stack_id }) =>
    `/api/v1/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/stacks/${stack_id}/add_env_group`
);

const removeStackEnvGroup = baseApi<
  {},
  {
    project_id: number;
    cluster_id: number;
    namespace: string;
    stack_id: string;
    env_group_name: string;
  }
>(
  "DELETE",
  ({ project_id, cluster_id, namespace, stack_id, env_group_name }) =>
    `/api/v1/projects/${project_id}/clusters/${cluster_id}/namespaces/${namespace}/stacks/${stack_id}/remove_env_group/${env_group_name}`
);

const getGithubStatus = baseApi<{}, {}>("GET", ({ }) => `/api/status/github`);

const createSecretAndOpenGitHubPullRequest = baseApi<
  {
    github_app_installation_id: number;
    github_repo_owner: string;
    github_repo_name: string;
    open_pr: boolean;
    branch: string;
  },
  {
    project_id: number;
    cluster_id: number;
    stack_name: string;
  }
>(
  "POST",
  ({ project_id, cluster_id, stack_name }) =>
    `/api/projects/${project_id}/clusters/${cluster_id}/stacks/${stack_name}/pr`
);

// Bundle export to allow default api import (api.<method> is more readable)
export default {
  checkAuth,
  connectECRRegistry,
  connectGCRRegistry,
  connectDORegistry,
  getAWSIntegration,
  getGCPIntegration,
  getAzureIntegration,
  getGitlabIntegration,
  createAWSIntegration,
  overwriteAWSIntegration,
  updateCluster,
  renameCluster,
  createAzureIntegration,
  createGitlabIntegration,
  createEmailVerification,
  createEnvironment,
  updateEnvironment,
  deleteEnvironment,
  createPreviewEnvironmentDeployment,
  reenablePreviewEnvironmentDeployment,
  listEnvironments,
  getEnvironment,
  toggleNewCommentForEnvironment,
  validatePorterYAML,
  createGCPIntegration,
  createInvite,
  createNamespace,
  createPasswordReset,
  createPasswordResetVerify,
  createPasswordResetFinalize,
  createProject,
  getPorterApps,
  getPorterApp,
  createPorterApp,
  deletePorterApp,
  createConfigMap,
  deleteCluster,
  deleteConfigMap,
  deleteInvite,
  deleteNamespace,
  deletePod,
  deleteProject,
  deleteRegistryIntegration,
  deleteSlackIntegration,
  updateNotificationConfig,
  getNotificationConfig,
  createSubdomain,
  deployTemplate,
  deployAddon,
  destroyInfra,
  updateDatabaseStatus,
  detectBuildpack,
  detectGitlabBuildpack,
  getBranchContents,
  getBranches,
  getMetadata,
  postWelcome,
  getChart,
  getCharts,
  getChartComponents,
  getChartControllers,
  getClusterIntegrations,
  getClusters,
  getCluster,
  getClusterNodes,
  getClusterNode,
  getClusterStatus,
  getConfigMap,
  getPRDeploymentList,
  getPRDeploymentByID,
  getGHAWorkflowTemplate,
  getGitRepoList,
  getGitRepoPermission,
  getGitRepos,
  getImageRepos,
  getImageTags,
  listInfraTemplates,
  getInfraTemplate,
  getInfra,
  provisionCluster,
  provisionInfra,
  deleteInfra,
  updateInfra,
  listOperations,
  getOperation,
  getOperationLogs,
  retryCreateInfra,
  retryDeleteInfra,
  getInfraState,
  getInfraRawState,
  getInfraByID,
  getInfraDesired,
  getInfraCurrent,
  getIngress,
  getInvites,
  getJobs,
  getJobStatus,
  getJobPods,
  getPodByName,
  getMatchingPods,
  getAllReleasePods,
  getClusterState,
  getMetrics,
  getNamespaces,
  getNGINXIngresses,
  getOAuthIds,
  getPodEvents,
  getProcfileContents,
  getPorterYamlContents,
  getGitlabProcfileContents,
  getProjectClusters,
  getProjectRegistries,
  getProjectRepos,
  getProjects,
  getPrometheusIsInstalled,
  getRegistryIntegrations,
  getReleaseToken,
  getReleaseSteps,
  getRepoIntegrations,
  getSlackIntegrations,
  getRepos,
  getRevisions,
  getTemplateInfo,
  getTemplateUpgradeNotes,
  getTemplates,
  getHelmRepos,
  getChartsFromHelmRepo,
  getChartInfoFromHelmRepo,
  linkGithubProject,
  inviteAdmin,
  getGithubAccounts,
  listConfigMaps,
  logInUser,
  logOutUser,
  registerUser,
  rollbackChart,
  uninstallTemplate,
  updateUserInfo,
  updateUser,
  renameConfigMap,
  updateConfigMap,
  upgradeChartValues,
  deleteJob,
  stopJob,
  updateInvite,
  listAPITokens,
  getAPIToken,
  revokeAPIToken,
  createAPIToken,
  createPolicy,
  getAvailableRoles,
  getCollaborators,
  updateCollaborator,
  removeCollaborator,
  getPolicyDocument,
  createWebhookToken,
  getUsage,
  getCustomerToken,
  getHasBilling,
  getOnboardingState,
  saveOnboardingState,
  getOnboardingInfra,
  getOnboardingRegistry,
  detectPorterAgent,
  installPorterAgent,
  getKubeEvents,
  getKubeEvent,
  getLogBuckets,
  getLogBucketLogs,
  getCanCreateProject,
  createEnvGroup,
  cloneEnvGroup,
  updateEnvGroup,
  listEnvGroups,
  getEnvGroup,
  deleteEnvGroup,
  addApplicationToEnvGroup,
  removeApplicationFromEnvGroup,
  provisionDatabase,
  preflightCheckAWSUsage,
  getDatabases,
  getPreviousLogsForContainer,
  upgradePorterAgent,
  deletePRDeployment,
  updateBuildConfig,
  updateGitActionConfig,
  reRunGHWorkflow,
  triggerPreviewEnvWorkflow,
  getTagsByProjectId,
  createTag,
  updateReleaseTags,
  updateCanonicalName,
  getGitProviders,
  getGitlabRepos,
  getGitlabBranches,
  getGitlabFolderContent,
  getLogPodValues,
  getLogs,
  listPorterEvents,
  listPorterJobEvents,
  listIncidents,
  getIncident,
  getIncidentEvents,
  createContract,
  getContracts,
  deleteContract,
  createSecretAndOpenGitHubPullRequest,
  // TRACKING
  updateOnboardingStep,
  updateStackStep,
  // STACKS
  listStacks,
  getStack,
  getStackRevision,
  createStack,
  updateStack,
  rollbackStack,
  deleteStack,
  updateStackSourceConfig,
  addStackAppResource,
  removeStackAppResource,
  addStackEnvGroup,
  removeStackEnvGroup,

  // STATUS
  getGithubStatus,
};
