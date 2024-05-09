import { ConfigModule, ConfigService } from '@nestjs/config';
import { Octokit } from '@octokit/rest';
import { simpleGit, SimpleGit } from 'simple-git';
import { logger } from './src/config/logger';

ConfigModule.forRoot(); // Initialize ConfigModule
const configService = new ConfigService(); // Create an instance of ConfigService

// Initialize `simple-git`
const git: SimpleGit = simpleGit();

// Create an instance of Octokit with authentication
const githubToken = configService.get<string>('GITHUB_TOKEN');
const octokit = new Octokit({ auth: githubToken });

async function getCurrentBranch(): Promise<string> {
  const branchSummary = await git.branchLocal();
  return branchSummary.current;
}

async function getDefaultBranch(owner: string, repo: string): Promise<string> {
  const response = await octokit.repos.get({ owner, repo });
  return response.data.default_branch;
}

async function getLastCommitMessage(): Promise<string> {
  const log = await git.log(['-1']);
  return log.latest?.message || '';
}

async function createPullRequest(): Promise<void> {
  // Get the repository owner and repo from environment variables
  const owner = configService.get<string>('GITHUB_OWNER');
  const repo = configService.get<string>('GITHUB_REPO_NAME');

  // Get the current working branch
  const head = await getCurrentBranch();

  // Get the default branch
  const base = await getDefaultBranch(owner, repo);

  // Get the last commit message to use as the title for the pull request
  const title = await getLastCommitMessage();

  // Create the pull request
  const response = await octokit.pulls.create({
    owner,
    repo,
    head,
    base,
    title,
  });

  logger.log(`Pull request created: ${response.data.html_url}`);
}

async function main(): Promise<void> {
  // Call the function to create a pull request
  await createPullRequest();
}

main().catch((error) => {
  logger.error('An error occurred:', error);
});
