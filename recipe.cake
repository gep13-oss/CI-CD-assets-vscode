#load nuget:https://www.myget.org/F/gep13/api/v2?package=Cake.VsCode.Recipe&prerelease

if(BuildSystem.IsLocalBuild)
{
    Environment.SetVariableNames(
        githubUserNameVariable: "CICDASSETSVSCODE_GITHUB_USERNAME",
        githubPasswordVariable: "CICDASSETSVSCODE_GITHUB_PASSWORD"
    );
}
else
{
    Environment.SetVariableNames();
};

BuildParameters.SetParameters(context: Context,
                            buildSystem: BuildSystem,
                            title: "CI-CD-assets-vscode",
                            repositoryOwner: "gep13",
                            repositoryName: "CI-CD-assets-vscode",
                            appVeyorAccountName: "GaryEwanPark",
                            shouldRunGitVersion: true);

BuildParameters.PrintParameters(Context);

Build.Run();
