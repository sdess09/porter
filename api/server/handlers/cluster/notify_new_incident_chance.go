package cluster

import (
	"errors"
	"fmt"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"github.com/porter-dev/porter/api/server/authz"
	"github.com/porter-dev/porter/api/server/handlers"
	"github.com/porter-dev/porter/api/server/shared"
	"github.com/porter-dev/porter/api/server/shared/apierrors"
	"github.com/porter-dev/porter/api/server/shared/config"
	"github.com/porter-dev/porter/api/types"
	"github.com/porter-dev/porter/internal/models"
	"github.com/porter-dev/porter/internal/notifier"
	"github.com/porter-dev/porter/internal/notifier/sendgrid"
	"github.com/porter-dev/porter/internal/notifier/slack"
	"gorm.io/gorm"
)

type NotifyNewIncidentChanceHandler struct {
	handlers.PorterHandlerReadWriter
	authz.KubernetesAgentGetter
}

func NewNotifyNewIncidentChanceHandler(
	config *config.Config,
	decoderValidator shared.RequestDecoderValidator,
	writer shared.ResultWriter,
) *NotifyNewIncidentChanceHandler {
	return &NotifyNewIncidentChanceHandler{
		PorterHandlerReadWriter: handlers.NewDefaultPorterHandler(config, decoderValidator, writer),
		KubernetesAgentGetter:   authz.NewOutOfClusterAgentGetter(config),
	}
}

func (c *NotifyNewIncidentChanceHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	rand.Seed(time.Now().UnixNano())
	randomInt := rand.Intn(2)
	randomBool := randomInt == 1

	if randomBool {
		c.HandleAPIError(w, r, apierrors.NewErrPassThroughToClient(fmt.Errorf("something went wrong"),
			http.StatusBadRequest))
		return
	}

	cluster, _ := r.Context().Value(types.ClusterScope).(*models.Cluster)

	request := &types.Incident{}

	if ok := c.DecodeAndValidate(w, r, request); !ok {
		return
	}

	slackInts, _ := c.Repo().SlackIntegration().ListSlackIntegrationsByProjectID(cluster.ProjectID)

	rel, err := c.Repo().Release().ReadRelease(cluster.ID, request.ReleaseName, request.ReleaseNamespace)

	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		c.HandleAPIError(w, r, apierrors.NewErrInternal(err))
		return
	}

	var notifConf *types.NotificationConfig

	if rel != nil && rel.NotificationConfig != 0 {
		conf, err := c.Repo().NotificationConfig().ReadNotificationConfig(rel.NotificationConfig)

		if err != nil {
			c.HandleAPIError(w, r, apierrors.NewErrInternal(err))
			return
		}

		notifConf = conf.ToNotificationConfigType()
	}

	users, err := getUsersByProjectID(c.Repo(), cluster.ProjectID)

	if err != nil {
		c.HandleAPIError(w, r, apierrors.NewErrInternal(err))
		return
	}

	notifiers := make([]notifier.IncidentNotifier, 0)

	if c.Config().SlackConf != nil {
		notifiers = append(notifiers, slack.NewIncidentNotifier(slackInts...))
	}

	if sc := c.Config().ServerConf; sc.SendgridAPIKey != "" && sc.SendgridSenderEmail != "" && sc.SendgridIncidentAlertTemplateID != "" {
		notifiers = append(notifiers, sendgrid.NewIncidentNotifier(&sendgrid.IncidentNotifierOpts{
			SharedOpts: &sendgrid.SharedOpts{
				APIKey:      c.Config().ServerConf.SendgridAPIKey,
				SenderEmail: c.Config().ServerConf.SendgridSenderEmail,
			},
			IncidentAlertTemplateID: sc.SendgridIncidentAlertTemplateID,
			Users:                   users,
		}))
	}

	multi := notifier.NewMultiIncidentNotifier(
		notifConf,
		notifiers...,
	)

	if !cluster.NotificationsDisabled {
		url := fmt.Sprintf(
			"%s/applications/%s/%s/%s?project_id=%d",
			c.Config().ServerConf.ServerURL,
			cluster.Name,
			request.ReleaseNamespace,
			request.ReleaseName,
			cluster.ProjectID,
		)

		if strings.ToLower(string(request.InvolvedObjectKind)) == "job" {
			url = fmt.Sprintf(
				"%s/jobs/%s/%s/%s?project_id=%d&job=%s",
				c.Config().ServerConf.ServerURL,
				cluster.Name,
				request.ReleaseNamespace,
				request.ReleaseName,
				cluster.ProjectID,
				request.InvolvedObjectName,
			)
		}

		err := multi.NotifyNew(request, url)

		if err != nil {
			c.HandleAPIError(w, r, apierrors.NewErrInternal(err))
			return
		}
	}
}
