#load "./version.cake"

public class BuildParameters
{
    public string Target { get; private set; }
    public string Configuration { get; private set; }
    public bool IsLocalBuild { get; private set; }
    public bool IsRunningOnUnix { get; private set; }
    public bool IsRunningOnWindows { get; private set; }
    public bool IsRunningOnAppVeyor { get; private set; }
    public bool IsPullRequest { get; private set; }
    public bool IsMasterRepo { get; private set; }
    public bool IsMasterBranch { get; private set; }
    public bool IsDevelopBranch { get; private set; }
    public bool IsReleaseBranch { get; private set; }
    public bool IsHotFixBranch { get; private set; }
    public bool IsTagged { get; private set; }
    public bool IsPublishBuild { get; private set; }
    public bool IsReleaseBuild { get; private set; }
    public bool SkipGitVersion { get; private set; }
    public BuildCredentials GitHub { get; private set; }
    public ChocolateyCredentials Chocolatey { get; private set; }
    public VisualStudioMarketplaceCredentials Marketplace { get; private set; }
    public WyamCredentials Wyam { get; private set; }
    public GitterCredentials Gitter { get; private set; }
    public TwitterCredentials Twitter { get; private set; }
    public BuildVersion Version { get; private set; }

    public DirectoryPath ChocolateyPackages { get; private set; }
    public DirectoryPath WyamRootDirectoryPath { get; private set; }
    public DirectoryPath WyamPublishDirectoryPath { get; private set; }
    public FilePath WyamConfigurationFile { get; private set; }
    public string WyamRecipe { get; private set; }
    public string WyamTheme { get; private set; }
    public string WyamSourceFiles { get; private set; }
    public string WebHost { get; private set; }
    public string WebLinkRoot { get; private set; }
    public string WebBaseEditUrl { get; private set; }

    public IDictionary<string, object> WyamSettings
    {
        get
        {
            var settings =
                new Dictionary<string, object>
                {
                    { "Host",  WebHost },
                    { "LinkRoot",  WebLinkRoot },
                    { "BaseEditUrl", WebBaseEditUrl },
                    { "Title", "Choco VS Code" },
                    { "IncludeGlobalNamespace", false }
                };

            return settings;
        }
    }

    public bool ShouldPublishDocumentation
    {
        get
        {
            return !IsLocalBuild &&
                    !IsPullRequest &&
                    IsMasterRepo &&
                    (IsMasterBranch || IsDevelopBranch);
        }
    }

    public bool ShouldPublish
    {
        get
        {
            return !IsLocalBuild && !IsPullRequest && IsMasterRepo
                && IsMasterBranch && IsTagged;
        }
    }

    public bool CanPostToGitter
    {
        get
        {
            return !string.IsNullOrEmpty(Gitter.Token) &&
                !string.IsNullOrEmpty(Gitter.RoomId);
        }
    }

    public bool CanPostToTwitter
    {
        get
        {
            return !string.IsNullOrEmpty(Twitter.ConsumerKey) &&
                !string.IsNullOrEmpty(Twitter.ConsumerSecret) &&
                !string.IsNullOrEmpty(Twitter.AccessToken) &&
                !string.IsNullOrEmpty(Twitter.AccessTokenSecret);
        }
    }

    public string GitterMessage
    {
        get
        {
            return "@/all Version " + Version.SemVersion + " of the CI/CD Assets VSCode Extension has just been released, https://marketplace.visualstudio.com/items?itemName=gep13.ci-cd-assets-vscode.  Full release notes: https://github.com/gep13/CI-CD-assets-vscode/releases/tag/" + Version.SemVersion;
        }
    }

    public string TwitterMessage
    {
        get
        {
            return "Version " + Version.SemVersion + " of the CI/CD Assets VSCode Extension has just been released, https://marketplace.visualstudio.com/items?itemName=gep13.ci-cd-assets-vscode. @code  Full release notes: https://github.com/gep13/CI-CD-assets-vscode/releases/tag/" + Version.SemVersion;
        }
    }

    public void SetBuildVersion(BuildVersion version)
    {
        Version  = version;
    }

    public bool CanUseWyam
    {
        get
        {
            return !string.IsNullOrEmpty(Wyam.AccessToken) &&
                !string.IsNullOrEmpty(Wyam.DeployRemote) &&
                !string.IsNullOrEmpty(Wyam.DeployBranch);
        }
    }

