package cmd

import (
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"strings"

	api "github.com/porter-dev/porter/api/client"
	"github.com/porter-dev/porter/api/types"
	"github.com/spf13/cobra"
)

var diffRevisionsCmd = &cobra.Command{
	Use:   "view-diff",
	Short: "See the Diff Between two revisions of an application porter. Invoke via view-diff <release-name> <source-revision.no> <changed-revision.no>",
	Args:  cobra.ExactArgs(3),
	Run: func(cmd *cobra.Command, args []string) {
		err := checkLoginAndRun(args, compareDiff)

		if err != nil {
			os.Exit(1)
		}
	},
}

func init() {
	rootCmd.AddCommand(diffRevisionsCmd)
}

func compareDiff(_ *types.GetAuthenticatedUserResponse, client *api.Client, args []string) error {

	_, err := exec.LookPath("helm")
	if err != nil {
		return fmt.Errorf("helm binary not found: %w", err)
	}

	// Get the release name and revisions from the command arguments
	releaseName := args[0]
	sourceRevision := args[1]
	changedRevision := args[2]

	// Get the values for the base and changed revisions
	sourceValues, err := getRevisionValues(releaseName, sourceRevision)
	if err != nil {
		return fmt.Errorf("error getting values for source revision: %w", err)
	}

	changedValues, err := getRevisionValues(releaseName, changedRevision)
	if err != nil {
		return fmt.Errorf("error getting values for changed revision: %w", err)
	}

	fmt.Printf("Comparing revisions for release %s:\n", releaseName)
	fmt.Printf("  Source revision: %s\n", sourceRevision)
	fmt.Printf("  Changed revision: %s\n", changedRevision)
	// Use colordiff if available, otherwise use git diff
	var cmd *exec.Cmd

	_, err = exec.LookPath("colordiff")
	if err == nil {
		fmt.Println("Using colordiff...")
		sourceFile, err := ioutil.TempFile("", "source-values-*.yaml")
		if err != nil {
			return fmt.Errorf("failed to create temporary file: %w", err)
		}
		defer os.Remove(sourceFile.Name())
		if _, err := sourceFile.Write(sourceValues); err != nil {
			return fmt.Errorf("failed to write to temporary file: %w", err)
		}

		changedFile, err := ioutil.TempFile("", "changed-values-*.yaml")
		if err != nil {
			return fmt.Errorf("failed to create temporary file: %w", err)
		}
		defer os.Remove(changedFile.Name())

		if _, err := changedFile.Write(changedValues); err != nil {
			return fmt.Errorf("failed to write to temporary file: %w", err)
		}

		cmd = exec.Command("colordiff", "-u", sourceFile.Name(), changedFile.Name())
	} else {
		fmt.Println("colordiff not found, falling back to git diff...")
		cmd = exec.Command("git", "diff", "--no-index", "--color=always", "--no-ext-diff", "-u", "/dev/null", "-")
		cmd.Stdin = strings.NewReader(fmt.Sprintf("%s\n%s\n", sourceValues, changedValues))
	}

	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		if exitError, ok := err.(*exec.ExitError); ok {
			if exitError.ExitCode() != 1 {
				return fmt.Errorf("diff command failed: %w", err)
			}
		} else {
			return fmt.Errorf("diff command failed: %w", err)
		}
	}

	return nil
}

func getRevisionValues(releaseName string, revision string) ([]byte, error) {
	// Use Helm command to get values for the specified revision
	out, err := exec.Command("helm", "get", "values", releaseName, "--revision", revision).Output()
	//cmd := exec.Command("helm", "get", "values", releaseName, "--revision", revision)
	//outputFile, err2 := cmd.CombinedOutput()
	if err != nil {
		return nil, fmt.Errorf("failed to get values for revision %s: %w", revision, err)
	}
	// else if err2 == nil {
	// 	fmt.Println(string(outputFile))
	// }
	return out, nil
}