    public static BuildParameters GetParameters(
        ICakeContext context,
        BuildSystem buildSystem
        )
    {
        if (context == null)
        {
            throw new ArgumentNullException("context");
        }

        var target = context.Argument("target", "Default");

        return new BuildParameters {
            Target = target,
            Configuration = context.Argument("configuration", "Release"),
            IsLocalBuild = buildSystem.IsLocalBuild,
            IsRunningOnUnix = context.IsRunningOnUnix(),
            IsRunningOnWindows = context.IsRunningOnWindows(),
            IsRunningOnAppVeyor = buildSystem.AppVeyor.IsRunningOnAppVeyor,
            IsPullRequest = buildSystem.AppVeyor.Environment.PullRequest.IsPullRequest,
            IsMasterRepo = StringComparer.OrdinalIgnoreCase.Equals("gep13/CI-CD-assets-vscode", buildSystem.AppVeyor.Environment.Repository.Name),
            IsMasterBranch = StringComparer.OrdinalIgnoreCase.Equals("master", buildSystem.AppVeyor.Environment.Repository.Branch),
            IsDevelopBranch = StringComparer.OrdinalIgnoreCase.Equals("develop", buildSystem.AppVeyor.Environment.Repository.Branch),
            IsReleaseBranch = buildSystem.AppVeyor.Environment.Repository.Branch.StartsWith("release", StringComparison.OrdinalIgnoreCase),
            IsHotFixBranch = buildSystem.AppVeyor.Environment.Repository.Branch.StartsWith("hotfix", StringComparison.OrdinalIgnoreCase),
            IsTagged = (
                buildSystem.AppVeyor.Environment.Repository.Tag.IsTag &&
                !string.IsNullOrWhiteSpace(buildSystem.AppVeyor.Environment.Repository.Tag.Name)
            ),
            Chocolatey = new ChocolateyCredentials (
                apiKey: context.EnvironmentVariable("CICDASSETSVSCODE_CHOCOLATEY_APIKEY"),
                sourceUrl: context.EnvironmentVariable("CICDASSETSVSCODE_CHOCOLATEY_SOURCEURL") ?? "https://push.chocolatey.org"
            ),
            GitHub = new BuildCredentials (
                userName: context.EnvironmentVariable("CICDASSETSVSCODE_GITHUB_USERNAME"),
                password: context.EnvironmentVariable("CICDASSETSVSCODE_GITHUB_PASSWORD")
            ),
            Marketplace = new VisualStudioMarketplaceCredentials (
                token: context.EnvironmentVariable("CICDASSETSVSCODE_VSMARKETPLACE_TOKEN")
            ),
            Wyam = new WyamCredentials (
                accessToken: context.EnvironmentVariable("CICDASSETSVSCODE_WYAM_ACCESS_TOKEN"),
                deployRemote: context.EnvironmentVariable("CICDASSETSVSCODE_WYAM_DEPLOY_REMOTE"),
                deployBranch: context.EnvironmentVariable("CICDASSETSVSCODE_WYAM_DEPLOY_BRANCH")
            ),
            Gitter = new GitterCredentials (
                token: context.EnvironmentVariable("CICDASSETSVSCODE_GITTER_TOKEN"),
                roomId: context.EnvironmentVariable("CICDASSETSVSCODE_GITTER_ROOM_ID")
            ),
            Twitter = new TwitterCredentials (
                consumerKey: context.EnvironmentVariable("CICDASSETSVSCODE_TWITTER_CONSUMER_KEY"),
                consumerSecret: context.EnvironmentVariable("CICDASSETSVSCODE_TWITTER_CONSUMER_SECRET"),
                accessToken: context.EnvironmentVariable("CICDASSETSVSCODE_TWITTER_ACCESS_TOKEN"),
                accessTokenSecret: context.EnvironmentVariable("CICDASSETSVSCODE_TWITTER_ACCESS_TOKEN_SECRET")
            ),
            IsPublishBuild = new [] {
                "ReleaseNotes",
                "Create-Release-Notes"
            }.Any(
                releaseTarget => StringComparer.OrdinalIgnoreCase.Equals(releaseTarget, target)
            ),
            IsReleaseBuild = new string[] {
            }.Any(
                publishTarget => StringComparer.OrdinalIgnoreCase.Equals(publishTarget, target)
            ),
            SkipGitVersion = StringComparer.OrdinalIgnoreCase.Equals("True", context.EnvironmentVariable("CICDASSETSVSCODE_SKIP_GITVERSION")),
            ChocolateyPackages = context.MakeAbsolute(context.Directory("BuildArtifacts/_Packages/chocolatey")),
            WyamRootDirectoryPath = context.MakeAbsolute(context.Environment.WorkingDirectory),
            WyamPublishDirectoryPath = context.MakeAbsolute(context.Directory("BuildArtifacts/_PublishedDocumentation")),
            WyamConfigurationFile = context.MakeAbsolute((FilePath)"config.wyam"),
            WyamRecipe = "Docs",
            WyamTheme = "Samson",
            WebHost = "gep13.github.io",
            WebLinkRoot = "ci-cd-assets-vscode",
            WebBaseEditUrl = "https://github.com/gep13/CI-CD-assets-vscode/tree/develop/input/"
        };
    }
}

public class BuildCredentials
{
    public string UserName { get; private set; }
    public string Password { get; private set; }

    public BuildCredentials(string userName, string password)
    {
        UserName = userName;
        Password = password;
    }
}

public class ChocolateyCredentials
{
    public string ApiKey { get; private set; }
    public string SourceUrl { get; private set; }

    public ChocolateyCredentials(string apiKey, string sourceUrl)
    {
        ApiKey = apiKey;
        SourceUrl = sourceUrl;
    }
}

public class VisualStudioMarketplaceCredentials
{
    public string Token { get; private set; }

    public VisualStudioMarketplaceCredentials(string token)
    {
        Token = token;
    }
}

public class WyamCredentials
{
    public string AccessToken { get; private set; }
    public string DeployRemote { get; private set; }
    public string DeployBranch { get; private set; }

    public WyamCredentials(string accessToken, string deployRemote, string deployBranch)
    {
        AccessToken = accessToken;
        DeployRemote = deployRemote;
        DeployBranch = deployBranch;
    }
}

public class GitterCredentials
{
    public string Token { get; private set; }
    public string RoomId { get; private set; }

    public GitterCredentials(string token, string roomId)
    {
        Token = token;
        RoomId = roomId;
    }
}

public class TwitterCredentials
{
    public string ConsumerKey { get; private set; }
    public string ConsumerSecret { get; private set; }
    public string AccessToken { get; private set; }
    public string AccessTokenSecret { get; private set; }

    public TwitterCredentials(string consumerKey, string consumerSecret, string accessToken, string accessTokenSecret)
    {
        ConsumerKey = consumerKey;
        ConsumerSecret = consumerSecret;
        AccessToken = accessToken;
        AccessTokenSecret = accessTokenSecret;
    }
}
